"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import {
  artistGroups as defaultGroups,
  sharedStagesClosing as defaultClosing,
  sharedStagesHeading as defaultHeading,
  sharedStagesLabel as defaultLabel,
  sharedStagesLede as defaultLede,
  type Artist,
  type ArtistGroup,
} from "@/data/shared-stages";
import { itemKey } from "@/lib/keys";
import { usePrefersReducedMotion } from "@/components/interactions/environment";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Gap between tiles of the same row as they sweep in, in ms. */
const ROW_STEP = 90;

/**
 * Shared Stages — the international and Indian artists he has shared stages
 * with, as one side-scrolling row of portrait tiles (photo, then name) per
 * group, at every screen size: about 1.5 portraits on a phone, 2.5 on a
 * tablet and 4.5 on a desktop, the next one always peeking in. A row starts in
 * line with the page text and runs off the right edge of the screen.
 *
 * Moving a row: swipe (touch), drag (mouse), the arrow buttons beside the
 * group title (tablet and desktop), a trackpad, or the keyboard once the row
 * is focused. Cards snap one by one; a thin bar under the row fills as it is
 * scrolled.
 *
 * Motion, all switched off for reduced motion:
 *  - entry, per tile as it comes into view (once), down the page or along
 *    the row: the tile rises, a dark curtain lifts off the photo, and the
 *    name's letters type in once the photo is uncovered. Tiles that enter
 *    together are staggered left to right;
 *  - hover (pointer devices only): the photo eases in, the name lifts with a
 *    green rule drawn under it, and the other tiles in the row fall back.
 */
export function SharedStages({
  label = defaultLabel,
  heading = defaultHeading,
  lede = defaultLede,
  groups = defaultGroups,
  closing = defaultClosing,
}: {
  label?: string;
  heading?: readonly string[];
  lede?: string;
  groups?: readonly ArtistGroup[];
  closing?: string;
} = {}) {
  const [ref, visible] = useSectionVisible<HTMLElement>();
  const reduced = usePrefersReducedMotion();

  // Reveal each tile as it enters. The rows are only "armed" (tiles hidden)
  // once this runs, so without JavaScript every photo simply shows. Tiles
  // further along a row enter as the row is scrolled.
  useEffect(() => {
    const section = ref.current;
    if (!section || reduced) return;
    const tiles = Array.from(section.querySelectorAll<HTMLElement>(".shared-stages__tile"));
    section.dataset.armed = "true";

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          // DOM order is reading order: left to right, then the next row.
          .sort((a, b) => tiles.indexOf(a) - tiles.indexOf(b));
        entering.forEach((tile, i) => {
          tile.style.setProperty("--d", `${i * ROW_STEP}ms`);
          tile.dataset.shown = "true";
          observer.unobserve(tile);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    tiles.forEach((tile) => observer.observe(tile));
    return () => {
      observer.disconnect();
      delete section.dataset.armed;
    };
  }, [ref, reduced, groups]);

  return (
    <section
      ref={ref}
      id="shared-stages"
      aria-labelledby="shared-stages-title"
      data-visible={visible}
      className="section-block shared-stages relative overflow-hidden"
    >
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <p className="reveal-scroll shared-stages__label" style={delay(0)}>
          {label}
        </p>

        <div className="mt-eyebrow flex flex-col gap-heading md:flex-row md:items-end md:justify-between md:gap-2xl">
          <h2 id="shared-stages-title" className="reveal-scroll section-title" style={delay(80)}>
            {heading.map((line, i) => (
              <span key={itemKey(line, i)} className="block">
                {line}
              </span>
            ))}
          </h2>
          {lede ? (
            <p className="reveal-scroll shared-stages__lede" style={delay(160)}>
              {lede}
            </p>
          ) : null}
        </div>

        {groups.map((group, gi) => (
          <ArtistRow key={group.id} group={group} titleDelay={200 + gi * 80} />
        ))}

        {closing ? (
          <p className="reveal-scroll shared-stages__closing" style={delay(420)}>
            {closing}
          </p>
        ) : null}
      </Container>
    </section>
  );
}

/** One group: its title with the arrow buttons, the scrolling row, the bar. */
function ArtistRow({ group, titleDelay }: { group: ArtistGroup; titleDelay: number }) {
  const rowRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [ends, setEnds] = useState({ start: true, end: false });

  // The bar shows the share of the row seen so far (in view or passed); the
  // arrows switch off at either end.
  const sync = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const max = row.scrollWidth - row.clientWidth;
    const seen = row.scrollWidth > 0 ? (row.scrollLeft + row.clientWidth) / row.scrollWidth : 1;
    barRef.current?.style.setProperty("--p", Math.min(1, seen).toFixed(3));
    const next = { start: row.scrollLeft <= 2, end: row.scrollLeft >= max - 2 };
    setEnds((prev) => (prev.start === next.start && prev.end === next.end ? prev : next));
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(sync);
    window.addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", sync);
    };
  }, [sync, group]);

  // One arrow press moves by the cards fully in view, less one, so the last
  // card seen stays on screen as a landmark.
  const step = (dir: 1 | -1) => {
    const row = rowRef.current;
    const tile = row?.querySelector<HTMLElement>(".shared-stages__tile");
    if (!row || !tile) return;
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    const card = tile.offsetWidth + gap;
    const perView = Math.max(1, Math.floor((row.clientWidth + gap) / card) - 1);
    row.scrollBy({ left: dir * perView * card, behavior: "smooth" });
  };

  // Mouse drag; touch keeps the browser's own swipe.
  const onDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType === "mouse" && e.button === 0) {
      drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft };
    }
  };
  const onMove = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4 && !e.currentTarget.dataset.dragging) {
      e.currentTarget.dataset.dragging = "true";
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (e.currentTarget.dataset.dragging) e.currentTarget.scrollLeft = d.left - dx;
  };
  const onUp = (e: PointerEvent<HTMLUListElement>) => {
    drag.current = null;
    // Snapping comes back on release and settles the nearest card.
    delete e.currentTarget.dataset.dragging;
  };

  return (
    <div className="shared-stages__block">
      <div className="shared-stages__head">
        <h3 className="reveal-scroll shared-stages__group" style={delay(titleDelay)}>
          {group.label}
        </h3>
        <div className="shared-stages__arrows">
          <button
            type="button"
            className="shared-stages__arrow"
            aria-label={`Scroll ${group.label} artists back`}
            disabled={ends.start}
            onClick={() => step(-1)}
          >
            &larr;
          </button>
          <button
            type="button"
            className="shared-stages__arrow"
            aria-label={`Scroll ${group.label} artists forward`}
            disabled={ends.end}
            onClick={() => step(1)}
          >
            &rarr;
          </button>
        </div>
      </div>

      <ul
        ref={rowRef}
        className="shared-stages__grid"
        // Focusable so the row can be scrolled from the keyboard; named for
        // screen readers.
        tabIndex={0}
        aria-label={`${group.label} artists`}
        onScroll={sync}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {group.artists.map((artist, i) => (
          <ArtistTile key={itemKey(artist.name, i)} artist={artist} />
        ))}
      </ul>

      <span className="shared-stages__progress" aria-hidden>
        <span ref={barRef} className="shared-stages__progress-bar" />
      </span>
    </div>
  );
}

function ArtistTile({ artist }: { artist: Artist }) {
  return (
    <li className="shared-stages__tile">
      <span className="shared-stages__frame">
        <span className="shared-stages__zoom">
          {artist.image ? (
            <Image
              src={artist.image}
              // The name is printed under the photo, so the photo itself
              // adds nothing for a screen reader.
              alt=""
              fill
              draggable={false}
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 40vw, 62vw"
              quality={90}
              className="shared-stages__img"
              style={{ objectPosition: artist.focus ?? "50% 30%" }}
            />
          ) : (
            <span className="shared-stages__empty" aria-hidden />
          )}
        </span>
        <span className="shared-stages__curtain" aria-hidden />
      </span>
      <span className="shared-stages__name">
        {/* Screen readers get the whole name; the letters are for the eye. */}
        <span className="sr-only">{artist.name}</span>
        {/* Letters are grouped per word (a hyphen ends a word too, e.g.
            "Vishal-|Shekhar") so a line only ever breaks between words,
            never inside one. --c keeps counting across words for the
            typing stagger. */}
        {(() => {
          let c = 0;
          return artist.name.split(/(?<=[ -])/).map((chunk, w) => {
            const word = chunk.trimEnd();
            return (
              <span key={w} aria-hidden>
                <span className="shared-stages__word">
                  {word.split("").map((ch, k) => (
                    <span
                      key={k}
                      className="shared-stages__char"
                      style={{ "--c": c++ } as CSSProperties}
                    >
                      {ch}
                    </span>
                  ))}
                </span>
                {word !== chunk ? " " : null}
              </span>
            );
          });
        })()}
      </span>
    </li>
  );
}

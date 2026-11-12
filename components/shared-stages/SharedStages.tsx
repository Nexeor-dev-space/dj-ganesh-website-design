"use client";

import Image from "next/image";
import { useEffect, type CSSProperties, type UIEvent } from "react";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import {
  artistGroups as defaultGroups,
  sharedStagesClosing as defaultClosing,
  sharedStagesHeading as defaultHeading,
  sharedStagesLabel as defaultLabel,
  sharedStagesLede as defaultLede,
  type ArtistGroup,
} from "@/data/shared-stages";
import { itemKey } from "@/lib/keys";
import { usePrefersReducedMotion } from "@/components/interactions/environment";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Gap between tiles of the same row as they sweep in, in ms. */
const ROW_STEP = 90;

/**
 * Phones: the share of a side-scrolling row that is in view or already
 * passed, written to the row's progress bar (0–1). The bar starts at the
 * visible share, so it reads as "this much of the row seen".
 */
function setRowProgress(row: HTMLElement) {
  const bar = row.parentElement?.querySelector<HTMLElement>(".shared-stages__progress-bar");
  if (!bar) return;
  const seen = row.scrollWidth > 0 ? (row.scrollLeft + row.clientWidth) / row.scrollWidth : 1;
  bar.style.setProperty("--p", Math.min(1, seen).toFixed(3));
}

const onRowScroll = (e: UIEvent<HTMLUListElement>) => setRowProgress(e.currentTarget);

/**
 * Shared Stages — the international and Indian artists he has shared stages
 * with, as two grids of portrait tiles (photo, then name).
 *
 * Motion, all switched off for reduced motion:
 *  - entry, per row as it scrolls into view (once): the tiles rise one after
 *    another, a dark curtain lifts off each photo, and the name's letters type
 *    in once the photo is uncovered. Each tile is watched on its own, and the
 *    tiles that enter together are staggered left to right, so a long grid
 *    on a phone reveals row by row as it is read rather than all at once off
 *    screen;
 *  - hover (pointer devices only): the photo eases in, the name lifts with a
 *    green rule drawn under it, and the other tiles fall back.
 * Phones get the entrance only; every name is always visible.
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

  // Phones: start each row's progress bar at the share already in view, and
  // keep it right when the screen is resized or rotated.
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const rows = Array.from(section.querySelectorAll<HTMLElement>(".shared-stages__grid"));
    const update = () => rows.forEach(setRowProgress);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref, groups]);

  // Reveal each tile as it enters. The grid is only "armed" (tiles hidden)
  // once this runs, so without JavaScript every photo simply shows.
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
          // DOM order is reading order: left to right, then down.
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
          <div key={group.id} className="shared-stages__block">
            <h3 className="reveal-scroll shared-stages__group" style={delay(200 + gi * 80)}>
              {group.label}
            </h3>
            <ul
              className="shared-stages__grid"
              // A side-scrolling row on phones: focusable so it can be
              // scrolled from the keyboard, named for screen readers.
              tabIndex={0}
              aria-label={`${group.label} artists`}
              onScroll={onRowScroll}
            >
              {group.artists.map((artist, i) => (
                <li
                  key={itemKey(artist.name, i)}
                  className="shared-stages__tile"
                >
                  <span className="shared-stages__frame">
                    <span className="shared-stages__zoom">
                      {artist.image ? (
                        <Image
                          src={artist.image}
                          // The name is printed under the photo, so the
                          // photo itself adds nothing for a screen reader.
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
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
                    {/* Letters are grouped per word (a hyphen ends a word
                        too, e.g. "Vishal-|Shekhar") so a line only ever
                        breaks between words, never inside one. --c keeps
                        counting across words for the typing stagger. */}
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
              ))}
            </ul>
            {/* Phones only: how far along the row the swipe has got. */}
            <span className="shared-stages__progress" aria-hidden>
              <span className="shared-stages__progress-bar" />
            </span>
          </div>
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

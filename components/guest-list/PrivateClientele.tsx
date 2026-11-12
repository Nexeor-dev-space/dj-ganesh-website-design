"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { usePrefersReducedMotion } from "@/components/interactions/environment";
import {
  guestListCategories as defaultCategories,
  guestListCta as defaultCta,
  guestListHeading as defaultHeading,
  guestListLabel as defaultLabel,
  guestListLede as defaultLede,
  guestListStats as defaultStats,
  type GuestCategory,
  type GuestEntry,
} from "@/data/guest-list";
import { itemKey } from "@/lib/keys";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

export type ClienteleStat = { id?: string; value: number; suffix?: string; label: string };

/** "A & B" → ["A", "B"]; anything else → [text, null]. */
function splitPair(text: string): [string, string | null] {
  const at = text.indexOf(" & ");
  return at === -1 ? [text, null] : [text.slice(0, at), text.slice(at + 3)];
}

/** The card's monogram: first letters of the pair, or of the first two words. */
function monogram(text: string): [string, string | null] {
  const [a, b] = splitPair(text);
  if (b) return [a.trim()[0] ?? "", b.trim()[0] ?? null];
  const words = text.replace(/[^\p{L} ]/gu, " ").split(/\s+/).filter(Boolean);
  return [words[0]?.[0] ?? "", words[1]?.[0] ?? null];
}

/**
 * One invitation. Under a mouse it tilts toward the pointer and a green sheen
 * follows it; both are written straight to CSS variables, so moving never
 * re-renders. Touch and keyboard get the flat card.
 */
function InviteCard({ entry, category, index }: { entry: GuestEntry; category: string; index: number }) {
  const [a, b] = monogram(entry.primary);
  const [first, second] = splitPair(entry.primary);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
  };
  const onLeave = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <li className="clientele__slot" style={{ "--i": index } as CSSProperties}>
      <article className="clientele__card" onPointerMove={onMove} onPointerLeave={onLeave}>
        <span className="clientele__sheen" aria-hidden />
        <span className="clientele__tag">{category}</span>
        <span className="clientele__mono" aria-hidden>
          {a}
          {b ? (
            <>
              <span className="clientele__star">✦</span>
              {b}
            </>
          ) : null}
        </span>
        <h3 className="clientele__name">
          {first}
          {second ? (
            <>
              <span className="clientele__amp">&amp;</span>
              {second}
            </>
          ) : null}
        </h3>
        <span className="clientele__rule" aria-hidden />
        {entry.secondary ? <p className="clientele__secondary">{entry.secondary}</p> : null}
      </article>
    </li>
  );
}

/**
 * The figures, in the About band's own type (story-fact*), written at their
 * final value so they are right without
 * JavaScript; zeroed on mount and counted up the first time they are seen.
 */
function ClienteleStats({ stats }: { stats: readonly ClienteleStat[] }) {
  const listRef = useRef<HTMLDListElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list || reduced) return;
    const figures = Array.from(list.querySelectorAll<HTMLElement>("[data-count]"));
    const targets = figures.map((f) => Number(f.dataset.count) || 0);
    figures.forEach((f) => (f.textContent = "0"));

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1600);
          const eased = 1 - (1 - p) ** 3;
          figures.forEach((f, i) => (f.textContent = String(Math.round(targets[i] * eased))));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(list);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      figures.forEach((f, i) => (f.textContent = String(targets[i])));
    };
  }, [reduced, stats]);

  if (!stats.length) return null;
  return (
    <dl ref={listRef} className="story-facts clientele__stats">
      {stats.map((stat, i) => (
        <div key={stat.id ?? itemKey(stat.label, i)} className="story-fact">
          <dt className="story-fact__label">{stat.label}</dt>
          <dd className="story-fact__value">
            <span data-count={stat.value}>{stat.value}</span>
            {stat.suffix ? <span className="story-fact__suffix">{stat.suffix}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Private Clientele — the business families and the celebrity weddings, set
 * as a rail of invitation cards. Filter chips narrow the rail to one list;
 * the rail scrolls natively on touch, drags under a mouse, and steps with the
 * arrow buttons. A closing line, the counted figures and the booking link sit
 * underneath.
 */
export function PrivateClientele({
  label = defaultLabel,
  heading = defaultHeading,
  lede = defaultLede,
  categories = defaultCategories,
  stats = defaultStats,
  cta = defaultCta,
}: {
  label?: string;
  heading?: readonly string[];
  lede?: string;
  categories?: readonly GuestCategory[];
  stats?: readonly ClienteleStat[];
  cta?: { label: string; href: string };
} = {}) {
  const [sectionRef, visible] = useSectionVisible<HTMLElement>();
  const railRef = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const cards = useMemo(
    () =>
      categories
        .filter((c) => filter === "all" || c.id === filter)
        .flatMap((c) => c.entries.map((entry) => ({ entry, category: c.label }))),
    [categories, filter],
  );
  const closing = categories
    .filter((c) => filter === "all" || c.id === filter)
    .map((c) => c.closing)
    .find(Boolean);

  const step = useCallback((dir: 1 | -1) => {
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>(".clientele__slot");
    if (rail && card) rail.scrollBy({ left: dir * (card.offsetWidth + 16) * 2, behavior: "smooth" });
  }, []);

  const onDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType === "mouse") drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft };
  };
  const onMove = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) e.currentTarget.dataset.dragging = "true";
    e.currentTarget.scrollLeft = d.left - dx;
  };
  const onUp = (e: PointerEvent<HTMLUListElement>) => {
    drag.current = null;
    delete e.currentTarget.dataset.dragging;
  };

  const chips = [
    { id: "all", label: "All", shortLabel: "All" },
    ...categories.map((c) => ({ id: c.id, label: c.label, shortLabel: c.shortLabel ?? c.label })),
  ];

  return (
    <section
      ref={sectionRef}
      id="clientele"
      aria-labelledby="clientele-title"
      data-visible={visible}
      className="section-block clientele relative overflow-hidden"
    >
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <p className="reveal-scroll clientele__label" style={delay(0)}>
          {label}
        </p>

        <div className="mt-eyebrow flex flex-col gap-heading md:flex-row md:items-end md:justify-between md:gap-2xl">
          <h2 id="clientele-title" className="reveal-scroll section-title" style={delay(80)}>
            {heading.map((line, i) => (
              <span key={itemKey(line, i)} className="block">
                {line}
              </span>
            ))}
          </h2>
          {lede ? (
            <p className="reveal-scroll clientele__lede" style={delay(160)}>
              {lede}
            </p>
          ) : null}
        </div>

        <div className="reveal-scroll clientele__bar" style={delay(220)}>
          <div className="clientele__chips" role="group" aria-label="Show">
            {chips.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={filter === c.id}
                aria-label={c.label}
                className="clientele__chip"
                onClick={() => {
                  setFilter(c.id);
                  railRef.current?.scrollTo({ left: 0 });
                }}
              >
                {/* Full label from 640px; one word below it, so the three
                    pills keep to one line on a phone. */}
                <span className="clientele__chip-full">{c.label}</span>
                <span className="clientele__chip-short" aria-hidden>
                  {c.shortLabel}
                </span>
              </button>
            ))}
          </div>
          <div className="clientele__arrows">
            <button type="button" className="clientele__arrow" aria-label="Scroll cards back" onClick={() => step(-1)}>
              &larr;
            </button>
            <button type="button" className="clientele__arrow" aria-label="Scroll cards forward" onClick={() => step(1)}>
              &rarr;
            </button>
          </div>
        </div>
      </Container>

      {/* Focusable so the keyboard can scroll it; remounted per filter so the
          cards deal in again. */}
      <ul
        ref={railRef}
        key={filter}
        tabIndex={0}
        aria-label={`${label}: ${chips.find((c) => c.id === filter)?.label}`}
        className="reveal-scroll clientele__rail"
        style={delay(280)}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        {cards.map(({ entry, category }, i) => (
          <InviteCard key={`${category}-${entry.id}`} entry={entry} category={category} index={i} />
        ))}
      </ul>

      <Container className="relative z-10">
        {closing ? <p className="clientele__closing">{closing}</p> : null}
        <div className="reveal-scroll" style={delay(320)}>
          <ClienteleStats stats={stats} />
        </div>
        <a href={cta.href} data-cursor="book" className="btn-tertiary clientele__cta">
          {cta.label}
          <span aria-hidden className="btn__arrow">
            &rarr;
          </span>
        </a>
      </Container>
    </section>
  );
}

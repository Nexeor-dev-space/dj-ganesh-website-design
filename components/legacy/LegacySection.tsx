"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArchiveEntry } from "@/components/legacy/ArchiveEntry";
import { Container } from "@/components/layout/Container";
import {
  archiveCount,
  archiveSpan,
  legacyHeading,
  legacySectionLabel,
  milestones,
} from "@/lib/legacy";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Stagger between rows, in ms. */
const STEP = 70;

/**
 * Section 05 — Legacy.
 *
 * After the person comes the career, kept as a ledger: six full-width rows
 * down one spine, in chronological order, each year set against the line with
 * the entry reading across the page from it.
 *
 * A grid of cells was the wrong shape for this content. Six near-identical
 * blocks gave the eye no order to read them in — 1998 sat beside 2022 with
 * nothing to say which came first — and every entry claimed the same weight.
 * A column of rows carries the chronology in the layout itself, which is why
 * nothing has to be drawn on top to explain it.
 *
 * Every line is still printed, so there is nothing to open and no state to
 * hold: pointing at a row lights the run of spine above it, back to where the
 * career started. That is a `:has()` selector in CSS, not a component.
 */
export function LegacySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="legacy"
      aria-labelledby="legacy-title"
      data-visible={visible}
      className="section-block archive-section relative overflow-hidden"
    >
      <div className="archive-glow" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <p
          className="reveal-scroll text-[10px] font-light uppercase tracking-[0.34em] text-accent md:text-[11px]"
          style={delay(0)}
        >
          {legacySectionLabel}
        </p>

        <div className="mt-lg flex flex-col gap-lg md:mt-xl md:flex-row md:items-end md:justify-between md:gap-2xl">
          <h2
            id="legacy-title"
            className="reveal-scroll section-title"
            style={delay(80)}
          >
            {legacyHeading[0]}
            <br />
            {legacyHeading[1]}
          </h2>

          {/* The size and span of the archive. Static: with nothing to
              select there is no active row for it to name. */}
          <p
            className="reveal-scroll text-[10px] font-light uppercase tracking-[0.28em] text-white/55 md:text-right md:text-[11px]"
            style={delay(160)}
          >
            {`${archiveCount} Milestones · ${archiveSpan}`}
          </p>
        </div>

        <ol className="archive-ledger mt-2xl md:mt-3xl">
          {milestones.map((milestone, index) => (
            <ArchiveEntry
              key={milestone.id}
              milestone={milestone}
              index={index}
              total={archiveCount}
              delay={240 + index * STEP}
            />
          ))}
        </ol>
      </Container>
    </section>
  );
}

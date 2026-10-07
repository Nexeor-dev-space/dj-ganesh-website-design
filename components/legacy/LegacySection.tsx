"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MilestoneTile } from "@/components/legacy/MilestoneTile";
import { Container } from "@/components/layout/Container";
import {
  legacyHeading as defaultHeading,
  legacySectionLabel as defaultLabel,
  milestones as defaultMilestones,
} from "@/lib/legacy";
import type { Milestone } from "@/types/legacy";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Stagger between rows, in ms. */
const STEP = 70;

/**
 * Section 05 — Legacy.
 *
 * After the person comes the career, set as a wall of six equal tiles: two
 * rows of three on a desktop, three rows of two on a tablet, one column on a
 * phone. Every tile is the same size and starts its copy from the same line,
 * so the wall reads as a ledger rather than a collage.
 *
 * The tiles are divided by a hairline rather than boxed: the grid's own
 * background shows through a one-pixel gap, so the mortar is the gap itself
 * and no tile carries a border of its own.
 *
 * Nothing here holds state. A tile answers the pointer — and the keyboard —
 * with its own CSS, and the second line each tile keeps back is opened the
 * same way. Below `md`, where there is no pointer to hover with, that line is
 * simply printed.
 */
export function LegacySection({
  legacySectionLabel = defaultLabel,
  legacyHeading = defaultHeading,
  milestones = defaultMilestones,
}: {
  legacySectionLabel?: string;
  legacyHeading?: readonly string[];
  milestones?: readonly Milestone[];
} = {}) {
  // Derived from whichever list is showing (identical to lib/legacy's own
  // archiveCount/archiveSpan when the list is the code default).
  const archiveCount = milestones.length;
  const years = milestones.map((milestone) => Number(milestone.year));
  const archiveSpan = `${Math.min(...years)} — ${Math.max(...years)}`;
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
          className="reveal-scroll text-[12px] font-light uppercase tracking-[0.34em] text-accent"
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
            className="reveal-scroll text-[12px] font-light uppercase tracking-[0.28em] text-white/65 md:text-right"
            style={delay(160)}
          >
            {`${archiveCount} Milestones · ${archiveSpan}`}
          </p>
        </div>

        <div className="legacy-wall mt-xl md:mt-2xl">
          {milestones.map((milestone, index) => (
            <MilestoneTile
              key={milestone.id}
              milestone={milestone}
              delay={240 + index * STEP}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

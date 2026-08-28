"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArchiveLine } from "@/components/legacy/ArchiveLine";
import { Container } from "@/components/layout/Container";
import { MilestoneCard } from "@/components/legacy/MilestoneCard";
import {
  archiveCount,
  legacyHeading,
  legacySectionLabel,
  milestones,
} from "@/lib/legacy";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Stagger between milestone blocks, in ms. */
const STEP = 80;

/**
 * Section 05 — Legacy.
 *
 * After the person comes the career. The six milestones the client's own
 * `index.html` records are laid out as an archive rather than a timeline:
 * blocks of different weight on one asymmetric grid, tied together by a thin
 * rail of years above them, each opening to a further line when asked.
 *
 * Two pieces of state, both shallow: which block is open (a click, and only
 * one at a time, so the counter beside the heading has something to name) and
 * which is under the pointer or focus ring. Hover wins for the rail's glow
 * while it lasts, so the year lights up as you sweep across the grid.
 */
export function LegacySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeId = hoveredId ?? openId;
  const openIndex = milestones.findIndex((milestone) => milestone.id === openId);

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

          {/* Names the open block when there is one, the size of the archive
              when there isn't. `aria-live` keeps that change audible without
              moving focus. */}
          <p
            className="reveal-scroll text-[10px] font-light uppercase tracking-[0.28em] text-white/40 md:text-right md:text-[11px]"
            style={delay(160)}
            aria-live="polite"
          >
            {openIndex >= 0 ? (
              <>
                <span className="text-accent">
                  {String(openIndex + 1).padStart(2, "0")}
                </span>
                {` / ${String(archiveCount).padStart(2, "0")} — ${milestones[openIndex].year}`}
              </>
            ) : (
              `${archiveCount} Milestones · 1998 — 2026`
            )}
          </p>
        </div>

        <div className="reveal-scroll mt-2xl md:mt-3xl" style={delay(240)}>
          <ArchiveLine milestones={milestones} activeId={activeId} />
        </div>

        <div className="archive-grid mt-lg md:mt-xl">
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              index={index}
              total={archiveCount}
              open={openId === milestone.id}
              onToggle={() =>
                setOpenId((current) =>
                  current === milestone.id ? null : milestone.id,
                )
              }
              onHover={setHoveredId}
              delay={320 + index * STEP}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

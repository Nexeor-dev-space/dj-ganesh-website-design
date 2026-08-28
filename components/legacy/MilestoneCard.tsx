"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { Milestone, MilestoneWeight } from "@/types/legacy";

/**
 * Where each weight sits in the grid. One column on phones throughout; the
 * spans only start at `md`, so nothing is ever squeezed.
 *
 * At `lg` the six blocks fall into an asymmetric composition with no gaps:
 *
 *   ┌──────────┬─────────────────────────┐
 *   │ 1998     │ 2022  TAJ  (feature)    │
 *   ├──────────┤                         │
 *   │ 2023     │                         │
 *   ├──────────┼─────────────────────────┤
 *   │ 2022     │ 2023  A-LIST            │
 *   ├──────────┴─────────────────────────┤
 *   │ 2026  GLOBAL WORLD TOUR            │
 *   └────────────────────────────────────┘
 */
const SPANS: Record<MilestoneWeight, string> = {
  origin: "md:col-span-2 lg:col-span-1",
  feature: "md:col-span-2 lg:col-span-2 lg:row-span-2",
  standard: "",
  broad: "md:col-span-2",
  wide: "md:col-span-2 lg:col-span-3",
};

type MilestoneCardProps = {
  milestone: Milestone;
  /** Zero-based position, shown as the block's archive number. */
  index: number;
  total: number;
  open: boolean;
  onToggle: () => void;
  onHover: (id: string | null) => void;
  /** Stagger for the section's entrance, in ms. */
  delay: number;
};

/**
 * One block of the archive.
 *
 * Built as a disclosure rather than a hover card: the heading's button opens
 * the extra line for everyone — pointer, keyboard and touch alike — and hover
 * only sweetens it (the frame surfaces, the year takes the accent, the rule
 * extends). Nothing is discoverable by hover alone.
 */
export function MilestoneCard({
  milestone,
  index,
  total,
  open,
  onToggle,
  onHover,
  delay,
}: MilestoneCardProps) {
  const panelId = `milestone-${milestone.id}-detail`;
  const buttonId = `milestone-${milestone.id}-toggle`;
  const featured = milestone.weight === "feature" || milestone.weight === "wide";

  return (
    <article
      data-open={open}
      data-feature={featured}
      onPointerEnter={() => onHover(milestone.id)}
      onPointerLeave={() => onHover(null)}
      className={`archive-card reveal-scroll ${SPANS[milestone.weight]}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {milestone.image ? (
        <div className="archive-card__media" aria-hidden>
          <Image
            src={milestone.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      {/* The heading wraps the control, which is the accessible accordion
          pattern — a button may not contain an <h3> itself. */}
      <h3 className="archive-card__heading">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          onFocus={() => onHover(milestone.id)}
          onBlur={() => onHover(null)}
          data-cursor="explore"
          className="archive-card__toggle"
        >
          <span className="archive-card__head">
            <span className="archive-card__year">{milestone.year}</span>
            <span className="archive-card__count" aria-hidden>
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </span>

          <span className="archive-card__body">
            <span className="archive-card__rule" aria-hidden />
            <span className="archive-card__title">{milestone.title}</span>
            <span className="archive-card__lede">{milestone.lede}</span>
          </span>

          <span className="archive-card__cue" aria-hidden>
            {open ? "Close" : "Explore"}
            <span className="archive-card__cue-mark">{open ? "−" : "+"}</span>
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="archive-card__panel"
      >
        <p>{milestone.more}</p>
      </div>
    </article>
  );
}

import type { CSSProperties } from "react";
import type { Milestone } from "@/types/legacy";

type ArchiveEntryProps = {
  milestone: Milestone;
  /** Zero-based position, shown as the entry's archive number. */
  index: number;
  total: number;
  /** Stagger for the section's entrance, in ms. */
  delay: number;
};

/**
 * One entry in the ledger.
 *
 * A row rather than a cell: the year is set against the spine on the left and
 * the entry reads across the page from it, which is the way a chronology is
 * read. Every line is printed — the extra sentence each milestone carries is
 * two dozen words, and hiding it behind a control would cost a click to reveal
 * what already fits.
 *
 * Three text columns from `lg` up, so a row is two lines deep rather than six
 * and the whole career fits a screen.
 */
export function ArchiveEntry({
  milestone,
  index,
  total,
  delay,
}: ArchiveEntryProps) {
  return (
    <li
      className="archive-row reveal-scroll"
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      <span className="archive-row__year">{milestone.year}</span>

      {/* The chronology itself: a segment of the spine, with this entry's
          node on it. Decoration for the eye — the years already say it. */}
      <span className="archive-row__spine" aria-hidden>
        <span className="archive-row__node" />
      </span>

      <div className="archive-row__body">
        <h3 className="archive-row__title">{milestone.title}</h3>
        <p className="archive-row__lede">{milestone.lede}</p>
        <p className="archive-row__more">{milestone.more}</p>
      </div>

      {/* The list is ordered; the number is decoration for the eye. */}
      <span className="archive-row__index" aria-hidden>
        {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </span>
    </li>
  );
}

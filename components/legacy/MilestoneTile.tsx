import type { CSSProperties } from "react";
import type { Milestone } from "@/types/legacy";

type MilestoneTileProps = {
  milestone: Milestone;
  /** Tiles 1, 4 and 6 run double width — see `.legacy-wall`. */
  wide: boolean;
  /** Stagger for the wall's entrance, in ms. */
  delay: number;
};

/**
 * One tile of the wall.
 *
 * Year, title and the line that summarises it, with a second line held back
 * until the tile is pointed at or focused. That extra line is real content, so
 * it stays in the markup and in the accessibility tree the whole time — it is
 * clipped, not removed, and screen readers read both lines straight through.
 *
 * The tile takes focus so a keyboard can open it too. It performs no action:
 * there is nothing here to activate, only a line to read, which is why it is
 * an `article` that can be focused rather than a button that would announce
 * itself as something to press.
 */
export function MilestoneTile({ milestone, wide, delay }: MilestoneTileProps) {
  return (
    <article
      tabIndex={0}
      data-wide={wide || undefined}
      className="legacy-tile reveal-scroll"
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {/* Wipes in from the left on hover — the tile's whole frame is a
          hairline, so the accent has to arrive along one edge of it. */}
      <span className="legacy-tile__rule" aria-hidden />

      <div className="legacy-tile__body">
        <time dateTime={milestone.year} className="legacy-tile__year">
          {milestone.year}
        </time>

        <h3 className="legacy-tile__title">{milestone.title}</h3>

        <p className="legacy-tile__lede">{milestone.lede}</p>

        <p className="legacy-tile__more">
          <span>{milestone.more}</span>
        </p>
      </div>
    </article>
  );
}

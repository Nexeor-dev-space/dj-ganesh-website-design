import type { CSSProperties } from "react";
import { experienceCtaHref } from "@/data/experience";
import type { Offering as OfferingData } from "@/types/experience";

type OfferingProps = {
  offering: OfferingData;
  /** Stagger for the card's entrance, in ms. */
  delay: number;
};

/**
 * One thing he is booked for.
 *
 * A plate rather than a photograph: its own number set twice — once small in
 * the accent, once as a ghost the size of the card's corner — the title, what
 * the booking is, and the way to ask for it. The client's own file prints no
 * picture on these three, and the section reads better for it: three cards of
 * the same weight, told apart by their numbers.
 *
 * What the booking includes is held back until the card is pointed at or its
 * link is focused. It is real content, so it stays in the markup and in the
 * accessibility tree throughout — clipped, never removed. The card carries a
 * link, so `:focus-within` opens it for the keyboard with nothing extra to
 * tab through.
 */
export function Offering({ offering, delay }: OfferingProps) {
  return (
    <li
      className="exp-card reveal-scroll"
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {/* Fills down the card's leading edge as it is read. */}
      <span className="exp-card__bar" aria-hidden />

      {/* One pass of light across the plate, on hover only. */}
      <span className="exp-card__shine" aria-hidden />

      {/* The number at the size of a watermark. Decorative: the same figure
          is printed legibly at the top of the card. */}
      <span className="exp-card__ghost" aria-hidden>
        {offering.id}
      </span>

      <div className="exp-card__body">
        <span className="exp-card__index" aria-hidden>
          {offering.id}
        </span>

        <h3 className="exp-card__title">{offering.title}</h3>

        <p className="exp-card__summary">{offering.summary}</p>

        {/* The list is wrapped rather than collapsed directly: a grid with
            three items would only size its first row from the template, and
            the other two would open at full height whatever the card's
            state. One child, one row, one thing to animate. */}
        <div className="exp-card__points">
          <ul className="exp-card__points-list">
            {offering.points.map((point) => (
              <li key={point} className="exp-card__point">
                {point}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={experienceCtaHref}
          data-cursor="book"
          className="exp-card__link"
          aria-label={`${offering.cta} — ${offering.title}`}
        >
          {offering.cta}
          <span className="exp-card__arrow" aria-hidden>
            →
          </span>
        </a>
      </div>
    </li>
  );
}

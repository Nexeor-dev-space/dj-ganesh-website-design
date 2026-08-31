import Image from "next/image";
import type { CSSProperties } from "react";
import { experienceCtaHref } from "@/data/experience";
import type { Offering as OfferingData } from "@/types/experience";

type OfferingProps = {
  offering: OfferingData;
  /** Where this card samples the shared texture, and how it sits once landed. */
  crop: string;
  tilt: string;
  drift: string;
  /** Stagger for the card's entrance, in ms. */
  delay: number;
};

/**
 * One booking, on the same card the tour dates use.
 *
 * Texture behind, a scrim over it, an accent badge at the top, the title at
 * display scale and a pill at the foot — the grammar Global Reach established,
 * carrying this section's own content: what the booking is, and what it
 * includes.
 */
export function Offering({ offering, crop, tilt, drift, delay }: OfferingProps) {
  return (
    <li
      className="offer-slot"
      style={
        {
          "--tilt": tilt,
          "--drift-lg": drift,
          "--card-delay": `${delay}ms`,
        } as CSSProperties
      }
    >
      {/* Three layers, as on the tour cards: the slot drops the card in, the
          tilt holds its angle and straightens on hover, the card itself lifts. */}
      <div className="offer-tilt">
        <article
          data-sweep-host
          className="offer-card"
          style={{ "--crop": crop } as CSSProperties}
        >
          <span className="offer-card__media" aria-hidden>
            <Image
              src="/images/s-1.jpg"
              alt=""
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="offer-card__image"
            />
            <span className="offer-card__scrim" />
            <span className="overlay-grain absolute inset-0" />
          </span>

          <div className="offer-card__body">
            <span className="offer-card__index" aria-hidden>
              {offering.id}
            </span>

            <h3 className="offer-card__title">{offering.title}</h3>

            <p className="offer-card__summary">{offering.summary}</p>

            <ul className="offer-card__points">
              {offering.points.map((point) => (
                <li key={point} className="offer-card__point">
                  {point}
                </li>
              ))}
            </ul>

            <a
              href={experienceCtaHref}
              data-cursor="book"
              className="offer-card__cta btn-sweep"
              aria-label={`${offering.cta} — ${offering.title}`}
            >
              {offering.cta}
              <span className="offer-card__arrow" aria-hidden>
                →
              </span>
            </a>
          </div>
        </article>
      </div>
    </li>
  );
}

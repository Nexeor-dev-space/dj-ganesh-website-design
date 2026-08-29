import Image from "next/image";
import type { CSSProperties } from "react";
import { tourName, tourShows } from "@/lib/tour";

/**
 * Where each card samples the shared texture.
 *
 * One abstract frame serves all four — the file is requested once and each
 * card simply crops a different corner of it, so the row has variety without
 * four separate downloads, and without any card appearing to show the city it
 * names. The art is decorative; nothing about it is a picture of the venue.
 */
const CROPS = ["22% 26%", "76% 30%", "28% 74%", "80% 70%"] as const;

/**
 * How each card sits once it has landed: a small rotation and a little drift
 * off the baseline, so the run reads as four things laid down by hand rather
 * than four cells of a grid. Kept under 2.5° — past that the corners of
 * neighbouring cards close the gap between them. The drift only applies once
 * the cards sit side by side; stacked in one column it just closes the gap
 * between one card and the next.
 */
const TILTS = ["-2.2deg", "1.6deg", "-1.2deg", "2deg"] as const;
const DRIFTS = ["0px", "12px", "-8px", "6px"] as const;

/** Abstract stock art, used strictly as texture. */
const CARD_TEXTURE = "/images/s-1.jpg";

/**
 * The announced 2026 dates, one card per show.
 *
 * Each card is a single link, and the whole card is the target — a date badge,
 * the city, the room and a button that looks like a button. Behind it sits a
 * desaturated, grainy wash of the same texture the rest of the page uses, held
 * well down so the type stays the brightest thing on the card.
 *
 * Four cards sit in a row on a wide screen and stack down to one on a phone,
 * so the set is always scannable at a glance rather than scrolled through.
 */
export function UpNext() {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-md">
        <h3 className="text-[10px] font-light uppercase tracking-[0.32em] text-accent md:text-[11px]">
          Up Next
        </h3>
        <p className="text-[10px] font-light uppercase tracking-[0.24em] text-white/30 md:text-[11px]">
          {tourName}
        </p>
      </div>

      <ul className="show-cards">
        {tourShows.map((show, index) => (
          <li
            key={`${show.city}-${show.day}`}
            className="show-card-slot"
            style={
              {
                "--tilt": TILTS[index % TILTS.length],
                "--drift-lg": DRIFTS[index % DRIFTS.length],
                "--card-delay": `${index * 110}ms`,
              } as CSSProperties
            }
          >
            {/* Three layers, because each owns a transform the others must
                not overwrite: the slot drops the card in, the tilt holds its
                angle and straightens on hover, the card itself lifts. */}
            <div className="show-card-tilt">
              <div
                className="show-card"
                style={
                  { "--crop": CROPS[index % CROPS.length] } as CSSProperties
                }
              >
                <span className="show-card__media" aria-hidden>
                  <Image
                    src={CARD_TEXTURE}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    className="show-card__image"
                  />
                  <span className="show-card__scrim" />
                  <span className="overlay-grain absolute inset-0" />
                </span>

                <a
                  href={show.ticketsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="show-card__link"
                  aria-label={`Tickets for ${show.city}, ${show.day} ${show.month} 2026, ${show.venue}`}
                >
                  <span className="show-card__date" aria-hidden>
                    {show.day} {show.month}
                    <span className="show-card__year">2026</span>
                  </span>

                  <span className="show-card__city">{show.city}</span>
                  <span className="show-card__venue">{show.venue}</span>

                  <span className="show-card__cta" aria-hidden>
                    Get Tickets
                    <span className="show-card__arrow">→</span>
                  </span>
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

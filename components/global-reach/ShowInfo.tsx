import { bookingEmail, tourShows as defaultShows } from "@/lib/tour";
import type { TourShow } from "@/types/tour";
import type { GlobeAnchor } from "@/components/global-reach/TourGlobe";

type ShowInfoProps = {
  shows?: readonly TourShow[];
  city: string;
  anchor: GlobeAnchor | null;
  /** Held by a press: the panel then carries its own close. */
  pinned: boolean;
  /** Keeps the city hovered while the pointer is on the panel itself. */
  onHover: (city: string | null) => void;
  onClose: () => void;
};

/**
 * The information panel for the active city.
 *
 * A city with an announced 2026 date gets the date, the room and its ticket
 * link; every other city falls back to the enquiry, which is exactly how the
 * client's own globe behaved — nothing here invents a show that does not
 * exist. Deliberately small: on a wide screen it hangs off the marker's
 * leader line so the globe is never covered, and below `md` it drops into
 * flow underneath, where a floating panel would only crowd the frame.
 */
export function ShowInfo({
  city,
  anchor,
  shows = defaultShows,
  pinned,
  onHover,
  onClose,
}: ShowInfoProps) {
  const cityKey = city.trim().toLowerCase();
  const show = shows.find((s) => s.city.toLowerCase() === cityKey) ?? null;
  const side = anchor?.side ?? "right";

  return (
    <div
      className="show-info"
      data-anchored={anchor ? "true" : "false"}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onHover(city);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") onHover(null);
      }}
      style={
        anchor
          ? ({
              "--card-x": `${anchor.x}px`,
              "--card-y": `${anchor.y}px`,
              "--card-shift": side === "right" ? "0%" : "-100%",
            } as React.CSSProperties)
          : undefined
      }
    >
      {pinned ? (
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${city}`}
          className="show-info__close"
        >
          <span aria-hidden>&times;</span>
        </button>
      ) : null}

      <p className="show-info__label">{show ? "Next show · 2026" : "Open date"}</p>
      <p className="show-info__city">{city}</p>

      {show ? (
        <>
          <p className="show-info__date">
            {show.day} {show.month} 2026
          </p>
          <p className="show-info__venue">{show.venue}</p>
          <a
            href={show.ticketsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-tertiary show-info__cta"
          >
            Get Tickets
            <span aria-hidden className="btn__arrow">
              &rarr;
            </span>
          </a>
        </>
      ) : (
        <>
          <p className="show-info__date">No show announced</p>
          <p className="show-info__venue">Bring DJ Ganesh to your city</p>
          <a
            href={`mailto:${bookingEmail}?subject=${encodeURIComponent(
              `Booking enquiry — ${city}`,
            )}`}
            className="btn-tertiary show-info__cta"
          >
            Enquire to Book
            <span aria-hidden className="btn__arrow">
              &rarr;
            </span>
          </a>
        </>
      )}
    </div>
  );
}

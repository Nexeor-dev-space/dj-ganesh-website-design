"use client";

import { tourShows } from "@/lib/tour";

type UpNextProps = {
  activeCity: string | null;
  onHover: (city: string | null) => void;
  onSelect: (city: string) => void;
};

/**
 * The four announced dates, at a glance.
 *
 * These used to be four photographic cards. They are pills now: the globe is
 * the picture in this section, and a row of tilted cards underneath it was
 * competing with it for the same job. Each one drives the globe rather than
 * carrying its own ticket link — pressing one swings that city round and the
 * panel beside the marker gives the room and the tickets — so the section
 * makes the ticket offer once, in one place, instead of four times.
 */
export function UpNext({ activeCity, onHover, onSelect }: UpNextProps) {
  return (
    <div className="up-next">
      <h3 className="up-next__label">Up Next</h3>

      <ul className="up-next__row">
        {tourShows.map((show) => (
          <li key={`${show.city}-${show.day}`}>
            <button
              type="button"
              className="up-next__pill"
              data-active={activeCity === show.city}
              aria-label={`View the ${show.city} show, ${show.day} ${show.month} 2026 at ${show.venue}`}
              aria-pressed={activeCity === show.city}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") onHover(show.city);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") onHover(null);
              }}
              onFocus={() => onHover(show.city)}
              onBlur={() => onHover(null)}
              onClick={() => onSelect(show.city)}
            >
              <strong className="up-next__date">
                {show.day} {show.month}
              </strong>
              <span className="up-next__where">
                {show.city}
                <span aria-hidden className="up-next__sep">
                  ·
                </span>
                <span className="up-next__venue">{show.venue}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

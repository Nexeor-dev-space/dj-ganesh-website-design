"use client";

import { findShow, tourCities } from "@/lib/tour";

type CityListProps = {
  activeCity: string | null;
  onHover: (city: string | null) => void;
  onSelect: (city: string) => void;
};

/**
 * The nine cities, set as one run beneath the globe.
 *
 * This is the globe's accessible twin, not a second navigation: every marker
 * on the sphere is reachable here as a real button, so the section works by
 * keyboard and on a screen reader, and on a phone — where a 6px marker is not
 * a realistic target — it is the primary way in. Focusing a name lights its
 * marker exactly as hovering one does, which is what makes tabbing through
 * the list spin the globe.
 *
 * Set loose, with a small accent dot ahead of each name, the way the client's
 * own strip reads. No borders, no cells: the globe is the picture here and
 * this row is its caption.
 */
export function CityList({ activeCity, onHover, onSelect }: CityListProps) {
  return (
    <ul className="city-run">
      {tourCities.map((city) => {
        const show = findShow(city.name);

        return (
          <li key={city.name}>
            <button
              type="button"
              className="city-run__city"
              data-active={activeCity === city.name}
              data-booked={Boolean(show)}
              /* The globe already carries this city's date and venue; the
                 label says which cities have one so the strip is readable
                 without the globe. */
              aria-label={
                show
                  ? `View the ${city.name} show, ${show.day} ${show.month} 2026 at ${show.venue}`
                  : `View shows in ${city.name} — no date announced`
              }
              aria-pressed={activeCity === city.name}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") onHover(city.name);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") onHover(null);
              }}
              onFocus={() => onHover(city.name)}
              onBlur={() => onHover(null)}
              onClick={() => onSelect(city.name)}
            >
              <span className="city-run__dot" aria-hidden />
              {city.name}
              {city.hub ? <span className="city-run__hub">Home</span> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

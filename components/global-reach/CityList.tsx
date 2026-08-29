import { bookingEmail, findShow, tourCities } from "@/lib/tour";

/**
 * The full run of cities.
 *
 * Set loose rather than boxed: a grid of bordered cards each carrying its own
 * enquiry link read as a data table, and repeated the same call to action nine
 * times over. The names simply run on now, a dated city takes the accent, and
 * the enquiry is made once at the end where it means something.
 *
 * Each name used to print its latitude and longitude underneath. The bearings
 * were real, carried from the tour data, but they read as a coordinate dump
 * rather than as places — so the names now stand on their own and the only
 * mark beside one is "Home".
 */
export function CityList() {
  return (
    <>
      <ul className="footprint">
        {tourCities.map((city) => {
          const show = findShow(city.name);

          return (
            <li
              key={city.name}
              className="footprint__city"
              data-booked={Boolean(show)}
            >
              <span className="footprint__name">
                {city.name}
                {city.hub ? <span className="footprint__hub">Home</span> : null}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="footprint__enquiry">
        <span>Not on the list?</span>
        <a
          href={`mailto:${bookingEmail}?subject=${encodeURIComponent(
            "Booking enquiry — Global World Tour 2026",
          )}`}
        >
          Bring DJ Ganesh to your city
          <span aria-hidden>→</span>
        </a>
      </p>
    </>
  );
}

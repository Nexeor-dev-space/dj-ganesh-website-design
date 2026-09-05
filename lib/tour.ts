import type { TourCity, TourShow } from "@/types/tour";

/**
 * Global World Tour 2026 — the factual source for section 02.
 *
 * Cities, coordinates, dates and venues are carried over verbatim from the
 * existing site (`js/globe.js`, `js/worldmap.js` and the shows markup in
 * `index.html`). The coordinates drive the globe in section 02, which is what
 * they were collected for; the label offsets come from the same files.
 * Nothing here is invented; add a city or a date only from a verified source.
 */

export const tourName = "Global World Tour 2026";

/** Verified project statistic. */
export const countriesToured = { value: "45+", label: "Countries Toured" };

export const tourCities: readonly TourCity[] = [
  { name: "Mumbai", lat: 19.076, lng: 72.8777, hub: true, labelDx: -16, labelDy: -12 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867, labelDx: 44, labelDy: -6 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946, labelDx: 34, labelDy: 20 },
  { name: "Goa", lat: 15.2993, lng: 74.124, labelDx: -32, labelDy: 16 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, labelDx: -12, labelDy: -10 },
  { name: "London", lat: 51.5074, lng: -0.1278, labelDy: -10 },
  { name: "Nairobi", lat: -1.2921, lng: 36.8219, labelDy: 16 },
  { name: "New York", lat: 40.7128, lng: -74.006, labelDy: -10 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, labelDx: 8, labelDy: 16 },
] as const;

/** Announced dates, in tour order. */
export const tourShows: readonly TourShow[] = [
  {
    city: "Mumbai",
    day: "17",
    month: "Jul",
    venue: "Mercii",
    ticketsUrl: "https://instagram.com/djganesh_djg",
  },
  {
    city: "London",
    day: "19",
    month: "Jul",
    venue: "SeventySeven",
    ticketsUrl: "https://instagram.com/djganesh_djg",
  },
  {
    city: "Goa",
    day: "24",
    month: "Jul",
    venue: "Nines By The Evren · Vagator",
    ticketsUrl: "https://instagram.com/djganesh_djg",
  },
  {
    city: "Hyderabad",
    day: "25",
    month: "Jul",
    venue: "Studio XO × StoneWaters",
    ticketsUrl: "https://instagram.com/djganesh_djg",
  },
] as const;

/**
 * The animated route on the globe: the announced dates in their own order,
 * Mumbai → London → Goa → Hyderabad. Derived, never hand-written, so a new
 * date added above joins the route with nothing else to update.
 */
export const tourRoute: readonly string[] = tourShows.map((show) => show.city);

/** Where an unannounced city sends the visitor. */
export const bookingEmail = "info@djganeshbombay.com";

export function findCity(name: string | null): TourCity | null {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  return tourCities.find((city) => city.name.toLowerCase() === key) ?? null;
}

export function findShow(name: string | null): TourShow | null {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  return tourShows.find((show) => show.city.toLowerCase() === key) ?? null;
}

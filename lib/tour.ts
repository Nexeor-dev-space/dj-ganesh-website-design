import type { TourCity, TourShow } from "@/types/tour";

/**
 * Global World Tour 2026 — the factual source for section 02.
 *
 * Cities, coordinates, dates and venues are carried over verbatim from the
 * existing site (`js/worldmap.js` and the shows markup in `index.html`).
 * The coordinates are no longer printed anywhere — they are kept because they
 * are the map data this list was built from, and a map may come back.
 * Nothing here is invented; add a city or a date only from a verified source.
 */

export const tourName = "Global World Tour 2026";

/** Verified project statistic. */
export const countriesToured = { value: "45+", label: "Countries Toured" };

export const tourCities: readonly TourCity[] = [
  { name: "Mumbai", lat: 19.076, lng: 72.8777, hub: true },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Goa", lat: 15.2993, lng: 74.124 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Nairobi", lat: -1.2921, lng: 36.8219 },
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
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

/** Where an unannounced city sends the visitor. */
export const bookingEmail = "info@djganeshbombay.com";

export function findShow(name: string | null): TourShow | null {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  return tourShows.find((show) => show.city.toLowerCase() === key) ?? null;
}

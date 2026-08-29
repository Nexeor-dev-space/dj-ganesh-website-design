/** A city on the tour. */
export type TourCity = {
  name: string;
  lat: number;
  lng: number;
  /** Home base — called out on its card in the footprint. */
  hub?: boolean;
};

/** An announced 2026 date. Cities without one fall back to an enquiry. */
export type TourShow = {
  /** Must match a `TourCity.name`. */
  city: string;
  day: string;
  month: string;
  venue: string;
  ticketsUrl: string;
};

/** A location on the tour map. */
export type TourCity = {
  name: string;
  lat: number;
  lng: number;
  /** Home base — rendered slightly larger than the rest. */
  hub?: boolean;
  /** Label nudge in px, used to fan out the tight India cluster. */
  labelDx?: number;
  labelDy?: number;
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

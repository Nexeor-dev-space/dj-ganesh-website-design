/** A city on the tour. */
export type TourCity = {
  name: string;
  lat: number;
  lng: number;
  /** Home base — called out in the city strip. */
  hub?: boolean;
  /** Nudges the globe's label off the marker, in px. The India cluster sits
      within a few degrees of itself, so its four names need fanning out or
      they overprint each other. Carried from the client's own map. */
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

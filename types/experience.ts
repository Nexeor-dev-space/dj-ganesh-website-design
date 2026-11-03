/** One thing DJ Ganesh is booked for. */
export type Offering = {
  /** Printed as the index — "01", "02", "03". */
  id: string;
  title: string;
  summary: string;
  /** Three short lines of what the booking includes. */
  points: readonly string[];
  /** The call to action's label. */
  cta: string;
  /** Where this card's button goes; the booking section when not set. */
  ctaHref?: string;
  /** Rooms shown as small photos on the card (Club Nights only, for now). */
  venues?: readonly Venue[];
};

export type Venue = {
  name: string;
  /** A stand-in from the site's own photos until the venue's own arrives. */
  image: string;
};

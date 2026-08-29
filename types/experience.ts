/** One thing DJ Ganesh is booked for. */
export type Offering = {
  /** Printed as the index — "01", "02", "03". */
  id: string;
  title: string;
  summary: string;
  /** Three short lines of what the booking includes. */
  points: readonly string[];
  /** The call to action, which always leads to the booking section. */
  cta: string;
};

/**
 * One figure in the career band under the story.
 *
 * The number is kept separate from anything printed after it, so the counter
 * can animate the figure while `+` or `K` stays put.
 */
export type CareerStat = {
  /** The figure itself, counted up from zero when the band scrolls in. */
  value: number;
  /** Printed straight after the figure, e.g. `+` or `K`. */
  suffix?: string;
  /** What the figure refers to, e.g. "Gigs played". */
  label: string;
};

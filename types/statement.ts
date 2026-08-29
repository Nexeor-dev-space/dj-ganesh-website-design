/** The statement plate's content. Shape of the object in `data/statement.ts`. */
export type Statement = {
  /** One array entry per printed line, so the breaks are art-directed. */
  lines: readonly string[];
  /**
   * True only when `lines` are the artist's own words. Adds the quotation
   * marks — so the plate can never look like a quote until it is one.
   */
  spoken: boolean;
  name: string;
  note: string;
};

/**
 * How much room a milestone takes in the archive grid.
 *
 * The weight is editorial, not layout: it says how important the entry is,
 * and `MilestoneCard` maps that onto column and row spans per breakpoint.
 */
export type MilestoneWeight =
  /** The origin entry — small, but set apart as the first block. */
  | "origin"
  /** The single most important entry: two columns wide, two rows tall. */
  | "feature"
  /** An ordinary block. */
  | "standard"
  /** Two columns wide on desktop. */
  | "broad"
  /** Full width — closes the archive. */
  | "wide";

/** One entry in the career archive. Shape of the entries in `lib/legacy.ts`. */
export type Milestone = {
  id: string;
  /** Displayed large, in the corner of the block. */
  year: string;
  title: string;
  /** The line that shows before the block is opened. */
  lede: string;
  /** The extra line revealed once it is. */
  more: string;
  weight: MilestoneWeight;
  /**
   * Optional frame behind the block, revealed on hover and while open.
   * Decorative — it carries no information the copy does not, so it is
   * rendered with an empty alt.
   */
  image?: string;
};

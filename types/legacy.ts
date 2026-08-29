/** One entry in the career archive. Shape of the entries in `lib/legacy.ts`. */
export type Milestone = {
  id: string;
  /** Displayed large in the entry's own column, and the archive's spine. */
  year: string;
  title: string;
  /** The line that shows before the entry is opened. */
  lede: string;
  /** The extra line revealed once it is. */
  more: string;
};

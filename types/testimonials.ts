/** One reaction on the wall. Shape of the entries in `lib/testimonials.ts`. */
export type Testimonial = {
  /** The archive number shown in the navigation, e.g. "01". */
  id: string;
  quote: string;
  /** Name as attributed, without the city. */
  author: string;
  /** The city named in the attribution, set apart so it can be typeset back. */
  location: string;
};

/** One way to reach the booking desk. Shape of the entries in `lib/booking.ts`. */
export type BookingLink = {
  /** What the channel is, e.g. "Instagram". */
  label: string;
  /** The value itself, shown in full so it can be read or copied. */
  value: string;
  href: string;
  /** True for destinations off this site, which open in a new tab. */
  external?: boolean;
};

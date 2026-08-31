import { footerSocialLinks } from "@/data/footer";
import { bookingEmail } from "@/lib/tour";

/**
 * Everything editable on the contact page, in one place.
 *
 * Content rules this file follows, and that any edit should keep:
 *
 * — `info@djganeshbombay.com` is the only address the client's own material
 *   records. It is imported rather than retyped, so the site has one copy.
 * — No second address is invented. Until a separate general inbox exists,
 *   both desks below point at the same real one; set `NEXT_PUBLIC_GENERAL_EMAIL`
 *   to split them, and the page will show the two independently.
 * — The two accounts are the ones the client actually runs, reused from the
 *   footer. Platforms absent from the source — Spotify, SoundCloud, Facebook,
 *   X — are not listed rather than guessed at.
 * — No phone number, agent, management company or address appears anywhere,
 *   because none exists in the source.
 */

export const contactMeta = {
  eyebrow: "Contact / Booking",
  heading: ["Let's make", "something loud."] as const,
  lede: "For bookings, events, festivals, venues, private functions, collaborations and professional enquiries, get in touch.",
};

export const enquiryMeta = {
  heading: "Booking Enquiry",
  lede: "Tell us a little about your event and we'll get back to you with availability and booking details.",
  submitLabel: "Send booking request",
};

/** The dropdown's options. Deliberately short — this is not a taxonomy. */
export const eventTypes = [
  "Club / Nightlife",
  "Festival",
  "Private Event",
  "Corporate Event",
  "Wedding",
  "Brand Collaboration",
  "Other",
] as const;

export type EventType = (typeof eventTypes)[number];

/**
 * The desks. `general` falls back to the booking address rather than to a
 * second address nobody has: one inbox, honestly labelled twice, until the
 * client supplies another.
 */
export const contactDesks = [
  {
    label: "Bookings",
    address: bookingEmail,
    note: "Events, festivals, venues and private functions",
  },
  {
    label: "General enquiries",
    address: process.env.NEXT_PUBLIC_GENERAL_EMAIL || bookingEmail,
    note: "Press, collaborations and everything else",
  },
] as const;

/** The accounts the client runs, reused so there is one list on the site. */
export const connectLinks = footerSocialLinks;

export const bookingInfo = {
  heading: "Planning an event?",
  copy: "To help us respond quickly, please include your event date, location, venue, event type and expected audience in your enquiry.",
};

export const finalCta = {
  heading: ["Have an event", "in mind?"] as const,
  lede: "Let's talk.",
  label: "Make an enquiry",
  href: "#booking-enquiry",
};

export { bookingEmail };

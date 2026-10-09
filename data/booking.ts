import { bookingEmail } from "@/lib/tour";
import type { BookingLink } from "@/types/booking";

/**
 * Section 08 — Booking.
 *
 * Everything factual here comes from `djganesh-website/index.html`, the file
 * the rest of the site was built from — its `.bookcta` block, its contact rail
 * and its footer's Booking column:
 *
 *   "Want DJ Ganesh at your event?"
 *   "Weddings · Corporate · Private Parties · Club Nights · Festivals"
 *   Enquire Now → mailto:info@djganeshbombay.com
 *   Instagram · YouTube · info@djganeshbombay.com · BMT Agency
 *
 * That file has no booking form anywhere: every booking control on the site is
 * the same mailto. So this section does not have one either — no fields, no
 * endpoint, no pretence that an enquiry is being posted somewhere. The heading
 * is the site's own editorial voice, as in every other section.
 *
 * Nothing has been added: no fees, no availability, no phone number, no second
 * agency, no event counts. The email is the one already used by the tour card,
 * imported rather than repeated so there is a single copy on the site.
 */

export const bookingSectionLabel = "Booking";

/**
 * The question, two lines so it lands on its own; the second carries the
 * accent. Carried over from the closing block of `djganesh-v2/index.html`,
 * which used to be its own band above this section.
 */
export const bookingHeading = ["Ready to", "Book?"] as const;

/** The closing line, set large under the question. */
export const bookingStatement = "Let's make it a night.";

/**
 * The v2 file's own sentence, naming its three agencies. The other supplied
 * file names BMT Agency alone, and that is the one the pass links to; the
 * other two are named here as the source writes them, unlinked. That same v2
 * file books through `booking@djganesh.com`; the site keeps the one address
 * it already uses rather than introducing a second.
 */
export const bookingLede =
  "For bookings and inquiries, reach out through BMT Agency, Black Hat Talent, or VStar Entertainment.";

/** The five occasions the source names, in its order. */
export const bookingScope = [
  "Weddings",
  "Corporate",
  "Private Parties",
  "Club Nights",
  "Festivals",
] as const;

/**
 * The one action in the section. `mailto:` is the site's actual booking
 * mechanism — swap `href` for a real endpoint if a booking form is ever added.
 */
export const bookingCta = {
  label: "Book DJ Ganesh",
  href: `mailto:${bookingEmail}`,
};

export const bookingLinks: readonly BookingLink[] = [
  {
    label: "Email",
    value: bookingEmail,
    href: `mailto:${bookingEmail}`,
  },
  {
    label: "Instagram",
    value: "@djganesh_djg",
    href: "https://instagram.com/djganesh_djg",
    external: true,
  },
  {
    label: "YouTube",
    value: "@DJGANESH_DJG",
    href: "https://www.youtube.com/@DJGANESH_DJG",
    external: true,
  },
  {
    label: "Agency",
    value: "BMT Agency",
    href: "https://www.bmtagency.in",
    external: true,
  },
];

export { bookingEmail };

/**
 * The floating WhatsApp button's destination.
 *
 * The source `index.html` records no phone number anywhere — every booking
 * control on it is the mailto above — so there is nothing to carry over here.
 * The number below is a placeholder: set `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits
 * only, country code first, no `+` and no spaces) to the real booking line, or
 * edit the fallback. While the placeholder is in place the button is hidden in
 * production builds, so the site never ships a live link to a wrong number.
 */
export const whatsappPlaceholderNumber = "910000000000";

export const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
  whatsappPlaceholderNumber;

/** Shown on hover, and read by assistive tech as the link's name. */
export const whatsappLabel = "Quick Booking";

/** Pre-filled so the first message already says which act it is about. */
export const whatsappMessage =
  "Hi DJ Ganesh — I'd like to check your availability for an event.";

export const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage,
)}`;

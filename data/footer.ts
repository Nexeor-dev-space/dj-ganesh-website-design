import type { FooterSocialLink } from "@/types/footer";

/**
 * Footer content.
 *
 * Anchors point at section ids that exist in this build — verified against the
 * rendered sections, not copied from the old markup, which linked to pages and
 * sections this site does not have. Social handles and the copyright line come
 * verbatim from the client's existing `index.html`; no account is invented,
 * and platforms absent from the source (Spotify, SoundCloud) are simply not
 * listed.
 */

/**
 * The footer's four columns, as the client's own `index.html` sets them:
 * Tours, Music, Connect, Booking.
 *
 * The destinations are this site's, not that file's. Its Tours column pointed
 * "All Events", "India" and "International" at the same `#shows` anchor —
 * three labels for one place, because the filtered views they imply do not
 * exist there and do not exist here either. Each row below goes somewhere
 * real: an anchor on this page, a page on this site, or an account the client
 * actually runs. Nothing is listed that would land on a repeat of the row
 * above it.
 */
export const footerColumns = [
  {
    label: "Tours",
    links: [
      { label: "Global Reach", href: "#global-reach" },
      { label: "Up Next", href: "#global-reach" },
      { label: "The Stages", href: "#stages" },
    ],
  },
  {
    label: "Music",
    links: [
      { label: "Latest Drops", href: "#music" },
      { label: "The Full Archive", href: "/music" },
      {
        label: "YouTube · @DJGANESH_DJG",
        href: "https://www.youtube.com/@DJGANESH_DJG",
        external: true,
      },
    ],
  },
  {
    label: "Connect",
    links: [
      {
        label: "Instagram · 246K",
        href: "https://instagram.com/djganesh_djg",
        external: true,
      },
      { label: "My Story", href: "#about" },
      { label: "Testimonials", href: "#testimonials" },
    ],
  },
  {
    label: "Booking",
    links: [
      { label: "info@djganeshbombay.com", href: "mailto:info@djganeshbombay.com" },
      { label: "BMT Agency", href: "https://www.bmtagency.in", external: true },
      { label: "Enquire", href: "#booking" },
    ],
  },
] as const;

/**
 * The rail of round buttons under the columns. Two accounts and the booking
 * address — the three the source's own footer carries, and the three this
 * site can actually point at.
 */
export const footerSocialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/djganesh_djg",
    icon: "instagram",
    external: true,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@DJGANESH_DJG",
    icon: "youtube",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:info@djganeshbombay.com",
    icon: "email",
  },
] satisfies readonly FooterSocialLink[];

/** Secondary, deliberately quiet — the Booking section owns the real CTA. */
export const footerContactEmail = "info@djganeshbombay.com";

/** The frame the site closes on. */
export const footerStatement = "Follow the sound";

/** Carried over verbatim from the source footer. */
export const footerCopyright =
  "© 2026 DJ Ganesh (Ganesh Ranganathan) · Dj Ganesh Bombay · Est. 1998";

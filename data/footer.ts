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

export const footerNavLinks = [
  { label: "Home", href: "#hero" },
  { label: "Global Reach", href: "#global-reach" },
  { label: "Tracks", href: "#music" },
  { label: "My Story", href: "#about" },
  { label: "Legacy", href: "#legacy" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Booking", href: "#booking" },
] as const;

export const footerSocialLinks = [
  { label: "Instagram", href: "https://instagram.com/djganesh_djg" },
  { label: "YouTube", href: "https://www.youtube.com/@DJGANESH_DJG" },
] as const;

/** Secondary, deliberately quiet — the Booking section owns the real CTA. */
export const footerContactEmail = "info@djganeshbombay.com";

/** The frame the site closes on. */
export const footerImage = {
  src: "/images/footer.jpg",
  alt: "DJ Ganesh at the decks, playing to a full room",
};

export const footerStatement = "Follow the sound";

/** Carried over verbatim from the source footer. */
export const footerCopyright =
  "© 2026 DJ Ganesh (Ganesh Ranganathan) · Dj Ganesh Bombay · Est. 1998";

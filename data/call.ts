/**
 * The closing call — the video band before the footer.
 *
 * The copy is the booking block from `djganesh-v2/index.html`, carried over as
 * it stands: its heading, its sentence and the three agencies it names.
 *
 * Two notes on provenance, both worth settling before launch:
 *
 * 1. The other supplied file, `djganesh-website/index.html` — the one every
 *    other section on this site was built from — names BMT Agency alone. This
 *    band names all three because that is what the v2 file says.
 * 2. That same v2 file books through `booking@djganesh.com`, while the rest of
 *    this site (and `lib/tour.ts`) uses `info@djganeshbombay.com`. The CTA
 *    below points at the address the site already uses rather than
 *    introducing a second one.
 */
export const call = {
  /** Two lines, so the question lands on its own. */
  heading: ["Ready to", "Book?"] as const,
  lede: "For bookings and inquiries, reach out through BMT Agency, Black Hat Talent, or VStar Entertainment",
  ctaLabel: "Book DJ Ganesh",
  agencies: ["BMT Agency", "Black Hat Talent", "VStar Entertainment"] as const,
};

/** Background footage. Loaded only once the band is close to the viewport. */
export const callVideo = "/videos/dj-ganesh.mp4";

import type { Testimonial } from "@/types/testimonials";

/**
 * Section 07 — Testimonials.
 *
 * The three quotes below are the ones supplied in the section brief, carried
 * over word for word: nothing rewritten, no fourth voice invented, no ratings,
 * companies or figures added.
 *
 * Provenance note: these three do NOT appear in `djganesh-website/index.html`,
 * the file every other section was built from. Its `.lovewall` section carries
 * three different quotes, attributed to the Mehta family, the Kapoor wedding
 * and a private client. Confirm which set is the client's before launch —
 * swapping is an edit to this file alone.
 *
 * `author` and `location` are split only so the city can be typeset back a
 * shade quieter than the name; the attribution reads exactly as supplied.
 */

export const testimonialsSectionLabel = "Testimonials";

/** Set in two lines so the display type breaks like the other section titles. */
export const testimonialsHeading = ["The", "Reaction"] as const;

export const testimonials: readonly Testimonial[] = [
  {
    id: "01",
    quote:
      "There are DJs who play music and then there is DJ Ganesh. He read the room like he had a script. Unforgettable night.",
    author: "Priya M.",
    location: "Mumbai",
  },
  {
    id: "02",
    quote:
      "We've booked Ganesh three times for our events. Every single time, the dance floor is the last thing to empty.",
    author: "Rohit K.",
    location: "Dubai",
  },
  {
    id: "03",
    quote:
      "The BollyAfro set at our wedding was the one thing every guest talked about the next morning.",
    author: "Ananya S.",
    location: "Goa",
  },
];

import type { CareerStat } from "@/types/about";

/**
 * Section 04 — My Story.
 *
 * The copy is the client's existing bio, carried over from `index.html`
 * without embellishment: no awards, no collaborations, no milestones beyond
 * what that paragraph already states.
 *
 * `careerStats` is the exception, and the only figures on the page that did
 * not come from that file — they were supplied directly by the client. Treat
 * them as the client's to change, and do not infer new ones from them.
 */

export const aboutSectionLabel = "My Story";

/** Set in three lines so the accent can fall on BOLLYAFRO alone. */
export const aboutHeading = ["The", "BollyAfro", "Pioneer"] as const;

export const aboutStory = [
  "Started behind the decks in Mumbai, 1998, where DJ Ganesh built the BollyAfro sound: Bollywood, Afrobeats and house, mixed into one. From private nights for the Ambani family to stages in 45+ countries, he is now one of India's most booked DJs.",
  "Now on a global world tour in 2026, the journey continues.",
] as const;

/** The three strands of the BollyAfro sound, named in the bio. */
export const soundStrands = ["Bollywood", "Afrobeats", "House"] as const;

/** The year the story starts, printed on the stage frame. */
export const careerStart = "1998";

/**
 * The career in four figures. Supplied by the client.
 *
 * `28` is the span from {@link careerStart} to the 2026 tour the rest of the
 * section is written around, so the three numbers stay consistent with each
 * other; it is written out rather than computed from today's date, which
 * would drift away from that framing.
 */
export const careerStats: readonly CareerStat[] = [
  { value: 28, label: "Years behind the decks" },
  { value: 5000, suffix: "+", label: "Gigs played" },
  { value: 45, suffix: "+", label: "Countries toured" },
  { value: 246, suffix: "K", label: "Followers" },
] as const;

/** The stage frame this section closes around. */
export const aboutPortrait = {
  src: "/images/about.jpg",
  alt: "DJ Ganesh performing behind the decks, his name on the screen behind him",
};

export const aboutCta = {
  label: "Book a private event",
  href: "#booking",
};

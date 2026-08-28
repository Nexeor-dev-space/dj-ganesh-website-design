import type { StoryFact } from "@/types/about";

/**
 * Section 04 — My Story.
 *
 * The copy is the client's existing bio, carried over from `index.html`
 * without embellishment: no awards, no collaborations, no milestones beyond
 * what that paragraph already states. The three facts below are drawn from
 * the same sentences rather than added to them.
 */

export const aboutSectionLabel = "04 — My Story";

/** Set in three lines so the accent can fall on BOLLYAFRO alone. */
export const aboutHeading = ["The", "BollyAfro", "Pioneer"] as const;

export const aboutStory = [
  "Started behind the decks in Mumbai, 1998, where DJ Ganesh built the BollyAfro sound: Bollywood, Afrobeats and house, mixed into one. From private nights for the Ambani family to stages in 45+ countries, he is now one of India's most booked DJs.",
  "Now on a global world tour in 2026, the journey continues.",
] as const;

/** The three strands of the BollyAfro sound, named in the bio. */
export const soundStrands = ["Bollywood", "Afrobeats", "House"] as const;

export const storyFacts: readonly StoryFact[] = [
  { value: "1998", label: "Started in Mumbai" },
  { value: "45+", label: "Countries" },
  { value: "2026", label: "World Tour" },
] as const;

/** The portrait the original bio section used. */
export const aboutPortrait = {
  src: "/images/dj-ganesh-real.jpg",
  alt: "DJ Ganesh behind the decks",
};

export const aboutCta = {
  label: "Book a private event",
  href: "#booking",
};

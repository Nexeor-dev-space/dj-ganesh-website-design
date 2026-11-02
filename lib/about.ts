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
export const aboutHeading = ["Wedding &", "BollyAfro", "Pioneer"] as const;

export const aboutStory = [
  "Started behind the decks in Mumbai, where DJ Ganesh built the BollyAfro sound: Bollywood, Afrobeats and house, mixed into one. From private nights for the Ambani family to stages in 50+ countries, he is now one of India's most booked DJs.",
  "Now on a global world tour in 2026, the journey continues.",
] as const;

/** The three strands of the BollyAfro sound, named in the bio. */
export const soundStrands = ["Bollywood", "Afrobeats", "House"] as const;

/**
 * What each strand brings, shown in place of the story while it is hovered.
 * Keyed by name so a CMS strand left without a description still finds one.
 */
export const strandDescriptions: Readonly<Record<string, string>> = {
  Bollywood:
    "Where it starts: the film songs Mumbai grew up on, the hooks a whole room already knows by heart, recut for the dancefloor rather than played as they were pressed.",
  Afrobeats:
    "The pulse underneath. Afrobeats rhythms carry the Bollywood melodies, so a crowd that came for one hears the other and stays for both — the cross that gave BollyAfro its name.",
  House:
    "The engine room: a steady four-to-the-floor that holds a set together from first track to last, built up live with saxophone, violin and percussion on stage.",
};

/**
 * No start year until the client's revised bio arrives — the site no longer
 * dates the career anywhere. Empty, so the CMS field and seed stay in step.
 */
export const careerStart = "";

/**
 * The career in three figures. Supplied by the client. The years-behind-the-
 * decks figure is gone with the start year it was counted from.
 */
export const careerStats: readonly CareerStat[] = [
  { value: 5000, suffix: "+", label: "Gigs played" },
  { value: 50, suffix: "+", label: "Countries toured" },
  { value: 246, suffix: "K", label: "Followers" },
] as const;

/** The stage frame this section closes around. */
export const aboutPortrait = {
  src: "/images/about-07467.jpg",
  alt: "DJ Ganesh at the decks, arms raised to a packed arena, his name on the screens above",
};

export const aboutCta = {
  label: "Book a private event",
  href: "/contact#booking",
};

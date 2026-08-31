import { milestones } from "@/lib/legacy";

/**
 * The `/about` page.
 *
 * Every fact on this page already exists in the project: the biography comes
 * from `lib/about.ts` (the client's own `index.html` bio), the figures are the
 * client-supplied career stats, and the career preview is three entries lifted
 * from `lib/legacy.ts` verbatim. Nothing here adds a claim — the only new
 * strings are section labels and the two calls to action.
 */

export const aboutPageLabels = {
  intro: "About",
  story: "The Story",
  identity: "The Sound",
  experience: "Experience",
} as const;

/**
 * The bio's own sentence about the sound, pulled out as the page's opening
 * statement. Kept identical to the line inside `aboutStory[0]`.
 */
export const aboutStatement = "Bollywood, Afrobeats and house, mixed into one.";

/**
 * The story, broken where a reader needs air. The words are the client's bio,
 * unchanged; only the break points are ours — `aboutStory[0]` is two sentences
 * and reads as a wall set as one block at this size.
 */
export const aboutParagraphs = [
  "Started behind the decks in Mumbai, 1998, where DJ Ganesh built the BollyAfro sound: Bollywood, Afrobeats and house, mixed into one.",
  "From private nights for the Ambani family to stages in 45+ countries, he is now one of India's most booked DJs.",
  "Now on a global world tour in 2026, the journey continues.",
] as const;

/** The two frames this page is told through — both already in the project. */
export const aboutFrames = {
  stage: {
    src: "/images/about.jpg",
    alt: "DJ Ganesh performing behind the decks, his name on the screen behind him",
  },
  portrait: {
    src: "/images/dj-ganesh.jpg",
    alt: "DJ Ganesh photographed at an event",
  },
  decks: {
    src: "/images/dj-about.jpg",
    alt: "DJ Ganesh behind the decks",
  },
} as const;

/**
 * Three entries from the archive — the first, the award and the tour — as a
 * preview of the full history. Selected by id so the copy can never drift from
 * `lib/legacy.ts`.
 */
export const experiencePreview = ["origin", "taj", "world-tour"]
  .map((id) => milestones.find((milestone) => milestone.id === id))
  .filter((milestone) => milestone !== undefined);

/**
 * Both destinations are pages that do not exist yet. They are prepared here so
 * the links are written once, and are plain hrefs rather than `next/link` so
 * nothing breaks at build time while the routes are still missing.
 */
export const experienceHref = "/performance-history";
export const bookingHref = "/contact";

export const aboutOutro = {
  question: "Ready for the next night?",
  cta: "Book DJ Ganesh",
} as const;

/**
 * The `/about` page.
 *
 * Every fact on this page already exists in the project: the biography comes
 * from `lib/about.ts` (the client's own `index.html` bio) and the figures are
 * the client-supplied career stats. The archive and the experience sections
 * render from their own data. Nothing here adds a claim — the only new
 * strings are section labels and the two calls to action.
 */

export const aboutPageLabels = {
  intro: "About",
  story: "The Story",
  identity: "The Sound",
  /** Seeds the CMS's `labels.experience`; the page itself no longer reads it. */
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
 * Seeds the CMS's `experiencePreview.experienceHref`. The about page no longer
 * renders a preview — it carries the full archive — so nothing reads it.
 */
export const experienceHref = "/performance-history";

/** Written once here; a plain href so the outro stays a simple anchor. */
export const bookingHref = "/contact#booking";

export const aboutOutro = {
  question: "Ready for the next night?",
  cta: "Book DJ Ganesh",
} as const;

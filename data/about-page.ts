import { assetUrl } from "@/lib/asset-url";

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
 * unchanged; only the break points are ours — one sentence per paragraph, as
 * the bio reads as a wall set as one block at this size.
 */
export const aboutParagraphs = [
  "DJ Ganesh is an award-winning DJ and music producer from Mumbai, India, whose journey began in 2007 at prestigious institutions like Willingdon Sports Club and Bombay Gymkhana.",
  "Known for his signature Afro-Bollywood sound, he has performed at celebrity weddings, billionaire family celebrations, international festivals and India's leading nightclubs, including Bastian's flagship properties across the country.",
  "A multiple award winner, he continues to blend Bollywood with global electronic music, creating unforgettable dance-floor experiences worldwide.",
] as const;

/** The two frames this page is told through — both already in the project. */
export const aboutFrames = {
  stage: {
    src: assetUrl("/images/about-hero-00448.jpg"),
    alt: "A packed arena lit by phone lights, seen from behind DJ Ganesh at the decks",
  },
  portrait: {
    src: assetUrl("/images/dj-ganesh-07541.jpg"),
    alt: "DJ Ganesh, arms outstretched, in front of a packed club crowd",
  },
  decks: {
    src: assetUrl("/images/dj-about-00023.jpg"),
    alt: "A packed club under red lights, Emraan Hashmi alongside DJ Ganesh on the screens",
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

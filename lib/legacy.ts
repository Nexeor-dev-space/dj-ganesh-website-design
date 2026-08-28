import type { Milestone } from "@/types/legacy";

/**
 * Section 05 — Legacy.
 *
 * Every entry below is carried over verbatim from the `#legacy` section of the
 * supplied `index.html` (`.milestones__grid`): its `<time>`, `<h3>`, lede and
 * `.milestone__more` line. Nothing has been added — no extra awards, festivals,
 * names or figures — and no wording has been changed.
 *
 * The order here is the archive's, not the source file's: the 1998 origin
 * opens and the 2026 tour closes, so the section reads as a career rather than
 * a list. `weight` carries the composition; see `types/legacy.ts`.
 *
 * No entry carries an `image`: the page's shared frame (`PlumeRegion`) is the
 * only photography below the banner, and the flame reveals it straight through
 * the blocks. Setting `image` on a milestone still works — it layers that frame
 * inside the block alone — for when there is a real photograph of the night.
 */

export const legacySectionLabel = "05 — Legacy";

/** Set in two lines so the display type can break editorially. */
export const legacyHeading = ["The", "Archive"] as const;

export const milestones: readonly Milestone[] = [
  {
    id: "origin",
    year: "1998",
    title: "Where It All Started",
    lede: "TGIF Bangalore. Club Prive Mumbai. 28 years on the decks.",
    more: "From Thursday nights at TGIF Bangalore to Club Prive Mumbai, and everything since.",
    weight: "origin",
  },
  {
    id: "taj",
    year: "2022",
    title: "Best Wedding DJ, Taj Mahal Palace",
    lede: "Wedding Sutra Awards, Mumbai. The only DJ to win it.",
    more: "A six-hour set the Taj ballroom danced through from start to finish.",
    weight: "feature",
  },
  {
    id: "ambani",
    year: "2023",
    title: "The Ambani Events",
    lede: "Isha Ambani's engagement. Anant Ambani's pre-wedding. India's biggest private stages.",
    more: "The most private, highest-profile rooms in the country, where the music cannot miss.",
    weight: "standard",
  },
  {
    id: "karan-johar",
    year: "2022",
    title: "Karan Johar's 50th Birthday",
    lede: "The night that put him on every Bollywood producer's speed dial.",
    more: "A Bollywood-only guest list and a floor that ran till sunrise.",
    weight: "standard",
  },
  {
    id: "a-list",
    year: "2023",
    title: "Every A-List Wedding",
    lede: "Sidharth & Kiara. Hardik & Natasa. Poorna Patel. If it's Bollywood, it's Ganesh.",
    more: "The go-to sound for India's biggest weddings, from palace sangeets to beach afterparties.",
    weight: "broad",
  },
  {
    id: "world-tour",
    year: "2026",
    title: "Global World Tour",
    lede: "Mumbai to Goa to Dubai to London. BollyAfro goes international.",
    more: "Four countries and counting, from Bastian Mumbai to London's SeventySeven.",
    weight: "wide",
  },
];

/** Small editorial counter beside the heading. */
export const archiveCount = milestones.length;

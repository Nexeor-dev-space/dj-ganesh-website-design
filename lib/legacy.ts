import type { Milestone } from "@/types/legacy";

/**
 * Section 05 — Legacy.
 *
 * Every entry below is carried over verbatim from the `#legacy` section of the
 * supplied `index.html` (`.milestones__grid`): its `<time>`, `<h3>`, lede and
 * `.milestone__more` line. Nothing has been added — no extra awards, festivals,
 * names or figures — and no wording has been changed.
 *
 * The order is the client's own, carried over from that file rather than
 * re-sorted: the award opens, the origin closes. It is not chronological, and
 * that is deliberate — the section is a wall of tiles, not a timeline down a
 * spine, so the eye reads it in reading order and the year on each tile is
 * what places it. The two tiles the source gives a photograph to are the first
 * and the last, which is what sets the wall's diagonal.
 *
 * The two photographs are the client's own frames, from the gallery entries
 * those tiles pointed at — held locally rather than pulled from YouTube's
 * The wall carries no photography: every tile is type on black.
 */

export const legacySectionLabel = "Legacy";

/** Set in two lines so the display type can break editorially. */
export const legacyHeading = ["The", "Archive"] as const;

export const milestones: readonly Milestone[] = [
  {
    id: "taj",
    year: "2022",
    title: "Best Wedding DJ, Taj Mahal Palace",
    lede: "Wedding Sutra Awards, Mumbai. The only DJ to win it.",
    more: "A six-hour set the Taj ballroom danced through from start to finish.",
  },
  {
    id: "ambani",
    year: "2023",
    title: "The Ambani Events",
    lede: "Isha Ambani's engagement. Anant Ambani's pre-wedding. India's biggest private stages.",
    more: "The most private, highest-profile rooms in the country, where the music cannot miss.",
  },
  {
    id: "karan-johar",
    year: "2022",
    title: "Karan Johar's 50th Birthday",
    lede: "The night that put him on every Bollywood producer's speed dial.",
    more: "A Bollywood-only guest list and a floor that ran till sunrise.",
  },
  {
    id: "a-list",
    year: "2023",
    title: "Every A-List Wedding",
    lede: "Sidharth & Kiara. Hardik & Natasa. Poorna Patel. If it's Bollywood, it's Ganesh.",
    more: "The go-to sound for India's biggest weddings, from palace sangeets to beach afterparties.",
  },
  {
    id: "world-tour",
    year: "2026",
    title: "Global World Tour",
    lede: "Mumbai to Goa to Dubai to London. BollyAfro goes international.",
    more: "Four countries and counting, from Bastian Mumbai to London's SeventySeven.",
  },
  {
    id: "origin",
    year: "1998",
    title: "Where It All Started",
    lede: "TGIF Bangalore. Club Prive Mumbai. 28 years on the decks.",
    more: "From Thursday nights at TGIF Bangalore to Club Prive Mumbai, and everything since.",
  },
];

/** Small editorial counter beside the heading. */
export const archiveCount = milestones.length;

/**
 * The span the archive covers, built from the entries rather than restated.
 * Read as the earliest and latest year present, not the first and last tile —
 * the wall is not in chronological order, so position says nothing about date.
 */
const years = milestones.map((milestone) => Number(milestone.year));
export const archiveSpan = `${Math.min(...years)} — ${Math.max(...years)}`;

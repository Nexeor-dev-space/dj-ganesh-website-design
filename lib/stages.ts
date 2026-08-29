import type { Stage } from "@/types/stages";

/**
 * The rooms DJ Ganesh has played.
 *
 * Every name is carried over verbatim from the client's own `index.html`
 * builds — the residency line ("Bastian Mumbai · Bengaluru · Goa, Surf Club
 * Dubai and Willingdon Sports Club"), the legacy entries (TGIF Bangalore,
 * Club Prive Mumbai, Taj Mahal Palace) and the announced 2026 venues. Nothing
 * is invented: add a room only from a verified source.
 *
 * Split into three marquee rows so the band reads as a wall of stages rather
 * than a list. Row order is presentational, not chronological.
 */
export const stageRows: readonly (readonly Stage[])[] = [
  [
    { name: "Bastian Mumbai", featured: true },
    { name: "Club Prive Mumbai" },
    { name: "Surf Club Dubai" },
    { name: "TGIF Bangalore" },
  ],
  [
    { name: "Taj Mahal Palace" },
    { name: "Willingdon Sports Club" },
    { name: "Bastian Bengaluru" },
    { name: "SeventySeven" },
  ],
  [
    { name: "Nines By The Evren", featured: true },
    { name: "Studio XO × StoneWaters" },
    { name: "Bastian Goa" },
    { name: "Mercii" },
  ],
];

export const stagesSectionLabel = "Stages";

/** Set in two lines so the display type can break editorially. */
export const stagesHeading = ["The", "Rooms"] as const;

/** Verbatim from the client's residency line — not a claim of our own. */
export const stagesLede = "Every weekend is a sold-out headline set.";

/**
 * Announced dates already carry their own ticket links in section 02, so this
 * band points at the enquiry instead of implying a ticketing host.
 */
export const stagesCtaHref = "#booking";
export const stagesCtaLabel = "Book DJ Ganesh";

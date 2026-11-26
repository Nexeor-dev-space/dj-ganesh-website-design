import type { HomePage } from "@/payload-types";
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
/** None for now: the old line made a claim ("sold-out, every weekend") the client has retired. */
export const stagesLede = "";

/**
 * Announced dates already carry their own ticket links in section 02, so this
 * band points at the enquiry instead of implying a ticketing host.
 */
export const stagesCtaHref = "/contact#booking";
export const stagesCtaLabel = "Book DJ Ganesh";

const text = (v: string | null | undefined): string | undefined =>
  typeof v === "string" && v.trim() ? v : undefined;

/**
 * The Stages section's props from the Home Page global's `stages` group (the
 * section now sits on /about, its CMS fields stay where the editor set them).
 * Every value is `undefined` when the CMS leaves it empty, so the section's
 * own defaults above render. The CMS is a flat list; the three marquee rows
 * are presentation.
 */
export function stagesProps(stages: HomePage["stages"]) {
  const flat: Stage[] = (stages?.stages ?? [])
    .filter((s) => s.name)
    .map((s) => ({ id: s.id, name: s.name, ...(s.featured ? { featured: true } : {}) }));
  const size = Math.ceil(flat.length / 3);
  const heading = (stages?.heading ?? [])
    .map((row) => row.line)
    .filter((v): v is string => typeof v === "string" && v.trim() !== "");

  return {
    stagesSectionLabel: text(stages?.label),
    stagesHeading: heading.length >= 2 ? heading : undefined,
    stagesLede: text(stages?.lede),
    stagesCtaLabel: text(stages?.ctaLabel),
    stagesCtaHref: text(stages?.ctaHref),
    stageRows: flat.length
      ? [0, 1, 2].map((i) => flat.slice(i * size, (i + 1) * size)).filter((row) => row.length)
      : undefined,
  };
}

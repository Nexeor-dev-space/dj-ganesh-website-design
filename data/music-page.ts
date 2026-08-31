import { statement } from "@/data/statement";
import { allReleasesUrl, tracks } from "@/data/tracks";
import { soundStrands } from "@/lib/about";

/**
 * The dedicated Music page — `/music`.
 *
 * Copy only. Every track, file, tag, credit and YouTube id already lives in
 * `data/tracks.ts`, which the homepage section reads too: there is one archive
 * on this site and both places read it, so a release added there appears in
 * both without a second edit.
 *
 * Nothing factual is written here. The statement is the client's own bio line,
 * imported from the statement plate rather than retyped, and the strands are
 * the three the bio names. No release dates, labels, play counts or
 * collaborators — the supplied content records none, so the page shows none.
 */

export const musicPageLabels = {
  intro: "The Archive",
  archive: "All Music",
  continue: "Continue Listening",
} as const;

/** Page title, set in the display face at banner scale. */
export const musicPageTitle = "Music";

/** Verbatim from the client's bio, by way of the statement plate. */
export const musicPageStatement = statement.lines.join(" ");

/** The three strands of the sound, as named in the bio. */
export const musicPageStrands = soundStrands;

/** Read from the archive rather than written down, so it cannot drift. */
export const musicPageCount = tracks.length;

export { allReleasesUrl, tracks };

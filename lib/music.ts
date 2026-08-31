import { tracks } from "@/data/tracks";
import type { Track } from "@/types/music";

/**
 * Playback and archive helpers. The track data itself lives in
 * `data/tracks.ts`, and everything here is derived from it rather than
 * restated — so a release added there appears wherever the archive is shown,
 * with no second edit.
 */

export function youtubeWatchUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

/** `140` → `2:20`. Returns a dash placeholder until a duration is known. */
export function formatTime(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return "—:—";
  const whole = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(whole / 60);
  return `${minutes}:${String(whole % 60).padStart(2, "0")}`;
}

/* -------------------------------------------------------------------------- */
/*  Filtering the archive                                                     */
/* -------------------------------------------------------------------------- */

export const ALL_CATEGORY = "All";

/**
 * `All` plus every tag present in the data, in first-seen order. Categories
 * are the tags the tracks already carry — no taxonomy is invented on top of
 * them, and a category cannot appear that would filter down to nothing.
 */
export const categories: readonly string[] = [
  ALL_CATEGORY,
  ...Array.from(new Set(tracks.map((track) => track.tag))),
];

/** Title, category and artist — the three fields a visitor would search by. */
export function matchesQuery(track: Track, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  return [track.title, track.tag, track.artist].some((field) =>
    field.toLowerCase().includes(needle),
  );
}

export function filterTracks(
  list: readonly Track[],
  category: string,
  query: string,
): Track[] {
  return list.filter(
    (track) =>
      (category === ALL_CATEGORY || track.tag === category) &&
      matchesQuery(track, query),
  );
}

/* -------------------------------------------------------------------------- */
/*  Downloads                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * A track is downloadable only when a real file is recorded against it.
 *
 * The four mixes in `public/audio` are streaming previews, never offered as
 * downloads, so none carries a `downloadUrl` today. The archive renders a
 * download action for exactly the tracks that have one, and none for the rest
 * — rather than a button that would 404.
 */
export function isDownloadable(track: Track): boolean {
  return Boolean(track.downloadUrl);
}

/** How many of the archive's tracks can actually be downloaded right now. */
export const downloadableCount = tracks.filter(isDownloadable).length;

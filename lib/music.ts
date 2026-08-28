import type { Track } from "@/types/music";

/**
 * Section 03 — the four releases.
 *
 * Every field here is carried over verbatim from the client's existing
 * `index.html` release cards: titles, tags, artist credits, audio filenames
 * and YouTube ids. Artwork points at the local fallback images that markup
 * already referenced, so the section never depends on remote thumbnails.
 *
 * Durations are deliberately absent — they are read from the audio files
 * themselves at runtime rather than transcribed here, so they cannot drift
 * out of sync if a mix is replaced.
 */
export const tracks: Track[] = [
  {
    id: "toh-phir-aao",
    title: "Toh Phir Aao × Rapture",
    tag: "Indo Tech",
    artist: "DJ Ganesh · Indo Tech Project",
    audio: "/audio/openformat.mp3",
    youtubeId: "IJqZAwTsOo8",
    artwork: "/images/hero-toh-phir-aao.jpg",
  },
  {
    id: "move-with-woh-lamhe",
    title: "Move With Woh Lamhe",
    tag: "Afro House",
    artist: "DJ Ganesh · BollyAfro Mashup",
    audio: "/audio/afrohouse.mp3",
    youtubeId: "ZYjbzUSR3gc",
    artwork: "/images/hero-beach-club-mumbai.jpg",
  },
  {
    id: "ishq-jalakar",
    title: "Ishq Jalakar (Dhurandar)",
    tag: "Afro Mashup",
    artist: "DJ Ganesh × Ranveer Singh",
    audio: "/audio/commercial.mp3",
    youtubeId: "9C3XDY8hu6A",
    artwork: "/images/hero-bastian-breakdown.jpg",
  },
  {
    id: "tujhe-bhula-diya",
    title: "Tujhe Bhula Diya × Adore You",
    tag: "BollyAfro",
    artist: "DJ Ganesh · 2026 Blessing Edit",
    audio: "/audio/bollywood.mp3",
    youtubeId: "r94pqduA0a8",
    artwork: "/images/hero-bengaluru-bastian.jpg",
  },
];

export const musicSectionLabel = "03 — Latest Drops";
export const allReleasesUrl = "https://www.youtube.com/@DJGANESH_DJG";

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

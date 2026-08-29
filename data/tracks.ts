import type { Track } from "@/types/music";

/**
 * Section 03 — the track archive.
 *
 * Every field is carried over verbatim from the client's existing
 * `index.html` release cards: titles, tags, artist credits, audio filenames
 * and YouTube ids. Artwork points at the local images that markup already
 * referenced, so the archive never depends on remote thumbnails.
 *
 * Durations are deliberately absent. They are read from the audio files
 * themselves as metadata arrives, so a figure here could never drift out of
 * sync with the file it describes — and nothing is transcribed by hand.
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

/** Section copy — the archive framing rather than a release feed. */
export const musicSectionLabel = "Tracks";
export const musicHeading = ["The Sound", "of DJ Ganesh"] as const;

export const allReleasesUrl = "https://www.youtube.com/@DJGANESH_DJG";

import type { Track } from "@/types/music";

/** The still YouTube publishes for a video, at the size the cards need. */
function youtubeThumbnail(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

/**
 * Section 03 — the track archive.
 *
 * Every field is carried over verbatim from the client's existing
 * `index.html` release cards: titles, tags, artist credits, audio filenames
 * and YouTube ids. Each card leads with the release's own YouTube still, the
 * artwork that markup used, and falls back to the local image it also named
 * — so a blocked or missing thumbnail costs a picture, never the card.
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
    thumbnail: youtubeThumbnail("IJqZAwTsOo8"),
    artwork: "/images/hero-toh-phir-aao.jpg",
  },
  {
    id: "move-with-woh-lamhe",
    title: "Move With Woh Lamhe",
    tag: "Afro House",
    artist: "DJ Ganesh · BollyAfro Mashup",
    audio: "/audio/afrohouse.mp3",
    youtubeId: "ZYjbzUSR3gc",
    thumbnail: youtubeThumbnail("ZYjbzUSR3gc"),
    artwork: "/images/hero-beach-club-mumbai.jpg",
  },
  {
    id: "ishq-jalakar",
    title: "Ishq Jalakar (Dhurandar)",
    tag: "Afro Mashup",
    artist: "DJ Ganesh × Ranveer Singh",
    audio: "/audio/commercial.mp3",
    youtubeId: "9C3XDY8hu6A",
    thumbnail: youtubeThumbnail("9C3XDY8hu6A"),
    artwork: "/images/hero-bastian-breakdown.jpg",
  },
  {
    id: "tujhe-bhula-diya",
    title: "Tujhe Bhula Diya × Adore You",
    tag: "BollyAfro",
    artist: "DJ Ganesh · 2026 Blessing Edit",
    audio: "/audio/bollywood.mp3",
    youtubeId: "r94pqduA0a8",
    thumbnail: youtubeThumbnail("r94pqduA0a8"),
    artwork: "/images/hero-bengaluru-bastian.jpg",
  },
];

/** Section copy — the archive framing rather than a release feed. */
/** Both carried over from the client's own releases section. */
export const musicSectionLabel = "Latest Drops";
export const musicHeading = "The Music";

export const allReleasesUrl = "https://www.youtube.com/@DJGANESH_DJG";

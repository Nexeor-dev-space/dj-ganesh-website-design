import { spotifyUrl } from "@/data/tracks";

/**
 * Nonstop Sets — the homepage band after Music.
 *
 * Code only, by design: there is no CMS schema for this yet. The set titles
 * and links are placeholders until the real uploads exist; every `#` below is
 * one to replace. Spotify is the real artist page.
 */
export const nonstopLabel = "Nonstop Sets";
export const nonstopHeading = ["Press Play.", "Don't Stop."] as const;
export const nonstopLede =
  "Hour-long nonstop sets from dancefloors around the world, mixed straight through, no breaks.";

export type NonstopSet = {
  title: string;
  /** Genre or occasion, printed as the card's chip. */
  tag: string;
  length: string;
  /** A stand-in from the site's own photos until the video has a thumbnail. */
  image: string;
  href: string;
};

export const nonstopSets: readonly NonstopSet[] = [
  // TODO: YouTube link and title for set 01.
  { title: "Nonstop Set 01", tag: "BollyAfro", length: "60 min", image: "/images/g-1.jpg", href: "#" },
  // TODO: YouTube link and title for set 02.
  { title: "Nonstop Set 02", tag: "Wedding", length: "60 min", image: "/images/g-2.jpg", href: "#" },
  // TODO: YouTube link and title for set 03.
  { title: "Nonstop Set 03", tag: "Club Night", length: "60 min", image: "/images/g-4.jpg", href: "#" },
];

export const nonstopSpotifyUrl = spotifyUrl;
// TODO: Apple Podcasts archive link.
export const nonstopPodcastUrl = "#";

import { assetUrl } from "@/lib/asset-url";

/**
 * The `/about` page's photo section, set under the bio.
 *
 * The client's own photographs, ordered the way the bio tells the career:
 * the celebrity and family celebrations first, then the festival stages, then
 * the clubs. Every caption names only what the photo and its file already
 * say — no dates, figures or claims beyond the bio.
 *
 * `landscape` sets the tile's shape: a landscape frame spans two columns on
 * every screen, so it stands as tall as a portrait. Keep the portraits in
 * pairs between landscapes, or a phone row ends half empty.
 *
 * In the CMS this is the Gallery album whose Album / Category is "Journey";
 * these frames show until that album is published with photos.
 */
export type JourneyPhoto = {
  src: string;
  alt: string;
  caption: string;
  landscape?: boolean;
};

export const journeyLabel = "The Journey";

/** The section heading; the CMS album's title replaces it. */
export const journeyHeading = "On Stage";

/** The CMS album that drives the section, matched on Album / Category. */
export const journeyAlbum = "Journey";

const img = (slug: string) => assetUrl(`/images/journey/${slug}.jpg`);

export const journeyPhotos: readonly JourneyPhoto[] = [
  {
    src: img("sidharth-malhotra-kiara-advani"),
    alt: "DJ Ganesh with Sidharth Malhotra and Kiara Advani on the red carpet at a palace-lit celebration",
    caption: "With Sidharth Malhotra & Kiara Advani",
  },
  {
    src: img("khushi-kapoor-vedang-raina"),
    alt: "DJ Ganesh at the decks with Khushi Kapoor and Vedang Raina",
    caption: "With Khushi Kapoor & Vedang Raina",
  },
  {
    src: img("aryan-khan"),
    alt: "DJ Ganesh at the decks with Aryan Khan",
    caption: "With Aryan Khan",
  },
  {
    src: img("bads-of-bollywood-premiere"),
    alt: "DJ Ganesh on the red carpet at the Netflix premiere of The Ba***ds of Bollywood",
    caption: "Netflix premiere · The Ba***ds of Bollywood",
  },
  {
    src: img("udaipur-wedding-black-coffee"),
    alt: "DJ Ganesh at the decks with Black Coffee, guests dancing under red light at a palace wedding in Udaipur",
    caption: "Wedding celebration · Udaipur, with Black Coffee",
    landscape: true,
  },
  {
    src: img("udaipur-wedding"),
    alt: "DJ Ganesh sharing a laugh with Raj Mantena at a palace wedding celebration in Udaipur",
    caption: "Wedding celebration · Udaipur",
  },
  {
    src: img("club-77-london"),
    alt: "DJ Ganesh in white at the decks of Club 77 London, the crowd in front under orange light",
    caption: "Club 77 · London",
  },
  {
    src: img("sunburn-alan-walker"),
    alt: "DJ Ganesh and Alan Walker on the Sunburn stage, arms raised over a sea of hands",
    caption: "Sunburn · with Alan Walker",
    landscape: true,
  },
  {
    src: img("festival-stage"),
    alt: "DJ Ganesh on a festival stage at night, looking out over a vast crowd lit red",
    caption: "Festival stage",
    landscape: true,
  },
  {
    src: img("surf-club-honey-singh"),
    alt: "DJ Ganesh at the decks of Surf Club with Yo Yo Honey Singh on the mic and the crowd around them",
    caption: "Surf Club · with Yo Yo Honey Singh",
    landscape: true,
  },
  {
    src: img("club-night"),
    alt: "Confetti over a packed club under DJ Ganesh's name on the screens and lasers across the ceiling",
    caption: "Club night",
    landscape: true,
  },
];

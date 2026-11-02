/**
 * Section — Gallery.
 *
 * The six frames the client's own `index.html` puts in its gallery, in the
 * same order, each still linking to the set it is the cover for. The artwork
 * now comes from `public/images` rather than from YouTube's thumbnail host, so
 * the grid renders from files the project owns instead of hotlinking.
 *
 * `alt` describes each cover as it reads on the artwork itself — the titles
 * are printed on the images, so a description that repeated the filename would
 * tell a screen reader nothing.
 */
export const gallerySectionLabel = "Gallery";

/**
 * Six photographs from the Quake night (credit @echofilmers), ordered so no
 * two similar shots touch, side by side or stacked, in either the three-up
 * desktop grid or the two-up phone grid: the two Ganesh-and-Emraan close-ups
 * sit at 1 and 5, the two smoke-cannon shots at 2 and 6. Display only; a tile
 * has no link unless `href` is set.
 */
export const galleryItems: readonly { src: string; alt: string; href?: string }[] = [
  {
    src: "/images/gallery-00665.jpg",
    alt: "DJ Ganesh and Emraan Hashmi at the decks, arms up in front of a packed club",
  },
  {
    src: "/images/gallery-07499.jpg",
    alt: "DJ Ganesh at the decks, smoke cannons firing over the crowd",
  },
  {
    src: "/images/gallery-09602.jpg",
    alt: "Emraan Hashmi on stage at Quake, phones raised in the crowd",
  },
  {
    src: "/images/gallery-09863.jpg",
    alt: "Red lasers over a packed floor at Quake, Barsaate on the screens",
  },
  {
    src: "/images/gallery-00400.jpg",
    alt: "DJ Ganesh beside Emraan Hashmi at the desk as he takes the mic",
  },
  {
    src: "/images/gallery-00529.jpg",
    alt: "Looking out over a crowd of phone lights between two smoke cannons",
  },
];

/**
 * The reel that opens the gallery, ahead of the covers: footage from his
 * latest headline nights, with those nights listed beside it.
 */
export const galleryFeature = {
  videoSrc: "/videos/recent-big-shows.mp4",
  poster: "/images/recent-big-shows-poster.jpg",
  label: "Recent Big Shows",
  shows: [
    "Emraan Hashmi at Quake Hyderabad",
    "Honey Singh at Surf Club Dubai",
  ],
} as const;

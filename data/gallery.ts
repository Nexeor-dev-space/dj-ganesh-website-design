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

export const galleryItems = [
  {
    src: "/images/g-1.jpg",
    alt: "DJ Ganesh live set at Surf Club, Dubai",
    href: "https://www.youtube.com/watch?v=vgNg9iClDgg",
  },
  {
    src: "/images/g-2.jpg",
    alt: "Tujhe Bhula Diya × Adore You — DJ Ganesh × Rodolphe",
    href: "https://www.youtube.com/watch?v=K38k0QOFB0E",
  },
  {
    src: "/images/g-3.jpg",
    alt: "Bastian Breakdown Set by DJ Ganesh, Bastian At The Top",
    href: "https://www.youtube.com/watch?v=48tKPl_g9u0",
  },
  {
    src: "/images/g-4.jpg",
    alt: "DJ Ganesh Sundowner Set, recorded live at Bastian Beach Mumbai",
    href: "https://www.youtube.com/watch?v=1_jgwm910bE",
  },
  {
    src: "/images/g-5.jpg",
    alt: "One hour live set in Bengaluru, Wednesday night at Bastian Garden City",
    href: "https://www.youtube.com/watch?v=loIcmkQnis4",
  },
  {
    src: "/images/g-6.jpg",
    alt: "DJ Ganesh Valentine Mixtape 2026",
    href: "https://www.youtube.com/watch?v=VL2xSyB0dQE",
  },
] as const;

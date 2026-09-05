/**
 * The Wall of Love — the imagery that drifts behind the quotes.
 *
 * The client's own `index.html` builds these rows from `i.pravatar.cc`: forty
 * two placeholder portraits of people with no connection to the artist, shown
 * as though they were his audience. That is fabricated proof, so it is not
 * carried over. These are his own event photographs instead, from the gallery
 * in the same project folder — the rooms he actually played, which is what the
 * line above the wall claims.
 *
 * Swap in real crowd or client photography whenever there is some: this list
 * is the only thing that needs to change.
 */
export const wallImages = [
  { src: "/images/wall/gallery-wedding.png", alt: "" },
  { src: "/images/wall/gallery-club.png", alt: "" },
  { src: "/images/wall/gallery-concert.png", alt: "" },
  { src: "/images/wall/gallery-beach.png", alt: "" },
  { src: "/images/wall/gallery-corporate.png", alt: "" },
  { src: "/images/wall/gallery-cdj.png", alt: "" },
] as const;

/**
 * Tiles per half-row. Two identical halves are rendered and the track scrolls
 * exactly half its width, so the loop is seamless — but only while a single
 * half is at least as wide as the screen. Once a half is narrower, it finishes
 * crossing before the next one arrives and the row runs out of pictures.
 *
 * At full size a tile is 76px wide with a 24px gap, so a half spans
 * `28 × 100px = 2800px` — clear of any ordinary display, including 2560px.
 * Raise this, not the tile size, if the row ever has to fill something wider.
 *
 * The client's own site sets 14 here, which spans about 1322px and so leaves a
 * gap on any desktop; that number is the one thing about the wall not worth
 * copying.
 */
export const WALL_ROW_LENGTH = 28;

/**
 * Built by cycling the photographs with a per-row offset, so no two rows show
 * the same picture in the same column and the wall reads as a crowd rather
 * than as six images repeated three times.
 */
export function wallRow(rowIndex: number) {
  return Array.from({ length: WALL_ROW_LENGTH }, (_, i) => {
    const image = wallImages[(rowIndex * 4 + i) % wallImages.length];
    return { ...image, key: `${rowIndex}-${i}` };
  });
}

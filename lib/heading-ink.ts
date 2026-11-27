/**
 * The heading ink for canvases.
 *
 * A canvas can't read a CSS gradient, so the drawing code takes the same three
 * stops from the tokens in `globals.css` (`--heading-ink-start-rgb`, `-mid-rgb`,
 * `-end-rgb`) once, when it mounts, and builds its own gradients from them —
 * there is still only one place the ink is defined. The fallbacks are those
 * same values, for a canvas drawn before the stylesheet has applied.
 */

export type InkRgb = readonly [number, number, number];

export type HeadingInk = {
  start: InkRgb;
  mid: InkRgb;
  end: InkRgb;
};

/** The stops as `globals.css` declares them. */
const FALLBACK: HeadingInk = {
  start: [217, 252, 108],
  mid: [47, 224, 102],
  end: [16, 127, 69],
};

/** Where each stop sits along the wash, as in `--heading-ink-gradient`. */
const STOPS = [
  ["start", 0],
  ["mid", 0.55],
  ["end", 1],
] as const;

function parseRgb(value: string, fallback: InkRgb): InkRgb {
  const parts = value.trim().split(/[\s,/]+/).map(Number);
  if (parts.length < 3 || parts.slice(0, 3).some((n) => !Number.isFinite(n))) return fallback;
  return [parts[0], parts[1], parts[2]];
}

/** Reads the three stops off the document's tokens. */
export function readHeadingInk(): HeadingInk {
  if (typeof document === "undefined") return FALLBACK;
  const styles = getComputedStyle(document.documentElement);
  return {
    start: parseRgb(styles.getPropertyValue("--heading-ink-start-rgb"), FALLBACK.start),
    mid: parseRgb(styles.getPropertyValue("--heading-ink-mid-rgb"), FALLBACK.mid),
    end: parseRgb(styles.getPropertyValue("--heading-ink-end-rgb"), FALLBACK.end),
  };
}

/** One stop as a canvas colour, at an alpha. */
export function inkRgba(rgb: InkRgb, alpha = 1): string {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

/** The wash from (x0, y0) to (x1, y1), at an alpha, for a stroke or a fill. */
export function inkGradient(
  ctx: CanvasRenderingContext2D,
  ink: HeadingInk,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  alpha = 1,
): CanvasGradient {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const [stop, offset] of STOPS) gradient.addColorStop(offset, inkRgba(ink[stop], alpha));
  return gradient;
}

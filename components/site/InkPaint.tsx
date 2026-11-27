/**
 * The heading ink as an SVG paint server, defined once per page.
 *
 * A gradient can't be a `fill` or `stroke` colour, so icons drawn in
 * `currentColor` reach the ink through this: `--heading-ink-paint` points at
 * it, and a state that sets `--ink-paint` repaints every such icon inside it
 * (see `globals.css`). The stops take their colours from the same tokens as
 * the CSS wash, so there is still only one place the ink is defined.
 *
 * Sized to nothing rather than `display: none`, which would stop some
 * browsers from resolving the gradient at all.
 */
export function InkPaint() {
  return (
    <svg aria-hidden focusable="false" width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="heading-ink-paint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" className="ink-paint__start" />
          <stop offset="0.55" className="ink-paint__mid" />
          <stop offset="1" className="ink-paint__end" />
        </linearGradient>
      </defs>
    </svg>
  );
}

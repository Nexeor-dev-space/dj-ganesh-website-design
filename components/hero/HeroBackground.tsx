import { ColourPlume } from "@/components/effects/ColourPlume";

/**
 * The hero photograph.
 *
 * `public/images/bg-banner-3.png` is the fixed visual identity of the first
 * viewport — it is never altered on disk. It renders dark, desaturated and
 * grainy (`.hero-photo` + `.overlay-grain`), with `ColourPlume` painting the
 * same frame back in full colour wherever the pointer's flame has just passed.
 *
 * On load the stack settles in from a slight zoom (`.hero-reveal`), then
 * drifts slowly forever after (`.media-drift`). From desktop widths with a
 * precise pointer, the whole layer pins to the viewport (`.hero-bg-pin`) so it
 * holds in place while the hero's one-screen height scrolls past, rather than
 * scrolling away with it.
 */
export function HeroBackground() {
  return (
    <div className="hero-bg-pin pointer-events-none overflow-hidden" aria-hidden>
      <div className="hero-reveal absolute inset-0">
        <ColourPlume
          src="/images/bg-banner-3.png"
          className="media-drift absolute inset-0"
          /* Keeps his face in frame when the crop tightens on narrow screens. */
          imageClassName="hero-photo object-cover object-[54%_18%] sm:object-[52%_22%] lg:object-center"
          priority
        />

        <div className="overlay-grain absolute inset-0" />
      </div>
    </div>
  );
}

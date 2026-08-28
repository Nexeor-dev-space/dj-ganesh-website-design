import Image from "next/image";

/**
 * The hero photograph.
 *
 * `public/images/banner-bg.png` is the fixed visual identity of the first
 * viewport — it is never swapped, altered on disk, or filtered. No overlay,
 * grade, or darkening sits on top of it.
 *
 * On load it settles in from a slight zoom (`.hero-reveal`), then drifts
 * slowly forever after (`.media-drift`). From desktop widths with a precise
 * pointer, the whole layer pins to the viewport (`.hero-bg-pin`) so it holds
 * in place while the hero's one-screen height scrolls past, rather than
 * scrolling away with it.
 */
export function HeroBackground() {
  return (
    <div className="hero-bg-pin pointer-events-none overflow-hidden" aria-hidden>
      <div className="hero-reveal absolute inset-0">
        <div className="media-drift absolute inset-0">
          <Image
            src="/images/banner-bg.png"
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            /* Keeps his face in frame when the crop tightens on narrow screens. */
            className="object-cover object-[54%_18%] sm:object-[52%_22%] lg:object-center"
          />
        </div>
      </div>
    </div>
  );
}

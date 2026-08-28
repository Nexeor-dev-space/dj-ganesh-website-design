import Image from "next/image";

/**
 * The hero photograph.
 *
 * `public/images/banner-bg.png` is the fixed visual identity of the first
 * viewport — it is never swapped or altered on disk. The grayscale/contrast
 * grade is CSS (`.hero-photo`); no darkening overlay sits on top of it.
 *
 * Absolutely positioned so it can never shift hero content.
 */
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="media-drift absolute inset-0">
        <Image
          src="/images/banner-bg.png"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          /* Keeps his face in frame when the crop tightens on narrow screens. */
          className="hero-photo reveal-fade object-cover object-[54%_18%] sm:object-[52%_22%] lg:object-center"
        />
      </div>
    </div>
  );
}

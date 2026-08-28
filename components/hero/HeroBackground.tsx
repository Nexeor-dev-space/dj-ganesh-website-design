import Image from "next/image";

/**
 * The hero photograph.
 *
 * `public/images/banner-bg.png` is the fixed visual identity of the first
 * viewport — it is never swapped, altered on disk, or filtered. No overlay,
 * grade, or darkening sits on top of it.
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
          className="reveal-fade object-cover object-[54%_18%] sm:object-[52%_22%] lg:object-center"
        />
      </div>
    </div>
  );
}

import Image from "next/image";

/**
 * The hero photograph.
 *
 * `public/images/banner-bg.png` is the fixed visual identity of the first
 * viewport — it is never swapped or altered on disk. All treatment (grade,
 * grain, vignette, scrims) happens in CSS on top of it.
 *
 * Everything here is decorative and absolutely positioned, so it can never
 * shift hero content.
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

      {/* 1 — overall darkening; the DJ must stay clearly readable */}
      <div className="absolute inset-0 bg-[rgba(5,5,5,0.3)]" />
      {/* 2 — bottom-to-top black, where the lockup and utility rail sit */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 via-30% to-transparent" />
      {/* 3 — top scrim, keeps the navigation legible */}
      <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-background/80 to-transparent" />
      {/* 4 — weight down the left column, the typography's home */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
      {/* 5 — vignette */}
      <div className="overlay-vignette absolute inset-0" />
      {/* 6 — film grain */}
      <div className="overlay-grain absolute inset-0" />
    </div>
  );
}

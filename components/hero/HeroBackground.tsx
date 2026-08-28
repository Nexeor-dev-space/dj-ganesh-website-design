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
      <div className="absolute inset-0 bg-[rgba(5,5,5,0.14)]" />
      {/* 2 — bottom-to-top black, where the lockup and utility rail sit */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 via-32% to-transparent" />
      {/* 3 — top scrim, keeps the navigation legible */}
      <div className="absolute inset-x-0 top-0 h-[28%] bg-gradient-to-b from-background/55 to-transparent" />
      {/* 4 — a dark pool in the lower-left corner, exactly where the lockup
              lives. Fades out before it reaches his face or the right side, so
              the photograph stays open. */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_72%_at_-8%_100%,rgba(5,5,5,0.9)_0%,rgba(5,5,5,0.45)_42%,transparent_74%)]" />
      {/* 5 — vignette */}
      <div className="overlay-vignette absolute inset-0" />
      {/* 6 — film grain */}
      <div className="overlay-grain absolute inset-0" />
    </div>
  );
}

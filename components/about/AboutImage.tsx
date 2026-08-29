import { ColourPlume } from "@/components/effects/ColourPlume";
import { aboutPortrait } from "@/lib/about";

/**
 * The stage frame.
 *
 * Full width on phones and off the right edge of the screen from `lg`, where
 * it also sticks: the photograph holds still while the story scrolls past it.
 *
 * The same treatment as the banner and the footer — graded to black and white,
 * grained, with the pointer's plume burning the original colour back through
 * it. The file on disk is never altered.
 */
export function AboutImage() {
  return (
    <figure
      data-cursor="explore"
      /* Scopes the plume to this frame. The section sits inside the page's
         shared plume region, and without this the flame here would reveal
         that region's frame instead of the portrait. */
      data-plume-region
      className="story-frame"
    >
      <ColourPlume
        src={aboutPortrait.src}
        alt={aboutPortrait.alt}
        className="absolute inset-0"
        /* Keeps him and the raised arm in frame as the crop widens. */
        imageClassName="hero-photo object-cover object-[54%_46%] sm:object-[52%_44%] lg:object-[50%_42%]"
        sizes="(min-width: 1024px) 52vw, 100vw"
        /* This frame is around half the width of the page, so sized against
           itself the flame would come out half the banner's. Measured against
           the screen instead, it burns at the same size here as it does
           there. */
        sizing="viewport"
      />

      <div className="story-frame__fade" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />
    </figure>
  );
}

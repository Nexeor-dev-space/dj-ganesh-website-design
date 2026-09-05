import Image from "next/image";
import { aboutPortrait } from "@/lib/about";

/**
 * The stage frame.
 *
 * Full width on phones and off the right edge of the screen from `lg`, where
 * it also sticks: the photograph holds still while the story scrolls past it.
 *
 * The same treatment as the banner and the footer — graded to black and white
 * and grained. The file on disk is never altered.
 */
export function AboutImage() {
  return (
    <figure data-cursor="explore" className="story-frame">
      <Image
        src={aboutPortrait.src}
        alt={aboutPortrait.alt}
        fill
        /* Keeps him and the raised arm in frame as the crop widens. */
        className="hero-photo object-cover object-[54%_46%] sm:object-[52%_44%] lg:object-[50%_42%]"
        sizes="(min-width: 1024px) 52vw, 100vw"
      />

      <div className="story-frame__fade" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />
    </figure>
  );
}

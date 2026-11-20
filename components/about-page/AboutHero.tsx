"use client";

import Image from "next/image";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { aboutFrames } from "@/data/about-page";


/**
 * The opening frame.
 *
 * His name at page scale over the stage still, with the bio's own line about
 * the sound set beneath it — the claim first, the paragraph later. The frame
 * runs the full width of the screen; everything printed on it keeps the site's
 * gutters.
 */
type AboutHeroProps = {
  stage?: { src: string; alt: string };
};

export function AboutHero({
  stage = aboutFrames.stage,
}: AboutHeroProps = {}) {
  const [ref, visible] = useSectionVisible<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-hidden
      data-visible={visible}
      className="about-hero relative overflow-hidden"
    >
      <div className="about-hero__frame">
        <Image
          src={stage.src}
          alt={stage.alt}
          fill
          preload
          sizes="100vw"
          quality={90}
          /* Keeps the decks and the lit crowd in frame as the crop narrows. */
          className="about-hero__image object-cover object-[50%_55%] md:object-[50%_45%]"
        />
        <div className="about-hero__fade" aria-hidden />
      </div>

      {/* The photo alone, as a strip under the navigation; the page's
          words, and its heading, start with The Story. */}
    </section>
  );
}

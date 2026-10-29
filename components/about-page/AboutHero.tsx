"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { aboutFrames, aboutPageLabels } from "@/data/about-page";
import { aboutParagraphs } from "@/data/about-page";
import { careerStart, soundStrands } from "@/lib/about";
import { siteConfig } from "@/lib/site";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * The opening frame.
 *
 * His name at page scale over the stage still, with the bio's own line about
 * the sound set beneath it — the claim first, the paragraph later. The frame
 * runs the full width of the screen; everything printed on it keeps the site's
 * gutters.
 */
type AboutHeroProps = {
  intro?: string;
  strands?: readonly string[];
  since?: string;
  lede?: string;
  stage?: { src: string; alt: string };
};

export function AboutHero({
  intro = aboutPageLabels.intro,
  strands = soundStrands,
  since = careerStart,
  lede = aboutParagraphs[2],
  stage = aboutFrames.stage,
}: AboutHeroProps = {}) {
  const [ref, visible] = useSectionVisible<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="about-page-title"
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

      <Container className="about-hero__body relative z-10">
        <p className="reveal-scroll about-label" style={delay(0)}>
          {intro}
        </p>

        <h1
          id="about-page-title"
          className="reveal-scroll about-hero__name"
          style={delay(90)}
        >
          {siteConfig.name}
        </h1>


        <div className="reveal-scroll about-hero__meta" style={delay(260)}>
          <p className="about-hero__strands">
            {strands.map((strand, index) => (
              <span key={strand}>
                {index > 0 ? (
                  <span aria-hidden className="mx-sm text-white/25">
                    /
                  </span>
                ) : null}
                {strand}
              </span>
            ))}
          </p>

          {/* No year until the revised bio arrives; the city stands alone. */}
          <p className="about-hero__since">Mumbai{since ? ` · ${since}` : ""}</p>
        </div>

        <p className="reveal-scroll about-hero__lede" style={delay(340)}>
          {lede}
        </p>
      </Container>
    </section>
  );
}

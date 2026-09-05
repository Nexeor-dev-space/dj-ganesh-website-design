"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { aboutFrames, aboutPageLabels, aboutStatement } from "@/data/about-page";
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
export function AboutHero() {
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
          src={aboutFrames.stage.src}
          alt={aboutFrames.stage.alt}
          fill
          priority
          sizes="100vw"
          /* Holds his face and the lit wall behind him as the crop narrows. */
          className="about-hero__image object-cover object-[46%_34%] md:object-[48%_38%]"
        />
        <div className="about-hero__fade" aria-hidden />

        <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />
      </div>

      <Container className="about-hero__body relative z-10">
        <p className="reveal-scroll about-label" style={delay(0)}>
          {aboutPageLabels.intro}
        </p>

        <h1
          id="about-page-title"
          className="reveal-scroll about-hero__name"
          style={delay(90)}
        >
          {siteConfig.name}
        </h1>

        <p className="reveal-scroll about-hero__statement" style={delay(180)}>
          {aboutStatement}
        </p>

        <div className="reveal-scroll about-hero__meta" style={delay(260)}>
          <p className="about-hero__strands">
            {soundStrands.map((strand, index) => (
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

          <p className="about-hero__since">Mumbai · {careerStart}</p>
        </div>

        <p className="reveal-scroll about-hero__lede" style={delay(340)}>
          {aboutParagraphs[2]}
        </p>
      </Container>
    </section>
  );
}

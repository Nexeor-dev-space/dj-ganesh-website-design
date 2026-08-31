"use client";

import Image from "next/image";
import { ColourPlume } from "@/components/effects/ColourPlume";
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
      {/* Scopes the plume to this frame. Without it the nearest region is the
          site-wide one in the layout, and the flame would reveal that frame
          instead of this photograph. */}
      <div className="about-hero__frame" data-plume-region>
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

        {/* The colour pass, above the fade so the flame reveals the frame at
            full strength rather than through 80% black. Its own copy of the
            photograph is invisible — the canvas reads that element's pixels,
            which CSS opacity does not touch — and carries the same crop, so
            the two frames stay registered at every width. */}
        <ColourPlume
          src={aboutFrames.stage.src}
          className="absolute inset-0"
          imageClassName="opacity-0 object-cover object-[46%_34%] md:object-[48%_38%]"
          sizes="100vw"
        />

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

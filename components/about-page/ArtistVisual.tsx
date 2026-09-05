"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { aboutFrames, aboutPageLabels, aboutStatement } from "@/data/about-page";
import { soundStrands } from "@/lib/about";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Two frames and the three strands of the sound.
 *
 * The portrait leads and the deck shot steps in under it, overlapping its
 * corner, so the pair reads as a spread rather than a gallery of two. The
 * strands are the only claim about the music the client's own copy makes, so
 * they are set at display scale rather than padded out with invented
 * influences.
 *
 * Both frames carry the banner's treatment: graded to black and white.
 */
export function ArtistVisual() {
  const [ref, visible] = useSectionVisible<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="about-sound-title"
      data-visible={visible}
      className="section-block about-visual relative overflow-hidden"
    >
      <Container className="relative z-10">
        <div className="about-visual__spread">
          <div className="about-visual__frames">
            <div
              data-cursor="explore"
              className="reveal-scroll about-visual__portrait"
              style={delay(0)}
            >
              <Image
                src={aboutFrames.portrait.src}
                alt={aboutFrames.portrait.alt}
                fill
                className="about-visual__image object-cover object-[50%_28%]"
                sizes="(min-width: 1024px) 44vw, 100vw"
              />
              <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />
            </div>

            <div
              data-cursor="explore"
              className="reveal-scroll about-visual__decks"
              style={delay(160)}
            >
              <Image
                src={aboutFrames.decks.src}
                alt={aboutFrames.decks.alt}
                fill
                className="about-visual__image object-cover object-[52%_42%]"
                sizes="(min-width: 1024px) 26vw, 60vw"
              />
              <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />
            </div>
          </div>

          <div className="about-visual__words">
            <p className="reveal-scroll about-label" style={delay(80)}>
              {aboutPageLabels.identity}
            </p>

            <h2
              id="about-sound-title"
              className="reveal-scroll about-visual__strands mt-lg md:mt-xl"
              style={delay(160)}
            >
              {soundStrands.map((strand, index) => (
                <span key={strand} className="about-visual__strand">
                  {strand}
                  {index < soundStrands.length - 1 ? (
                    <span aria-hidden className="about-visual__slash">
                      /
                    </span>
                  ) : null}
                </span>
              ))}
            </h2>

            <p className="reveal-scroll about-visual__line" style={delay(260)}>
              {aboutStatement}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

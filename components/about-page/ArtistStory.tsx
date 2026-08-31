"use client";

import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { aboutPageLabels, aboutParagraphs } from "@/data/about-page";
import { careerStats } from "@/lib/about";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** `5000` → `5,000`, so the figures read at a glance. */
const grouped = new Intl.NumberFormat("en-US");

/**
 * The story, set as a column of large type with the career figures ruled
 * beneath it.
 *
 * The paragraphs are the client's bio; only the breaks between them are a
 * design decision. The figures are the same four the homepage carries — they
 * belong here as the story's evidence rather than as a statistics band.
 */
export function ArtistStory() {
  const [ref, visible] = useSectionVisible<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="about-story-title"
      data-visible={visible}
      className="section-block about-story relative"
    >
      <Container className="relative z-10">
        <div className="about-story__spread">
          <div>
            <p className="reveal-scroll about-label" style={delay(0)}>
              {aboutPageLabels.story}
            </p>

            <h2
              id="about-story-title"
              className="reveal-scroll section-title mt-lg md:mt-xl"
              style={delay(80)}
            >
              The
              <br />
              Story
            </h2>
          </div>

          <div className="about-story__text">
            {aboutParagraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={`reveal-scroll about-story__paragraph ${
                  index === aboutParagraphs.length - 1
                    ? "about-story__paragraph--close"
                    : ""
                }`}
                style={delay(160 + index * 90)}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <dl className="about-figures">
          {careerStats.map((stat, index) => (
            <div
              key={stat.label}
              className="reveal-scroll about-figure"
              style={delay(420 + index * 70)}
            >
              <dt className="about-figure__value">
                {grouped.format(stat.value)}
                {stat.suffix ? (
                  <span className="about-figure__suffix">{stat.suffix}</span>
                ) : null}
              </dt>
              <dd className="about-figure__label">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

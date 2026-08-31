"use client";

import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { allReleasesUrl, musicPageLabels } from "@/data/music-page";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * 04 — The way out.
 *
 * The archive on this site is what the client supplied; the channel is where
 * the rest of it lives. One link, to the one external destination the source
 * actually records — no Spotify, no SoundCloud, no store, because none of
 * those appear anywhere in the supplied content.
 *
 * Carries the page's bottom margin as well: the transport docks over the foot
 * of the viewport once something is playing, and this is the section it would
 * otherwise sit on top of.
 */
export function ContinueListening() {
  const [ref, visible] = useSectionVisible<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="continue-title"
      data-visible={visible}
      className="music-continue relative overflow-hidden"
    >
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <p className="reveal-scroll music-label" style={delay(0)}>
          {musicPageLabels.continue}
        </p>

        <h2 id="continue-title" className="reveal-scroll music-continue__title" style={delay(80)}>
          The rest of the
          <br />
          sound is on the channel.
        </h2>

        <a
          href={allReleasesUrl}
          target="_blank"
          rel="noreferrer noopener"
          data-cursor="explore"
          className="reveal-scroll music-continue__link group"
          style={delay(160)}
        >
          All releases on YouTube
          <span aria-hidden className="music-continue__arrow">
            ↗
          </span>
        </a>
      </Container>
    </section>
  );
}

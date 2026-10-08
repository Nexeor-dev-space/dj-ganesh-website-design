"use client";

import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { SocialIcon } from "@/components/navigation/SocialIcon";
import { allReleasesUrl, musicPageLabels, spotifyUrl as defaultSpotifyUrl } from "@/data/music-page";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * 04 — The way out.
 *
 * The archive on this site is what the client supplied; the channel and the
 * Spotify artist page are where the rest of it lives, side by side.
 *
 * Carries the page's bottom margin as well: the transport docks over the foot
 * of the viewport once something is playing, and this is the section it would
 * otherwise sit on top of.
 */
type ContinueListeningProps = {
  label?: string;
  url?: string;
  spotifyUrl?: string;
};

export function ContinueListening({
  label = musicPageLabels.continue,
  url = allReleasesUrl,
  spotifyUrl = defaultSpotifyUrl,
}: ContinueListeningProps = {}) {
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
          {label}
        </p>

        <h2 id="continue-title" className="reveal-scroll music-continue__title" style={delay(80)}>
          The rest of the
          <br />
          sound is on the channel.
        </h2>

        <div className="reveal-scroll music-continue__links" style={delay(160)}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="explore"
            className="btn-tertiary"
          >
            All releases on YouTube
            <SocialIcon name="youtube" className="btn__brand" />
          </a>

          <a
            href={spotifyUrl}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="explore"
            className="btn-tertiary"
          >
            Listen on Spotify
            <SocialIcon name="spotify" className="btn__brand" />
          </a>
        </div>
      </Container>
    </section>
  );
}

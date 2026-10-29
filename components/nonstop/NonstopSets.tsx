"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { SocialIcon } from "@/components/navigation/SocialIcon";
import {
  nonstopHeading,
  nonstopLabel,
  nonstopLede,
  nonstopPodcastUrl,
  nonstopSets,
  nonstopSpotifyUrl,
  type NonstopSet,
} from "@/data/nonstop";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Nonstop Sets — long-form mixes, after the singles in Music.
 *
 * Three set cards that open the video on YouTube, then the two places the
 * sets also live: Spotify and the Apple Podcasts archive. Placeholder links
 * (`#`) open nothing new, so they stay in the tab rather than a blank one.
 */
export function NonstopSets({
  label = nonstopLabel,
  heading = nonstopHeading,
  lede = nonstopLede,
  sets = nonstopSets,
  spotifyUrl = nonstopSpotifyUrl,
  podcastUrl = nonstopPodcastUrl,
}: {
  label?: string;
  heading?: readonly string[];
  lede?: string;
  sets?: readonly NonstopSet[];
  spotifyUrl?: string;
  podcastUrl?: string;
} = {}) {
  const [ref, visible] = useSectionVisible<HTMLElement>();

  return (
    <section
      ref={ref}
      id="nonstop"
      aria-labelledby="nonstop-title"
      data-visible={visible}
      className="section-block nonstop relative overflow-hidden"
    >
      <Container className="relative z-10">
        <p className="reveal-scroll nonstop__label" style={delay(0)}>
          {label}
        </p>

        <h2 id="nonstop-title" className="reveal-scroll section-title nonstop__title" style={delay(80)}>
          {heading.map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </h2>

        <p className="reveal-scroll nonstop__lede" style={delay(160)}>
          {lede}
        </p>

        <ul className="nonstop__grid">
          {sets.map((set, index) => {
            const placeholder = set.href === "#";
            return (
              <li key={set.title} className="reveal-scroll" style={delay(240 + index * 90)}>
                <a
                  href={set.href}
                  {...(placeholder ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="nonstop-card"
                  aria-label={`Watch ${set.title} on YouTube`}
                >
                  <span className="nonstop-card__frame">
                    <Image
                      src={set.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                      className="nonstop-card__art"
                    />
                    <span className="nonstop-card__play" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span className="nonstop-card__length">{set.length}</span>
                  </span>

                  <span className="nonstop-card__info">
                    <span className="release-card__tag">{set.tag}</span>
                    <span className="nonstop-card__name">{set.title}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="reveal-scroll nonstop__links" style={delay(520)}>
          <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" className="btn-tertiary">
            Listen on Spotify
            <SocialIcon name="spotify" className="btn__brand" />
          </a>

          <a
            href={podcastUrl}
            {...(podcastUrl === "#" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className="btn-tertiary"
          >
            Apple Podcasts archive
            <span aria-hidden className="btn__arrow">
              ↗
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { SocialIcon } from "@/components/navigation/SocialIcon";
import { MusicCard } from "@/components/music/MusicCard";
import { MusicProvider } from "@/components/music/MusicProvider";
import {
  allReleasesUrl as defaultAllReleasesUrl,
  musicHeading as defaultHeading,
  musicSectionLabel as defaultLabel,
  tracks as defaultTracks,
} from "@/data/tracks";
import type { Track } from "@/types/music";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Stagger between cards, in ms. */
const STEP = 90;

/**
 * Section 03 — Latest Drops.
 *
 * The catalogue as a grid of release cards, rebuilt from the client's own
 * releases section: centred header, four cards, one link out to the channel.
 *
 * This replaced a rack of rotating CD cases. The rack was one release at a
 * time behind a carousel, which put three of the four out of sight and made
 * the artwork the subject instead of the music; the cards show the whole
 * catalogue at once and give each release its title, genre and video.
 *
 * `MusicProvider` wraps the section, so all four cards are views of one audio
 * element — which is what makes "only one track at a time" a property of the
 * section rather than something each card has to remember.
 */
export function MusicSection({
  musicSectionLabel = defaultLabel,
  musicHeading = defaultHeading,
  allReleasesUrl = defaultAllReleasesUrl,
  tracks = defaultTracks,
}: {
  musicSectionLabel?: string;
  musicHeading?: string;
  allReleasesUrl?: string;
  tracks?: Track[];
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <MusicProvider tracks={tracks}>
      <section
        ref={sectionRef}
        id="music"
        aria-labelledby="music-title"
        data-visible={visible}
        className="section-block relative overflow-hidden"
      >
        <Container className="relative z-10">
          <div className="releases__header">
            <p className="reveal-scroll releases__label" style={delay(0)}>
              {musicSectionLabel}
            </p>

            <h2
              id="music-title"
              className="reveal-scroll section-title releases__title"
              style={delay(80)}
            >
              {musicHeading}
            </h2>
          </div>

          <ul className="releases__grid">
            {tracks.map((track, index) => (
              <MusicCard
                key={track.id}
                track={track}
                index={index}
                delay={200 + index * STEP}
              />
            ))}
          </ul>

          <div
            className="reveal-scroll releases__cta"
            style={delay(200 + tracks.length * STEP)}
          >
            <a
              href={allReleasesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <span aria-hidden className="btn__mark">
                <SocialIcon name="youtube" />
              </span>
              <span>All Releases on YouTube</span>
            </a>

            {/* The section is the four latest; the archive is all of them. */}
            <Link href="/music" className="btn-tertiary">
              View the full archive
              <span aria-hidden className="btn__arrow">
                →
              </span>
            </Link>
          </div>
        </Container>
      </section>
    </MusicProvider>
  );
}

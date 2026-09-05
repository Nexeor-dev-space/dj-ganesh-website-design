"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { MusicCard } from "@/components/music/MusicCard";
import { MusicProvider } from "@/components/music/MusicProvider";
import {
  allReleasesUrl,
  musicHeading,
  musicSectionLabel,
  tracks,
} from "@/data/tracks";

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
export function MusicSection() {
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
    <MusicProvider>
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
              className="releases__button btn-sweep"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.2c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.2c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.5 15.6V8.4l6.3 3.6-6.3 3.6Z" />
              </svg>
              All Releases on YouTube
              <span aria-hidden className="releases__button-arrow">
                →
              </span>
            </a>

            {/* The section is the four latest; the archive is all of them. */}
            <Link href="/music" className="releases__archive">
              View the full archive <span aria-hidden>→</span>
            </Link>
          </div>
        </Container>
      </section>
    </MusicProvider>
  );
}

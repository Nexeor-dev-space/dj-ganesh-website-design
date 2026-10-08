"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { MusicProvider } from "@/components/music/MusicProvider";
import { VinylCarousel } from "@/components/music/VinylCarousel";
import {
  spotifyUrl as defaultSpotifyUrl,
  musicHeading as defaultHeading,
  musicSectionLabel as defaultLabel,
  tracks as defaultTracks,
} from "@/data/tracks";
import type { Track } from "@/types/music";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Section 03 — Latest Drops.
 *
 * The releases as records in their sleeves: one at the centre with its
 * neighbours in at the edges, arrows either side, and the record sliding out
 * of its sleeve to play — see `VinylCarousel`.
 *
 * `MusicProvider` wraps the section, so every sleeve is a view of one audio
 * element — which is what makes "only one track at a time" a property of the
 * section rather than something each sleeve has to remember.
 */
export function MusicSection({
  musicSectionLabel = defaultLabel,
  musicHeading = defaultHeading,
  spotifyUrl = defaultSpotifyUrl,
  tracks = defaultTracks,
}: {
  musicSectionLabel?: string;
  musicHeading?: string;
  spotifyUrl?: string;
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

          <VinylCarousel style={delay(200)} spotifyUrl={spotifyUrl} />

          <div className="reveal-scroll releases__cta" style={delay(320)}>
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

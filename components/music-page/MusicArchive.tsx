"use client";

import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { VinylCarousel } from "@/components/music/VinylCarousel";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { spotifyUrl as defaultSpotifyUrl } from "@/data/music-page";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * 02 — The records.
 *
 * The homepage's vinyl player, unchanged: every release in its sleeve, pulled
 * out to play. It reads the page's `MusicProvider`, so the running order is
 * the full archive and only one record ever sounds at a time.
 */
export function MusicArchive({
  spotifyUrl = defaultSpotifyUrl,
}: { spotifyUrl?: string } = {}) {
  const [ref, visible] = useSectionVisible<HTMLElement>();

  return (
    <section
      ref={ref}
      id="all-music"
      aria-label="All releases"
      data-visible={visible}
      className="section-block music-archive relative overflow-hidden"
    >
      <Container className="relative z-10">
        <VinylCarousel style={delay(0)} spotifyUrl={spotifyUrl} playlist />
      </Container>
    </section>
  );
}

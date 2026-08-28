"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { MusicPlayer } from "@/components/music/MusicPlayer";
import { MusicProvider } from "@/components/music/MusicProvider";
import { TrackList } from "@/components/music/TrackList";
import { allReleasesUrl, musicSectionLabel } from "@/lib/music";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Section 03 — The Music.
 *
 * Movement gives way to sound: a thin pulse line carries over from Global
 * Reach, then the deck itself — artwork and transport on the left, the four
 * releases listed on the right.
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
          <p
            className="reveal-scroll text-[10px] font-light uppercase tracking-[0.34em] text-accent md:text-[11px]"
            style={delay(0)}
          >
            {musicSectionLabel}
          </p>

          <div className="mt-lg flex flex-col gap-lg md:mt-xl md:flex-row md:items-end md:justify-between md:gap-2xl">
            <h2
              id="music-title"
              className="reveal-scroll section-title"
              style={delay(80)}
            >
              The
              <br />
              Music
            </h2>

            <a
              href={allReleasesUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="reveal-scroll flex h-11 items-center self-start text-[10px] font-light uppercase tracking-[0.24em] text-white/50 transition-colors duration-200 hover:text-accent md:self-auto md:text-[11px]"
              style={delay(160)}
            >
              All releases on YouTube <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="mt-2xl grid gap-2xl md:mt-3xl lg:grid-cols-[55fr_45fr] lg:gap-3xl">
            <div className="reveal-scroll min-w-0" style={delay(240)}>
              <MusicPlayer />
            </div>

            <div className="reveal-scroll min-w-0" style={delay(320)}>
              <TrackList />
            </div>
          </div>
        </Container>
      </section>
    </MusicProvider>
  );
}

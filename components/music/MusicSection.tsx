"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { MusicProvider } from "@/components/music/MusicProvider";
import { NowPlayingBar } from "@/components/music/NowPlayingBar";
import { TrackCarousel } from "@/components/music/TrackCarousel";
import { allReleasesUrl, musicHeading, musicSectionLabel, tracks } from "@/data/tracks";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Section 03 — Tracks.
 *
 * The catalogue as a rack of CD cases rather than a list: the current release
 * stands centred and full size, the rest step back and dim either side of it.
 * Picking a case brings it to the centre and plays it; the transport sits as a
 * single strip beneath, so the rack stays the subject.
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
            <h2 id="music-title" className="reveal-scroll section-title" style={delay(80)}>
              {musicHeading[0]}
              <br />
              {musicHeading[1]}
            </h2>

            <div
              className="reveal-scroll flex flex-col gap-xs md:items-end"
              style={delay(160)}
            >
              <p className="text-[10px] font-light uppercase tracking-[0.24em] text-white/35">
                {tracks.length} tracks · Mixes &amp; mashups
              </p>
              {/* The section is discovery; the archive is the whole of it. */}
              <Link
                href="/music"
                className="text-[10px] font-light uppercase tracking-[0.24em] text-white/50 transition-colors duration-200 hover:text-accent md:text-[11px]"
              >
                View the full archive <span aria-hidden>→</span>
              </Link>

              <a
                href={allReleasesUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[10px] font-light uppercase tracking-[0.24em] text-white/50 transition-colors duration-200 hover:text-accent md:text-[11px]"
              >
                All releases on YouTube <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          <div className="reveal-scroll mt-2xl md:mt-3xl" style={delay(240)}>
            <TrackCarousel />
          </div>

          <div className="reveal-scroll mt-xl md:mt-2xl" style={delay(640)}>
            <NowPlayingBar />
          </div>
        </Container>
      </section>
    </MusicProvider>
  );
}

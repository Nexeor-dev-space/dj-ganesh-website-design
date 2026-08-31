"use client";

import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import {
  musicPageCount,
  musicPageLabels,
  musicPageStatement,
  musicPageStrands,
  musicPageTitle,
} from "@/data/music-page";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * 01 — The way in.
 *
 * One word at page scale, the bio's own line about the sound under it, and the
 * two facts the archive can actually state about itself: how many tracks it
 * holds and what they are made of. Deliberately short — the listening starts
 * one screen down, and a full viewport of type would only delay it.
 */
export function MusicHero() {
  const [ref, visible] = useSectionVisible<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="music-page-title"
      data-visible={visible}
      className="music-hero relative overflow-hidden"
    >
      <div className="music-hero__glow" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <p className="reveal-scroll music-label" style={delay(0)}>
          {musicPageLabels.intro}
        </p>

        <h1 id="music-page-title" className="reveal-scroll music-hero__title" style={delay(90)}>
          {musicPageTitle}
        </h1>

        <p className="reveal-scroll music-hero__statement" style={delay(180)}>
          {musicPageStatement}
        </p>

        <div className="reveal-scroll music-hero__meta" style={delay(260)}>
          <p className="music-hero__strands">
            {musicPageStrands.map((strand, index) => (
              <span key={strand}>
                {index > 0 ? (
                  <span aria-hidden className="mx-sm text-white/25">
                    /
                  </span>
                ) : null}
                {strand}
              </span>
            ))}
          </p>

          <p className="music-hero__count">
            {musicPageCount} tracks · Play in full
          </p>
        </div>
      </Container>
    </section>
  );
}

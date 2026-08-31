"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { usePrefersReducedMotion } from "@/components/interactions/environment";
import { call, callVideo } from "@/data/call";
import { bookingEmail } from "@/lib/tour";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * The closing call.
 *
 * A full-bleed band of footage with the question over it — the one place on
 * the page that plays a moving picture, held right before the footer so the
 * last thing a visitor passes is an invitation.
 *
 * The file is 8MB, so it is not something to hand every visitor on sight: the
 * `<source>` is only attached once the band is within a screen of the
 * viewport, and playback stops the moment it leaves. Reduced motion never
 * loads it at all — the band keeps its dark ground and reads exactly the same.
 */
export function CallSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  /** Flips once the band is near enough to be worth the download. */
  const [loadVideo, setLoadVideo] = useState(false);

  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);

          const video = videoRef.current;
          if (reducedMotion || !video) return;

          if (entry.isIntersecting) {
            setLoadVideo(true);
            // A background video that cannot play is not an error worth
            // surfacing — the band reads the same without it.
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      // A screen of margin, so the first frame is ready before it is needed.
      { threshold: 0.01, rootMargin: "100% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="ready-to-book"
      aria-labelledby="call-title"
      data-visible={visible}
      className="call-section relative overflow-hidden"
    >
      <div className="call-media" aria-hidden>
        {reducedMotion ? null : (
          <video
            ref={videoRef}
            className="call-video"
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
          >
            {loadVideo ? <source src={callVideo} type="video/mp4" /> : null}
          </video>
        )}

        <div className="call-scrim" />
        <div className="overlay-grain absolute inset-0" />
      </div>

      <Container className="call-inner relative z-10">
        <h2 id="call-title" className="reveal-scroll call-title" style={delay(0)}>
          {call.heading[0]}{" "}
          <span className="call-title__accent">{call.heading[1]}</span>
        </h2>

        <p className="reveal-scroll call-lede" style={delay(120)}>
          {call.lede}
        </p>

        <a
          href={`mailto:${bookingEmail}`}
          data-cursor="book"
          className="reveal-scroll call-cta btn-sweep btn-sweep--onAccent"
          style={delay(220)}
        >
          {call.ctaLabel}
          <span aria-hidden className="call-cta__arrow">
            &rarr;
          </span>
        </a>

        <ul className="reveal-scroll call-agencies" style={delay(320)}>
          {call.agencies.map((agency) => (
            <li key={agency}>{agency}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

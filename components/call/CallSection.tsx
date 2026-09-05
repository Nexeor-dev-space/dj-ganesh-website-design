"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { call } from "@/data/call";
import { bookingEmail } from "@/lib/tour";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * The closing call.
 *
 * The question, centred on the page's own black, held right before the footer
 * so the last thing a visitor passes is an invitation.
 *
 * It used to play a band of footage behind the type. That is gone, and with it
 * an 8MB download, the observer that deferred it, and the scrim that existed
 * only to hold the type off a moving crowd — the band reads the same without
 * any of it.
 */
export function CallSection() {
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
    <section
      ref={sectionRef}
      id="ready-to-book"
      aria-labelledby="call-title"
      data-visible={visible}
      className="call-section relative overflow-hidden"
    >
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

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

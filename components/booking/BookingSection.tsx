"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import {
  bookingCta as defaultCta,
  bookingHeading as defaultHeading,
  bookingLede as defaultLede,
  bookingLinks as defaultLinks,
  bookingScope as defaultScope,
  bookingSectionLabel as defaultLabel,
  bookingStatement as defaultStatement,
} from "@/data/booking";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Section 08 — Booking.
 *
 * The last room in the building, and the only one with a door out: the
 * question and the closing line on the left, the pass on the right, one
 * action on it. The "Ready to book?" band that used to sit above this
 * section is folded in here, so the page asks once and answers in the same
 * breath.
 *
 * There is no form. The client's `index.html` has no booking form anywhere —
 * every booking control on that site is `mailto:info@djganeshbombay.com`, and
 * this project has no API route, no action and no form service to post to.
 * Inventing fields would mean either dropping what a visitor typed on the
 * floor or implying an enquiry had been sent when nothing left the browser.
 * So the mailto is the action, with the address and the rest of the booking
 * channels written out beside it for anyone who would rather use their own.
 */
export function BookingSection({
  bookingSectionLabel = defaultLabel,
  bookingHeading = defaultHeading,
  bookingStatement = defaultStatement,
  bookingLede = defaultLede,
  bookingScope = defaultScope,
  bookingLinks = defaultLinks,
  bookingCta = defaultCta,
}: {
  bookingSectionLabel?: string;
  bookingHeading?: readonly string[];
  bookingStatement?: string;
  bookingLede?: string;
  bookingScope?: readonly string[];
  bookingLinks?: readonly {
    label: string;
    value: string;
    href: string;
    external?: boolean;
  }[];
  bookingCta?: { label: string; href: string };
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
    <section
      ref={sectionRef}
      id="booking"
      aria-labelledby="booking-title"
      data-visible={visible}
      className="section-block booking-section relative overflow-hidden"
    >
      <div className="booking-glow" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <p
          className="reveal-scroll text-[12px] font-light uppercase tracking-[0.34em] text-accent"
          style={delay(0)}
        >
          {bookingSectionLabel}
        </p>

        <div className="booking-spread mt-eyebrow">
          <div className="min-w-0">
            {/* One line at a time, so the question lands in beats; the second
                line carries the accent. */}
            <h2 id="booking-title" className="section-title booking-title">
              {bookingHeading.map((line, index) => (
                <span
                  key={line}
                  className={`reveal-scroll booking-title__line${
                    index === bookingHeading.length - 1
                      ? " booking-title__accent"
                      : ""
                  }`}
                  style={delay(80 + index * 80)}
                >
                  <span className="title-ink">{line}</span>
                </span>
              ))}
            </h2>

            <p className="reveal-scroll booking-statement" style={delay(260)}>
              {bookingStatement}
            </p>

            <p className="reveal-scroll booking-lede" style={delay(340)}>
              {bookingLede}
            </p>

            <ul className="reveal-scroll booking-scope" style={delay(400)}>
              {bookingScope.map((occasion) => (
                <li key={occasion}>{occasion}</li>
              ))}
            </ul>
          </div>

          {/* The pass: the action, and every channel the source records. */}
          <div className="reveal-scroll booking-pass" style={delay(460)}>
            <a href={bookingCta.href} data-cursor="book" className="btn-primary">
              <span>{bookingCta.label}</span>
              <span aria-hidden className="btn__arrow">
                &rarr;
              </span>
            </a>

            <dl className="booking-links">
              {bookingLinks.map((link) => (
                <div key={link.label} className="booking-links__row">
                  <dt>{link.label}</dt>
                  <dd>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                      className="booking-links__link"
                    >
                      {link.value}
                      {link.external ? <span aria-hidden> ↗</span> : null}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}

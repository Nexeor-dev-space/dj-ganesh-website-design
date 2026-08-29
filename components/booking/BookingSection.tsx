"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import {
  bookingCta,
  bookingHeading,
  bookingLede,
  bookingLinks,
  bookingScope,
  bookingSectionLabel,
} from "@/data/booking";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * Section 08 — Booking.
 *
 * The last room in the building, and the only one with a door out: the
 * statement on the left, the pass on the right, one action on it.
 *
 * There is no form. The client's `index.html` has no booking form anywhere —
 * every booking control on that site is `mailto:info@djganeshbombay.com`, and
 * this project has no API route, no action and no form service to post to.
 * Inventing fields would mean either dropping what a visitor typed on the
 * floor or implying an enquiry had been sent when nothing left the browser.
 * So the mailto is the action, with the address and the rest of the booking
 * channels written out beside it for anyone who would rather use their own.
 */
export function BookingSection() {
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
          className="reveal-scroll text-[10px] font-light uppercase tracking-[0.34em] text-accent md:text-[11px]"
          style={delay(0)}
        >
          {bookingSectionLabel}
        </p>

        <div className="booking-spread mt-lg md:mt-xl">
          <div className="min-w-0">
            {/* One line at a time, so the closing statement lands in beats. */}
            <h2 id="booking-title" className="section-title booking-title">
              {bookingHeading.map((line, index) => (
                <span
                  key={line}
                  className="reveal-scroll booking-title__line"
                  style={delay(80 + index * 80)}
                >
                  {line}
                </span>
              ))}
            </h2>

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
            <a
              href={bookingCta.href}
              data-cursor="book"
              className="booking-cta group"
            >
              <span className="booking-cta__label">{bookingCta.label}</span>
              <span className="booking-cta__rule" aria-hidden>
                <span className="booking-cta__arrow">&rarr;</span>
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

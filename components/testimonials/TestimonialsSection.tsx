"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { testimonials } from "@/lib/testimonials";
import { wallRow } from "@/lib/wall";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** How long each quote holds before the next one takes over. */
const QUOTE_INTERVAL = 6000;

/** Three rows, drifting at different speeds so the wall never reads as a grid. */
const ROWS = [0, 1, 2];

/**
 * Section 07 — the Wall of Love.
 *
 * Built to the composition of the client's own site: three rows of circular
 * frames drifting behind a dark centre, with one quote at a time held over
 * them. The rows are tilted back a little and dimmed, so they read as a room
 * rather than as a gallery, and the vignette is what makes the quote legible
 * without stopping the movement behind it.
 *
 * The rows carry his own event photography. The original wall was built from
 * `i.pravatar.cc` — placeholder portraits of people with no connection to the
 * artist, presented as his audience — and that is the one thing here not
 * carried over. See `lib/wall.ts`.
 *
 * The quotes rotate on a timer rather than on a control: three lines is not a
 * carousel, and the wall behind them is already moving. It pauses under the
 * pointer so a quote can be finished, and the whole rotation stops for anyone
 * who has asked for less motion — the first quote simply stays.
 */
export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

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

  useEffect(() => {
    if (!visible || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(
      () => setActive((current) => (current + 1) % testimonials.length),
      QUOTE_INTERVAL,
    );
    return () => window.clearInterval(id);
  }, [visible, paused]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-labelledby="testimonials-title"
      data-visible={visible}
      className="wall relative overflow-hidden"
    >
      <Container className="relative z-10">
        <h2 id="testimonials-title" className="wall__title reveal-scroll" style={delay(0)}>
          Wall of Love
        </h2>
        <p className="wall__sub reveal-scroll" style={delay(80)}>
          5000+ events · half a million dancers · one dance floor at a time
        </p>
      </Container>

      <div
        className="wall__stage reveal-scroll"
        style={delay(160)}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <div className="wall__rows" aria-hidden>
          {ROWS.map((row) => (
            <div key={row} className="wall__row" data-row={row}>
              {/* Twice, so the drift loops without a seam. */}
              {[0, 1].map((copy) => (
                <div key={copy} className="wall__half">
                  {wallRow(row).map((tile) => (
                    <span key={`${copy}-${tile.key}`} className="wall__tile">
                      <Image
                        src={tile.src}
                        alt=""
                        fill
                        sizes="96px"
                        className="wall__tile-img"
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Darkens the middle so the quote reads, and lets the wall show at the
            edges where nothing is set over it. */}
        <div className="wall__vignette" aria-hidden />

        <div className="wall__quotes" aria-live="polite">
          {testimonials.map((testimonial, index) => (
            <blockquote
              key={testimonial.id}
              className="wall__quote"
              data-active={index === active}
              /* Only the one on show is in the accessibility tree; the other
                 two are stacked underneath it, not stated. */
              aria-hidden={index === active ? undefined : true}
            >
              <p>&ldquo;{testimonial.quote}&rdquo;</p>
              <cite>
                {testimonial.author} · {testimonial.location}
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

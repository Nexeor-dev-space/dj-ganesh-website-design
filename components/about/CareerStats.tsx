"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/components/interactions/environment";
import { careerStats } from "@/lib/about";

/** How long every figure takes to reach its number, in ms. */
const DURATION = 1600;

/**
 * The career in four figures, counted up as the band scrolls into view.
 *
 * The numbers are written into the markup at their final value, so the band is
 * correct before JavaScript runs and correct for anyone who never gets it. The
 * counter zeroes them on mount and animates from there, which is also why the
 * reset is not left until the band is on screen — doing it then would show the
 * real number for a frame and snap it back to zero in front of the reader.
 *
 * All four run off one animation frame and write straight to the DOM, so
 * counting never re-renders React. Reduced motion keeps the figures still.
 */
export function CareerStats() {
  const listRef = useRef<HTMLDListElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list || reducedMotion) return;

    const figures = Array.from(
      list.querySelectorAll<HTMLElement>("[data-count]"),
    );
    if (!figures.length) return;

    const targets = figures.map((figure) => Number(figure.dataset.count) || 0);
    figures.forEach((figure) => {
      figure.textContent = "0";
    });

    let frame = 0;
    let started = false;

    const run = () => {
      started = true;
      const startedAt = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / DURATION);
        // Ease out cubic: quick off the mark, settling onto the figure.
        const eased = 1 - (1 - progress) ** 3;

        figures.forEach((figure, index) => {
          figure.textContent = String(Math.round(targets[index] * eased));
        });

        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            run();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(list);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <dl ref={listRef} className="story-facts">
      {careerStats.map((stat) => (
        <div key={stat.label} className="story-fact">
          {/* Label first in the markup so a screen reader hears "Gigs played,
              5000+"; the band is flipped in CSS to put the figure on top. */}
          <dt className="story-fact__label">{stat.label}</dt>
          <dd className="story-fact__value">
            <span data-count={stat.value}>{stat.value}</span>
            {stat.suffix ? (
              <span className="story-fact__suffix">{stat.suffix}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

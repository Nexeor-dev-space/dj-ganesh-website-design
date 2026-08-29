"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { statement, statementLabel } from "@/data/statement";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Stagger between statement lines, in ms. */
const STEP = 110;

/**
 * The statement plate.
 *
 * A spread rather than a plate: the line about the sound set large on the
 * left, and him on the right, so the claim has a face beside it instead of a
 * screen of empty black.
 *
 * No quotation mark is drawn. The previous version set one at display size
 * over words that `data/statement.ts` is explicit are *not* his — the line is
 * from the client's third-person bio — and a mark that size reads as
 * attribution whatever the markup says. Marks appear only when `spoken` is
 * true, and then they are typed into the sentence where they belong.
 *
 * His name is nowhere near the words for the same reason — a signature under
 * a sentence he did not say is a quote in everything but name. It survives
 * only as the photograph's alt text, where it describes who is pictured.
 */
export function StatementSection() {
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
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const last = statement.lines.length - 1;

  const words = statement.lines.map((line, index) => (
    <span
      key={line}
      className="reveal-scroll statement-line"
      style={delay(120 + index * STEP)}
    >
      {statement.spoken && index === 0 ? <span aria-hidden>&ldquo;</span> : null}
      {line}
      {statement.spoken && index === last ? <span aria-hidden>&rdquo;</span> : null}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      id="statement"
      aria-labelledby="statement-label"
      data-visible={visible}
      data-spoken={statement.spoken}
      className="section-block statement-section relative overflow-hidden"
    >
      <div className="statement-glow" aria-hidden />
      <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

      <Container className="relative z-10">
        <div className="statement-spread">
          <div className="statement-plate">
            <p
              id="statement-label"
              className="reveal-scroll statement-label"
              style={delay(0)}
            >
              {statementLabel}
            </p>

            {/* A quote element only once the words are actually his. */}
            {statement.spoken ? (
              <blockquote className="statement-words">{words}</blockquote>
            ) : (
              <p className="statement-words">{words}</p>
            )}

            <p
              className="reveal-scroll statement-note"
              style={delay(160 + last * STEP + STEP)}
            >
              {statement.note}
            </p>
          </div>

          <div
            className="reveal-scroll statement-portrait"
            style={delay(220)}
          >
            <Image
              src="/images/dj-ganesh.jpg"
              alt={statement.name}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="statement-portrait__image object-cover object-[52%_22%]"
            />
            <span
              className="overlay-grain pointer-events-none absolute inset-0"
              aria-hidden
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

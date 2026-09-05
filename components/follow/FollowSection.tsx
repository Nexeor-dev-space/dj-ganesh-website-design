"use client";

import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { SocialIcon } from "@/components/navigation/SocialIcon";
import { useSectionVisible } from "@/components/about-page/useSectionVisible";
import { followHeading, followLinks } from "@/data/follow";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Stagger between the three marks, in ms. */
const STEP = 90;

/**
 * Follow — the three ways to keep up with him.
 *
 * The client's own band, rebuilt in this site's type: one word centred, then
 * the accounts as three large marks with their names under them. It sits
 * immediately before the Wall of Love, so the page asks to be followed while
 * the room is still talking about him, rather than at the very end where the
 * footer already carries the same three links in small print.
 *
 * Each mark is a link in its own right — the caption is the link's text, so
 * the accessible name is the thing being followed rather than a glyph.
 */
export function FollowSection() {
  const [ref, visible] = useSectionVisible<HTMLElement>();

  return (
    <section
      ref={ref}
      id="follow"
      aria-labelledby="follow-title"
      data-visible={visible}
      className="section-block follow-section"
    >
      <Container>
        <h2
          id="follow-title"
          className="reveal-scroll section-title follow__title"
          style={delay(0)}
        >
          {followHeading}
        </h2>

        <ul className="follow__row">
          {followLinks.map((link, index) => (
            <li
              key={link.href}
              className="reveal-scroll"
              style={delay(140 + index * STEP)}
            >
              <a
                href={link.href}
                data-cursor="explore"
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="follow__link"
              >
                <span className="follow__mark">
                  <SocialIcon name={link.icon} className="follow__glyph" />
                </span>

                <span className="follow__caption">{link.caption}</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

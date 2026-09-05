"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { FitText } from "@/components/hero/FitText";
import { FooterNavigation } from "@/components/footer/FooterNavigation";
import { SocialLinks } from "@/components/footer/SocialLinks";
import { footerCopyright, footerStatement } from "@/data/footer";
import { siteConfig } from "@/lib/site";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * The close.
 *
 * The name at page scale on the site's own black, then the four columns, the
 * accounts and the credit line. It used to carry a full-bleed performance
 * still, pinned to the viewport so the footer rode up over it; both the
 * picture and the pin are gone, and the type stands on the ground alone.
 *
 * No newsletter, no second booking pitch: the Booking section has already
 * made that ask, and the site simply ends here.
 */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

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

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  function backToTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <footer
      ref={footerRef}
      id="footer"
      data-visible={visible}
      className="footer relative overflow-hidden"
    >
      <Container className="relative z-10">
        <h2
          className="footer-name reveal-scroll text-accent"
          style={delay(140)}
          aria-label={siteConfig.name}
        >
          {/* Fitted to the container exactly as the banner lockup is, so the
              two read as the same mark rather than two sizes of one. */}
          <span aria-hidden className="block">
            <FitText className="grain-text">DJ Ganesh</FitText>
          </span>
        </h2>

        {/* Four columns, then the rail, then the credit line — the client's
            own footer, in that order. */}
        <div className="reveal-scroll footer-index" style={delay(220)}>
          <FooterNavigation />
        </div>

        <div className="reveal-scroll footer-rail" style={delay(300)}>
          <p className="footer-rail__statement">{footerStatement}</p>
          <SocialLinks />
        </div>

        <div className="reveal-scroll footer-bar" style={delay(380)}>
          <p className="footer-bar__credit">{footerCopyright}</p>

          <button type="button" onClick={backToTop} className="footer-link group">
            Back to top
            <span aria-hidden className="footer-link__arrow">
              ↑
            </span>
          </button>
        </div>

      </Container>
    </footer>
  );
}

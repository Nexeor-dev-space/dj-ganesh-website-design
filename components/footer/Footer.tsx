"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ColourPlume } from "@/components/effects/ColourPlume";
import { Container } from "@/components/layout/Container";
import { FitText } from "@/components/hero/FitText";
import { FooterNavigation } from "@/components/footer/FooterNavigation";
import { SocialLinks } from "@/components/footer/SocialLinks";
import {
  footerContactEmail,
  footerCopyright,
  footerImage,
  footerStatement,
} from "@/data/footer";
import { siteConfig } from "@/lib/site";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * The last frame.
 *
 * A full-bleed performance still fading into the page's own black, with the
 * name set oversized across the seam so photograph and type share an edge.
 * Everything else — two accounts, the section index, the credit line — sits
 * quietly beneath it. No newsletter, no second booking pitch: the Booking
 * section has already made that ask, and the site simply ends here.
 */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
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

  // The still holds at the viewport while the footer rides up over it: it is
  // a screen tall and moves by exactly the frame's own offset each scroll, so
  // it stays parked while the window travels across it.
  //
  // Done here rather than with `position: fixed`, which ancestor `overflow`
  // does not clip — a fixed still would spill over the whole page instead of
  // staying inside the frame. Pointer-precise devices only, and never against
  // a reduced-motion preference; without it the still simply scrolls along.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");

    let raf: number | null = null;
    let running = false;

    const apply = () => {
      raf = null;
      // Cancelling the frame's own offset leaves the still at viewport zero.
      const { top } = frame.getBoundingClientRect();
      frame.style.setProperty("--pin", `${-top}px`);
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(apply);
    };

    const sync = () => {
      const wanted = fine.matches && !reduced.matches;
      if (wanted === running) return;

      running = wanted;
      if (wanted) {
        window.addEventListener("scroll", onScroll, { passive: true });
        // The pin is an offset in pixels, so a resize invalidates it just as
        // a scroll does — without this it holds a figure measured against the
        // old viewport until the next scroll.
        window.addEventListener("resize", onScroll, { passive: true });
        apply();
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        frame.style.removeProperty("--pin");
      }
    };

    sync();
    reduced.addEventListener("change", sync);
    fine.addEventListener("change", sync);

    return () => {
      reduced.removeEventListener("change", sync);
      fine.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
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
      {/* The frame — full-bleed, breaking the container on purpose. */}
      <div
        ref={frameRef}
        data-cursor="explore"
        /* Scopes the plume to this frame: the footer sits outside the page's
           shared plume region, so without it there is no bounds element. */
        data-plume-region
        className="footer-frame reveal-scroll group"
        style={delay(0)}
      >
        {/* Everything the eye reads as "the picture" lives in this one layer —
            still, grade, grain and the wash that holds the name off it — and
            the whole layer is what gets parked at the viewport. That is the
            rule the earlier draft broke: it pinned the still but left the
            edge gradient with the frame, so a dark band slid across a
            photograph that was standing still, and that is what read as a
            shadow passing over the footer. Nothing may sit between the frame
            and this layer again. */}
        <div className="footer-frame__still">
          {/* The same treatment as the banner: graded to black and white, with
              the pointer's plume burning the original colour back through. */}
          <ColourPlume
            src={footerImage.src}
            alt={footerImage.alt}
            className="footer-frame__media absolute inset-0"
            /* The frame is far wider than the portrait, so on desktop only a
               narrow band of it shows: held high enough to keep his head and
               the lit room behind him, rather than cropping to the shirt. */
            imageClassName="hero-photo object-cover object-[50%_30%] sm:object-[50%_20%] lg:object-[50%_14%]"
            sizes="100vw"
          />

          <div className="overlay-grain pointer-events-none absolute inset-0" aria-hidden />

          {/* Even, and part of the picture rather than laid over the frame:
              the name is set in the accent at banner scale across the foot of
              this photograph, and needs the ground under it held down. */}
          <div className="footer-frame__wash" aria-hidden />
        </div>
      </div>

      {/* The name, straddling the frame's bottom edge. */}
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

        <div className="mt-2xl flex flex-col gap-2xl md:mt-3xl md:flex-row md:items-start md:justify-between md:gap-3xl">
          <div className="reveal-scroll" style={delay(220)}>
            <FooterNavigation />
          </div>

          <div className="reveal-scroll md:text-right" style={delay(300)}>
            <p className="text-[10px] font-light uppercase tracking-[0.34em] text-accent">
              {footerStatement}
            </p>
            <SocialLinks className="mt-md flex flex-col gap-sm md:items-end" />
          </div>
        </div>

        <div
          className="reveal-scroll mt-3xl flex flex-col gap-md border-t border-border pt-lg sm:flex-row sm:items-center sm:justify-between"
          style={delay(380)}
        >
          <p className="text-[10px] font-light uppercase tracking-[0.18em] text-white/35">
            {footerCopyright}
          </p>

          <div className="flex flex-col items-start gap-md sm:flex-row sm:items-center sm:gap-xl">
            <a
              href={`mailto:${footerContactEmail}`}
              className="footer-link text-white/40"
            >
              {footerContactEmail}
            </a>

            <button type="button" onClick={backToTop} className="footer-link group">
              Back to top
              <span aria-hidden className="footer-link__arrow">
                ↑
              </span>
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}

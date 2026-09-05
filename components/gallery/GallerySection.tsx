"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { galleryItems, gallerySectionLabel } from "@/data/gallery";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/** Stagger across the grid, in ms. */
const STEP = 70;

/**
 * Section — Gallery.
 *
 * Six covers on one ruled grid, held back to grey until pointed at. Built to
 * the client's own composition: a 16:9 tile, a hairline between them rather
 * than a gutter, and the frame coming up to full colour and stepping forward
 * under the pointer.
 *
 * Every tile is a link to the set it is the cover for, which is what the
 * artwork is announcing — the titles are printed on the images themselves, so
 * nothing is captioned underneath.
 */
export function GallerySection() {
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
      id="gallery"
      aria-labelledby="gallery-title"
      data-visible={visible}
      className="gallery section-block relative overflow-hidden"
    >
      <Container className="relative z-10">
        <h2 id="gallery-title" className="gallery__title reveal-scroll" style={delay(0)}>
          {gallerySectionLabel}
        </h2>

        <ul className="gallery__grid">
          {galleryItems.map((item, index) => (
            <li
              key={item.src}
              className="gallery__item reveal-scroll"
              style={delay(120 + index * STEP)}
            >
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className="gallery__link"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="gallery__img"
                />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

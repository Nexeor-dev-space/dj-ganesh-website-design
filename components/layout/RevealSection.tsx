"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealSectionProps = {
  id?: string;
  className?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  children: ReactNode;
};

/**
 * A section that flips `data-visible` the first time it is scrolled into view.
 *
 * Every section on the home page carries its own copy of this observer because
 * each also owns other state. These do not, so they share one component rather
 * than repeating the effect five more times — the reveal itself is still the
 * site's, driven by `.reveal-scroll` and `--reveal-delay` in `globals.css`.
 */
export function RevealSection({
  id,
  className,
  children,
  ...aria
}: RevealSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = ref.current;
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
    <section ref={ref} id={id} data-visible={visible} className={className} {...aria}>
      {children}
    </section>
  );
}

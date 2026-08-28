"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

type FitTextProps = {
  children: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Scales its text so the rendered width always matches the width of its
 * parent — used for the hero lockup, which is art-directed to run edge to
 * edge rather than sit at a fixed type scale.
 */
export function FitText({ children, className, style }: FitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const fit = () => {
      const containerWidth = container.offsetWidth;
      const naturalWidth = text.scrollWidth;
      if (!containerWidth || !naturalWidth) return;
      // Scale from the text's *currently rendered* font-size rather than
      // resetting it to a baseline first — mutating font-size directly would
      // change this element's height, which would retrigger the observer
      // below on the same container and fight the just-applied value.
      const currentFontSize = parseFloat(getComputedStyle(text).fontSize) || 16;
      const next = (containerWidth / naturalWidth) * currentFontSize;
      setFontSize((prev) => (prev !== null && Math.abs(prev - next) < 0.5 ? prev : next));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);

    // The Consul web font can finish loading after the initial fit, which
    // changes the text's natural width without changing the container's, so
    // ResizeObserver alone won't catch it — re-fit explicitly once ready.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) fit();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [children]);

  return (
    <span ref={containerRef} className={className} style={{ ...style, display: "block", width: "100%" }}>
      <span
        ref={textRef}
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          fontSize: fontSize ? `${fontSize}px` : undefined,
          letterSpacing: "-0.045em",
          visibility: fontSize ? "visible" : "hidden",
        }}
      >
        {children}
      </span>
    </span>
  );
}

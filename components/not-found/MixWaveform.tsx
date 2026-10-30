"use client";

import { useEffect, useRef } from "react";

/**
 * The 404 stage's signal: a slow waveform across the floor of the frame that
 * every so often drops almost flat and swells back, as if the mix had lost
 * its feed and found it again. Drawn on a canvas in the site accent, at a
 * capped pixel ratio, paused while the tab is hidden, and a single still
 * frame for anyone who has asked for less motion.
 */
export function MixWaveform() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#10b26c";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    // Three strands at different speeds and weights, so it never reads as one
    // repeating sine.
    const strands = [
      { freq: 1.6, speed: 0.35, amp: 0.34, alpha: 0.55, line: 1.5 },
      { freq: 2.7, speed: -0.22, amp: 0.22, alpha: 0.3, line: 1 },
      { freq: 4.1, speed: 0.5, amp: 0.12, alpha: 0.18, line: 1 },
    ];

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const mid = height / 2;
      // The signal: mostly present, briefly dropping out every ~9s.
      const cycle = (t / 9000) % 1;
      const drop = cycle > 0.82 ? Math.sin(((cycle - 0.82) / 0.18) * Math.PI) : 0;
      const signal = 1 - 0.85 * drop;

      for (const s of strands) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 4) {
          const p = x / width;
          // Fades in from the edges, fullest across the middle of the frame.
          const envelope = Math.sin(p * Math.PI) ** 1.5;
          const wave =
            Math.sin(p * Math.PI * 2 * s.freq + (t / 1000) * s.speed * Math.PI * 2) *
            Math.cos(p * Math.PI * 0.9 + t / 4000);
          const y = mid + wave * envelope * s.amp * height * signal;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = accent;
        ctx.globalAlpha = s.alpha;
        ctx.lineWidth = s.line;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reduce) draw(2000);
      else frame = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else start();
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="ootm__wave" aria-hidden />;
}

"use client";

import { useEffect, useRef } from "react";
import { BAND_COUNT, useMusicPlayer } from "@/components/music/MusicProvider";
import { usePrefersReducedMotion } from "@/components/interactions/environment";

const BAR_COUNT = 48;
const BAR_GAP = 2;
const IDLE_HEIGHT = 0.06;

/**
 * The waveform under the player.
 *
 * Reads frequency data straight from the shared analyser inside one animation
 * frame and paints to canvas — playback never re-renders React. The loop only
 * runs while something is playing; paused, the bars ease down to a flat line
 * and the loop stops.
 */
export function AudioVisualizer({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying, readLevels } = useMusicPlayer();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const heights = new Array<number>(BAR_COUNT).fill(IDLE_HEIGHT);
    const bands = new Uint8Array(BAND_COUNT);
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#ffd500";

    let width = 0;
    let height = 0;
    let ratio = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const paint = () => {
      context.clearRect(0, 0, width, height);
      const barWidth = Math.max(1, (width - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT);

      for (let i = 0; i < BAR_COUNT; i += 1) {
        const barHeight = Math.max(1, heights[i] * height);
        const x = i * (barWidth + BAR_GAP);
        const y = (height - barHeight) / 2;
        const intensity = Math.min(heights[i] * 1.6, 1);

        // Quiet bars stay monochrome; only the peaks pick up the accent.
        context.fillStyle = intensity > 0.4 ? accent : "#ffffff";
        context.globalAlpha = 0.18 + intensity * 0.62;
        context.fillRect(x, y, barWidth, barHeight);
      }
      context.globalAlpha = 1;
    };

    resize();
    const observer = new ResizeObserver(() => {
      resize();
      paint();
    });
    observer.observe(canvas);

    if (!isPlaying || reducedMotion) {
      heights.fill(IDLE_HEIGHT);
      paint();
      return () => observer.disconnect();
    }

    // Paint once up front so the canvas is never blank between a resize and
    // the first animation frame (frames are suspended in background tabs).
    paint();

    let frame = 0;
    const render = () => {
      readLevels(bands);
      const usable = Math.floor(bands.length * 0.66);

      for (let i = 0; i < BAR_COUNT; i += 1) {
        // Weighted toward the low end, but not so steeply that the bass bars
        // swamp everything else.
        const start = Math.floor((i / BAR_COUNT) ** 1.25 * usable);
        const end = Math.max(
          start + 1,
          Math.floor(((i + 1) / BAR_COUNT) ** 1.25 * usable),
        );

        let total = 0;
        for (let b = start; b < end; b += 1) total += bands[b];
        const average = total / (end - start) / 255;

        // Conservative gain: a loud mix should read as a moving waveform,
        // never a solid block.
        const value = Math.min(Math.max(average * 0.85, IDLE_HEIGHT), 0.94);
        heights[i] += (value - heights[i]) * (value > heights[i] ? 0.45 : 0.12);
      }

      paint();
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [isPlaying, readLevels, reducedMotion]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

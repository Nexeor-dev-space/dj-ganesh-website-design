"use client";

import { useEffect, useRef } from "react";
import { BAND_COUNT, useAudioEngine } from "@/components/interactions/AudioController";
import { usePrefersReducedMotion } from "@/components/interactions/environment";

const BAR_COUNT = 7;
/** Resting bar height, so the row stays legible when nothing is playing. */
const IDLE_HEIGHT = 0.12;
const BAR_WIDTH = 2;
const BAR_GAP = 3;
const HEIGHT = 18;
const WIDTH = BAR_COUNT * BAR_WIDTH + (BAR_COUNT - 1) * BAR_GAP;

type AudioVisualizerProps = {
  className?: string;
  /** Tints the bars with the signature accent while playing. */
  accent?: boolean;
};

/**
 * Seven slim bars — a signature, not an equaliser.
 *
 * Reads frequency data straight from the analyser inside one animation frame
 * and paints to canvas, so nothing here re-renders while audio plays. The loop
 * only runs while something is playing.
 */
export function AudioVisualizer({ className, accent = true }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying, readLevels } = useAudioEngine();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = WIDTH * ratio;
    canvas.height = HEIGHT * ratio;
    context.scale(ratio, ratio);

    const bands = new Uint8Array(BAND_COUNT);
    const heights = new Array<number>(BAR_COUNT).fill(IDLE_HEIGHT);
    const accentColor = accent
      ? getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
        "#b8ff66"
      : "#ffffff";

    const paint = () => {
      context.clearRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < BAR_COUNT; i += 1) {
        const barHeight = Math.max(1, heights[i] * HEIGHT);
        const x = i * (BAR_WIDTH + BAR_GAP);
        const y = (HEIGHT - barHeight) / 2;

        // Louder bars pick up the accent; quiet ones stay monochrome.
        const intensity = Math.min(heights[i] * 1.4, 1);
        context.fillStyle = accent && intensity > 0.35 ? accentColor : "#ffffff";
        context.globalAlpha = 0.35 + intensity * 0.5;
        context.fillRect(x, y, BAR_WIDTH, barHeight);
      }

      context.globalAlpha = 1;
    };

    // Idle: a flat, still row. Nothing animates until playback starts.
    if (!isPlaying || reducedMotion) {
      heights.fill(IDLE_HEIGHT);
      paint();
      return;
    }

    let frame = 0;
    const step = (
      i: number,
      value: number, // eased toward the band's level
    ) => {
      heights[i] += (value - heights[i]) * (value > heights[i] ? 0.45 : 0.12);
    };

    const render = () => {
      readLevels(bands);

      // Spread the usable spectrum across the bars, weighted to the low end.
      const usable = Math.floor(bands.length * 0.66);
      for (let i = 0; i < BAR_COUNT; i += 1) {
        // Weighted toward the low end, but not so steeply that the bass bars
        // swamp everything else.
        const start = Math.floor((i / BAR_COUNT) ** 1.25 * usable);
        const end = Math.max(start + 1, Math.floor(((i + 1) / BAR_COUNT) ** 1.25 * usable));

        let total = 0;
        for (let b = start; b < end; b += 1) total += bands[b];

        // Gain is deliberately conservative: a loud mix should read as a
        // moving waveform, never a solid block.
        const average = total / (end - start) / 255;
        step(i, Math.min(Math.max(average * 0.85, IDLE_HEIGHT), 0.92));
      }

      paint();
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [accent, isPlaying, readLevels, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: WIDTH, height: HEIGHT }}
      aria-hidden
    />
  );
}

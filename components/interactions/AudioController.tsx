"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** Frequency bins kept small — this drives an accent, not a spectrum analyser. */
const FFT_SIZE = 128;
export const BAND_COUNT = FFT_SIZE / 2;

type AudioEngine = {
  /** Resolved on the server from `public/audio`; null when nothing is supplied. */
  src: string | null;
  isPlaying: boolean;
  /** True once the Web Audio graph is live (after the first user gesture). */
  isAnalysing: boolean;
  toggle: () => void;
  /**
   * Fills `bands` with the current frequency data and returns a normalised
   * 0–1 amplitude. Call it inside your own animation frame — it never causes
   * a re-render, and returns 0 when nothing is playing.
   */
  readLevels: (bands?: Uint8Array) => number;
};

const AudioEngineContext = createContext<AudioEngine | null>(null);

/**
 * Owns the audio element and the Web Audio graph for the whole page.
 *
 * Nothing is created until the visitor presses play — no AudioContext, no
 * network request, and never any autoplay. Consumers pull frequency data
 * imperatively, so playback drives visuals at 60fps without React re-rendering.
 */
export function AudioController({
  src,
  children,
}: {
  src: string | null;
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const scratchRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(BAND_COUNT));

  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);

  // Keep React state in step with the element, including external pauses.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onStop = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onStop);
    audio.addEventListener("ended", onStop);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onStop);
      audio.removeEventListener("ended", onStop);
    };
  }, []);

  // Tear the graph down on unmount so no AudioContext is ever left open.
  useEffect(() => {
    return () => {
      sourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      const context = contextRef.current;
      if (context && context.state !== "closed") void context.close();

      sourceRef.current = null;
      analyserRef.current = null;
      contextRef.current = null;
    };
  }, []);

  const ensureGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || analyserRef.current) return;

    type WindowWithLegacyAudio = Window & { webkitAudioContext?: typeof AudioContext };
    const Ctor =
      window.AudioContext ?? (window as WindowWithLegacyAudio).webkitAudioContext;
    if (!Ctor) return; // No Web Audio support — playback still works, visuals stay flat.

    const context = new Ctor();
    const analyser = context.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0.82;

    // createMediaElementSource may only be called once per element.
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

    contextRef.current = context;
    analyserRef.current = analyser;
    sourceRef.current = source;
    setIsAnalysing(true);
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    // Built inside the click handler, so the gesture unlocks the context.
    ensureGraph();
    void contextRef.current?.resume();
    void audio.play().catch(() => setIsPlaying(false));
  }, [ensureGraph, src]);

  const readLevels = useCallback((bands?: Uint8Array) => {
    const analyser = analyserRef.current;
    const target = bands ?? scratchRef.current;
    if (!analyser || audioRef.current?.paused !== false) {
      target.fill(0);
      return 0;
    }

    analyser.getByteFrequencyData(target as Uint8Array<ArrayBuffer>);

    // Average the lower two-thirds: the musical body, without the hiss up top.
    const usable = Math.floor(target.length * 0.66);
    let total = 0;
    for (let i = 0; i < usable; i += 1) total += target[i];

    return total / usable / 255;
  }, []);

  const engine = useMemo<AudioEngine>(
    () => ({ src, isPlaying, isAnalysing, toggle, readLevels }),
    [src, isPlaying, isAnalysing, toggle, readLevels],
  );

  return (
    <AudioEngineContext.Provider value={engine}>
      {children}
      {src && <audio ref={audioRef} src={src} preload="none" loop />}
    </AudioEngineContext.Provider>
  );
}

/**
 * Access the shared audio engine. Safe outside a provider — returns a silent
 * stub so interaction components can render anywhere.
 */
export function useAudioEngine(): AudioEngine {
  const engine = useContext(AudioEngineContext);
  return engine ?? SILENT_ENGINE;
}

const SILENT_ENGINE: AudioEngine = {
  src: null,
  isPlaying: false,
  isAnalysing: false,
  toggle: () => {},
  readLevels: (bands) => {
    bands?.fill(0);
    return 0;
  },
};

/**
 * Minimal play/pause control. Editorial rather than a media player: a label,
 * a state dot and the waveform. Disabled — with an explanatory label — until a
 * mix is supplied, so it is never a control that silently does nothing.
 */
export function AudioPlayToggle({ className }: { className?: string }) {
  const { src, isPlaying, toggle } = useAudioEngine();
  const label = isPlaying ? "Pause" : "Play";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!src}
      data-cursor="play"
      aria-pressed={isPlaying}
      aria-label={src ? `${label} the hero mix` : "Hero mix not available yet"}
      className={[
        "group flex items-center gap-sm text-[10px] font-light uppercase tracking-[0.24em]",
        "text-white/70 transition-colors duration-200 hover:text-accent",
        "disabled:cursor-not-allowed disabled:text-white/25 disabled:hover:text-white/25",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden
        className={[
          "block h-[5px] w-[5px] rounded-full transition-colors duration-200",
          src
            ? isPlaying
              ? "bg-accent"
              : "bg-white/40 group-hover:bg-accent"
            : "bg-white/20",
        ].join(" ")}
      />
      {src ? label : "Sound"}
    </button>
  );
}

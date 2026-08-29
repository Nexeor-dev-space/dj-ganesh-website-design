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
import { claimAudio, releaseAudio, subscribeAudioOwner } from "@/lib/audio-bus";
import { tracks } from "@/data/tracks";
import type { Track } from "@/types/music";

const FFT_SIZE = 128;
export const BAND_COUNT = FFT_SIZE / 2;

type Graph = { context: AudioContext; analyser: AnalyserNode };

/**
 * One analyser graph per audio element, for the element's whole lifetime.
 *
 * `createMediaElementSource` permanently reroutes an element's output through
 * the graph, and may only be called once for it. Closing that context — or
 * calling it a second time after a remount — leaves the element silent. So the
 * graph is cached against the element and never torn down while it lives; the
 * WeakMap entry goes when the element does.
 */
const graphs = new WeakMap<HTMLAudioElement, Graph>();

type MusicPlayer = {
  tracks: Track[];
  currentTrack: Track;
  currentIndex: number;
  isPlaying: boolean;
  /** Seconds. Updated a few times a second — not every frame. */
  currentTime: number;
  duration: number | null;
  /** Durations for every track, filled in as metadata arrives. */
  durations: Record<string, number>;
  select: (index: number) => void;
  toggle: (index?: number) => void;
  seek: (seconds: number) => void;
  /**
   * Nudge playback by `delta` seconds relative to where the audio actually
   * is. Reads the element rather than React state, so presses arriving faster
   * than `timeupdate` fires still each land.
   */
  seekBy: (delta: number) => void;
  next: () => void;
  previous: () => void;
  /**
   * Fills `bands` with live frequency data and returns a 0–1 amplitude.
   * Call it inside your own animation frame: it never triggers a re-render
   * and returns 0 whenever nothing is playing.
   */
  readLevels: (bands?: Uint8Array) => number;
};

const MusicContext = createContext<MusicPlayer | null>(null);

/**
 * The single source of truth for music playback.
 *
 * One `<audio>` element and one `AudioContext` serve all four tracks —
 * switching track swaps the element's `src`, so the Web Audio graph is built
 * exactly once and two tracks can never sound at the same time. Nothing is
 * created until the first real click, and nothing ever autoplays.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const scratchRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(BAND_COUNT));

  const [currentIndex, setCurrentIndex] = useState(0);
  /** Set when a track change should start playing regardless of prior state. */
  const playOnChangeRef = useRef(false);
  /** True while swapping src, so the load's own pause event is ignored. */
  const switchingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durations, setDurations] = useState<Record<string, number>>({});

  const currentTrack = tracks[currentIndex];

  // Read each file's real duration once, from the files themselves, so the
  // track list never shows a hand-transcribed number that could go stale.
  useEffect(() => {
    let cancelled = false;
    const probes: HTMLAudioElement[] = [];

    tracks.forEach((track) => {
      const probe = new Audio();
      probe.preload = "metadata";
      probe.src = track.audio;
      probes.push(probe);

      probe.addEventListener("loadedmetadata", () => {
        if (cancelled || !Number.isFinite(probe.duration)) return;
        setDurations((current) =>
          current[track.id] ? current : { ...current, [track.id]: probe.duration },
        );
      });
    });

    return () => {
      cancelled = true;
      probes.forEach((probe) => {
        probe.src = "";
      });
    };
  }, []);

  // Keep React in step with the element, including pauses we did not initiate.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      switchingRef.current = false;
      setIsPlaying(true);
      claimAudio("music");
    };
    // Hold the bus to the element's real state, so a pause from any source —
    // not just our own button — hands the background mix back.
    const onPause = () => {
      setIsPlaying(false);
      if (!switchingRef.current) releaseAudio("music");
    };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => {
      setCurrentTime(audio.currentTime);
      if (Number.isFinite(audio.duration)) {
        setDurations((current) => ({ ...current, [currentTrack.id]: audio.duration }));
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
    };
  }, [currentTrack.id]);

  // Someone else (the background mix) took the audio bus — stand down.
  useEffect(() => {
    return subscribeAudioOwner((owner) => {
      if (owner !== "music") audioRef.current?.pause();
    });
  }, []);

  // On unmount, stop the audio and drop the bus — but leave the graph intact.
  // Closing the context or disconnecting the source would permanently silence
  // the element, which survives remounts (Fast Refresh, Strict Mode).
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
      releaseAudio("music");
      analyserRef.current = null;
      contextRef.current = null;
    };
  }, []);

  // Best-effort: the waveform is decoration. Any failure here must leave
  // playback untouched, so everything is cached and guarded.
  const ensureGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let graph = graphs.get(audio);

    if (!graph) {
      try {
        type LegacyWindow = Window & { webkitAudioContext?: typeof AudioContext };
        const Ctor =
          window.AudioContext ?? (window as LegacyWindow).webkitAudioContext;
        if (!Ctor) return; // No Web Audio: playback works, bars stay flat.

        const context = new Ctor();
        const analyser = context.createAnalyser();
        analyser.fftSize = FFT_SIZE;
        analyser.smoothingTimeConstant = 0.82;

        const source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(context.destination);

        graph = { context, analyser };
        graphs.set(audio, graph);
      } catch {
        return; // Leave the element routed straight to the speakers.
      }
    }

    contextRef.current = graph.context;
    analyserRef.current = graph.analyser;
    void graph.context.resume();
  }, []);

  const playCurrent = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Claim the bus and start the audio before touching Web Audio, so the
    // background mix ducks and the track plays even if the graph cannot be
    // built. The visualiser is the only thing that suffers.
    claimAudio("music");
    const started = audio.play();
    ensureGraph();
    void started?.catch(() => setIsPlaying(false));
  }, [ensureGraph]);

  const select = useCallback(
    (index: number) => {
      const bounded = ((index % tracks.length) + tracks.length) % tracks.length;
      if (bounded === currentIndex) return;
      setCurrentIndex(bounded);
      setCurrentTime(0);
    },
    [currentIndex],
  );

  const toggle = useCallback(
    (index?: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Picking a different track is an explicit request to hear it, so it
      // starts playing even if nothing was playing before.
      if (index != null && index !== currentIndex) {
        playOnChangeRef.current = true;
        select(index);
        return;
      }

      if (audio.paused) {
        playCurrent();
      } else {
        audio.pause();
        releaseAudio("music");
      }
    },
    [currentIndex, playCurrent, select],
  );

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.min(Math.max(seconds, 0), audio.duration);
    setCurrentTime(audio.currentTime);
  }, []);

  const seekBy = useCallback(
    (delta: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      seek(audio.currentTime + delta);
    },
    [seek],
  );

  const next = useCallback(() => select(currentIndex + 1), [currentIndex, select]);
  const previous = useCallback(() => select(currentIndex - 1), [currentIndex, select]);

  // A track running out should roll into the next one rather than stopping.
  const advance = useCallback(() => {
    playOnChangeRef.current = true;
    select(currentIndex + 1);
  }, [currentIndex, select]);

  // Changing track mid-play should keep playing, without an autoplay surprise
  // on first mount — hence the guard on `isPlaying`.
  const wasPlayingRef = useRef(false);
  useEffect(() => {
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    switchingRef.current = true;
    audio.load();
    if (wasPlayingRef.current || playOnChangeRef.current) playCurrent();
    playOnChangeRef.current = false;

    // If the swap never reaches `play` (e.g. it was paused), stop suppressing.
    const settle = window.setTimeout(() => {
      switchingRef.current = false;
    }, 400);
    return () => window.clearTimeout(settle);
    // Re-running only when the track changes is the point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const readLevels = useCallback((bands?: Uint8Array) => {
    const analyser = analyserRef.current;
    const target = bands ?? scratchRef.current;
    if (!analyser || audioRef.current?.paused !== false) {
      target.fill(0);
      return 0;
    }

    analyser.getByteFrequencyData(target as Uint8Array<ArrayBuffer>);

    const usable = Math.floor(target.length * 0.66);
    let total = 0;
    for (let i = 0; i < usable; i += 1) total += target[i];
    return total / usable / 255;
  }, []);

  const duration = durations[currentTrack.id] ?? null;

  const value = useMemo<MusicPlayer>(
    () => ({
      tracks,
      currentTrack,
      currentIndex,
      isPlaying,
      currentTime,
      duration,
      durations,
      select,
      toggle,
      seek,
      seekBy,
      next,
      previous,
      readLevels,
    }),
    [
      currentTrack,
      currentIndex,
      isPlaying,
      currentTime,
      duration,
      durations,
      select,
      toggle,
      seek,
      seekBy,
      next,
      previous,
      readLevels,
    ],
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={currentTrack.audio}
        preload="metadata"
        onEnded={advance}
      />
    </MusicContext.Provider>
  );
}

export function useMusicPlayer(): MusicPlayer {
  const player = useContext(MusicContext);
  if (!player) {
    throw new Error("useMusicPlayer must be used inside <MusicProvider>");
  }
  return player;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { claimAudio, releaseAudio, subscribeAudioOwner } from "@/lib/audio-bus";

type BackgroundAudioEngine = {
  src: string | null;
  isMuted: boolean;
  toggle: () => void;
};

const BackgroundAudioContext = createContext<BackgroundAudioEngine | null>(null);

/** Gestures that count as "the visitor has engaged with the page". */
const GESTURES = ["pointerdown", "keydown", "touchstart"] as const;

/**
 * Site-wide background mix, playing by default.
 *
 * The mix is meant to be on from the moment the site opens; the volume
 * control is the only thing that turns it off for good. Browsers do not
 * allow audible autoplay outright, so this tries it, and if the browser
 * refuses, keeps the mix looping silently and unmutes on the very first
 * interaction anywhere on the page — a click, a key, a tap. The visitor
 * never has to find a control to hear it.
 *
 * Once they mute it deliberately, that choice sticks: no later gesture and
 * no track ending will bring it back.
 *
 * The Music section plays the same catalogue, so both share an audio bus.
 * Starting a track ducks the mix; when that track stops, the mix returns.
 */
export function BackgroundAudioProvider({
  src,
  children,
}: {
  src: string | null;
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  /** The visitor's standing intent. On unless they turn it off themselves. */
  const wantsSoundRef = useRef(true);

  const goAudible = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !wantsSoundRef.current) return;

    audio.muted = false;
    setIsMuted(false);
    claimAudio("background");
    void audio.play().catch(() => {
      // Still refused — stay silent rather than pretending to play.
      audio.muted = true;
      setIsMuted(true);
    });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    let disposed = false;

    const onGesture = () => {
      removeGestureListeners();
      if (disposed) return;
      goAudible();
    };

    function removeGestureListeners() {
      GESTURES.forEach((type) => window.removeEventListener(type, onGesture));
    }

    const start = async () => {
      // Try for sound immediately — that is the intended default.
      audio.muted = false;
      try {
        await audio.play();
        if (disposed) return;
        setIsMuted(false);
        claimAudio("background");
      } catch {
        if (disposed) return;
        // Blocked by autoplay policy. Keep the mix rolling silently so it is
        // already buffered and in time, and unmute the moment they interact.
        audio.muted = true;
        setIsMuted(true);
        void audio.play().catch(() => {});
        GESTURES.forEach((type) =>
          window.addEventListener(type, onGesture, { once: true, passive: true }),
        );
      }
    };

    void start();

    return () => {
      disposed = true;
      removeGestureListeners();
    };
  }, [src, goAudible]);

  // Hand over to the Music section while a track plays, and take the mix back
  // once it stops — muting here is a duck, not the visitor's choice.
  useEffect(() => {
    return subscribeAudioOwner((owner) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (owner === "music") {
        // Pausing rather than muting keeps the mix from decoding unheard;
        // it resumes from the same point when the track stops.
        audio.pause();
        setIsMuted(true);
        return;
      }

      if (owner === null && wantsSoundRef.current) {
        audio.muted = false;
        setIsMuted(false);
        void audio.play().catch(() => {});
      }
    });
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const turningOff = !isMuted;
    wantsSoundRef.current = !turningOff;
    setIsMuted(turningOff);

    if (turningOff) {
      // Off means off: stop the stream rather than decoding it silently.
      // `pause()` keeps the position, so turning it back on resumes rather
      // than restarting the mix.
      audio.pause();
      audio.muted = true;
      releaseAudio("background");
    } else {
      // Turning it back on is explicit, so take the bus; the Music player is
      // listening and will pause itself.
      audio.muted = false;
      claimAudio("background");
      void audio.play().catch(() => setIsMuted(true));
    }
  }, [isMuted]);

  return (
    <BackgroundAudioContext.Provider value={{ src, isMuted, toggle }}>
      {children}
      {src && <audio ref={audioRef} src={src} autoPlay muted loop preload="auto" />}
    </BackgroundAudioContext.Provider>
  );
}

/** Access the shared background mix. Safe outside a provider — a silent stub. */
export function useBackgroundAudio(): BackgroundAudioEngine {
  const engine = useContext(BackgroundAudioContext);
  return engine ?? SILENT_ENGINE;
}

const SILENT_ENGINE: BackgroundAudioEngine = {
  src: null,
  isMuted: true,
  toggle: () => {},
};


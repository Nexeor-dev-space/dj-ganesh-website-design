"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type BackgroundAudioEngine = {
  src: string | null;
  isMuted: boolean;
  toggle: () => void;
};

const BackgroundAudioContext = createContext<BackgroundAudioEngine | null>(null);

/**
 * Site-wide background mix, muted by default.
 *
 * Every browser allows autoplay when the element starts muted — nothing here
 * ever plays audibly on its own. The single volume control is what unmutes
 * it, and clicking it is a real user gesture, so this never fights (or
 * quietly relies on) an autoplay-with-sound policy.
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    void audio.play().catch(() => {
      // Autoplay can still be refused (e.g. a user-level browser setting).
      // The volume control's own play() call — a direct click — recovers.
    });
  }, [src]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted && audio.paused) {
      void audio.play().catch(() => setIsMuted(true));
    }
  }

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

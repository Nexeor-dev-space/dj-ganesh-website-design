"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { claimAudio, getAudioOwner, releaseAudio, subscribeAudioOwner } from "@/lib/audio-bus";

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
 *
 * The Music section plays the same catalogue, so both share an audio bus:
 * whichever source the visitor starts last is the one they hear.
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

  // The Music section took over — go silent without touching the visitor's
  // own preference, so the icon still reflects what they last chose.
  useEffect(() => {
    return subscribeAudioOwner((owner) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (owner === "music") {
        audio.muted = true;
        setIsMuted(true);
      }
    });
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      // Unmuting here is an explicit choice, so take the bus back; the Music
      // player is listening and will pause itself.
      claimAudio("background");
      if (audio.paused) void audio.play().catch(() => setIsMuted(true));
    } else if (getAudioOwner() === "background") {
      releaseAudio("background");
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

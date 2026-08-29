"use client";

import { useEffect, useRef } from "react";
import { TrackDisc } from "@/components/music/TrackDisc";
import { useMusicPlayer } from "@/components/music/MusicProvider";

/** How far from the centre a case stays on screen. */
const WINDOW = 2;

/**
 * Wraps a signed distance into the range that keeps it shortest.
 *
 * With the list doubled below, the far end of that range is always outside
 * `WINDOW`, so the jump a case makes when it wraps happens while it is
 * hidden — which is what lets the carousel loop without the long slide across
 * the row that a naive wrap would animate.
 */
function wrapOffset(distance: number, length: number) {
  const positive = ((distance % length) + length) % length;
  return positive > length / 2 ? positive - length : positive;
}

/**
 * The catalogue as a rack of discs.
 *
 * The centred disc is the current track and turns while it plays; the two
 * either side step down in size and dim, so the row reads as depth rather
 * than a list. Clicking a disc brings it to the centre and plays it —
 * clicking the centred one is play/pause, the same gesture the transport
 * below uses.
 *
 * Centring a case starts it: whichever release is in the middle is the one
 * you hear, and the transport below is where it stops. Nothing plays on
 * arrival — the first case only starts once the visitor has moved the rack.
 *
 * The tracks are rendered twice. Four releases cannot fill five positions on
 * their own, so the second copy supplies the far left and far right — the same
 * clone trick the reference leans on, and with a catalogue this small both
 * ends land on the same release, which is exactly what an endless rack should
 * look like. Only the first copy is reachable: the clones are inert to the
 * keyboard and to screen readers, so the four real tracks are announced once
 * each.
 */
export function TrackCarousel() {
  const { tracks, currentIndex, isPlaying, toggle, select } = useMusicPlayer();

  // Read inside the effect below rather than listed as a dependency: pausing
  // from the transport must not look like a reason to start playing again.
  const playingRef = useRef(isPlaying);
  const toggleRef = useRef(toggle);
  const centredRef = useRef<number | null>(null);

  useEffect(() => {
    playingRef.current = isPlaying;
    toggleRef.current = toggle;
  }, [isPlaying, toggle]);

  useEffect(() => {
    // The case sitting in the middle on arrival is a default, not a choice —
    // starting it there would be autoplay, which the browser would refuse and
    // the visitor never asked for.
    if (centredRef.current === null) {
      centredRef.current = currentIndex;
      return;
    }

    if (centredRef.current === currentIndex) return;
    centredRef.current = currentIndex;

    // Clicking a case already starts it; this covers the quieter routes to the
    // centre, so a newly centred release is always the one sounding.
    if (!playingRef.current) toggleRef.current(currentIndex);
  }, [currentIndex]);

  const count = tracks.length;
  // Two copies, so a case exists for every position in the window.
  const slots = count * 2;

  return (
    <div className="track-rack">
      <ul className="track-rack__row">
        {Array.from({ length: slots }, (_, slot) => {
          const track = tracks[slot % count];
          const isClone = slot >= count;
          const offset = wrapOffset(slot - currentIndex, slots);
          const distance = Math.abs(offset);
          const onScreen = distance <= WINDOW;
          const focused = offset === 0;

          return (
            <li
              key={`${track.id}-${isClone ? "clone" : "real"}`}
              className="track-rack__slot"
              data-dist={Math.min(distance, WINDOW)}
              data-hidden={!onScreen}
              style={{ "--side": Math.sign(offset) } as React.CSSProperties}
            >
              <button
                type="button"
                // The clones exist only to fill the ends of the rack.
                aria-hidden={isClone}
                tabIndex={isClone ? -1 : 0}
                aria-current={focused ? "true" : undefined}
                data-cursor="play"
                className="track-rack__case"
                onClick={() => toggle(slot % count)}
                // Tabbing to a track brings it to the centre, so the focused
                // case is never one of the small ones off to the side.
                onFocus={() => select(slot % count)}
              >
                <TrackDisc
                  artwork={track.artwork}
                  focused={focused}
                  spinning={focused && isPlaying}
                />

                <span className="sr-only">
                  {focused && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* The centred release, named under the rack the way a sleeve spine is. */}
      <p className="track-rack__now" aria-live="polite">
        <span className="track-rack__now-title">{tracks[currentIndex].title}</span>
        <span className="track-rack__now-meta">
          {tracks[currentIndex].tag} · {tracks[currentIndex].artist}
        </span>
      </p>
    </div>
  );
}

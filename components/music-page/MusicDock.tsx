"use client";

import { NowPlayingBar } from "@/components/music/NowPlayingBar";
import { useMusicPlayer } from "@/components/music/MusicProvider";

/**
 * The transport, docked to the foot of the viewport.
 *
 * The bar itself is the homepage's `NowPlayingBar`, unchanged — title,
 * waveform, prev/play/next, elapsed against duration, the YouTube link and the
 * scrubber. There is one audio element on this site and one transport for it;
 * this only decides where it sits.
 *
 * It appears once playback has been started rather than on arrival: an empty
 * player docked over a page nobody has pressed anything on is a widget, not a
 * control. Once it has appeared it stays, paused included, so the track can be
 * resumed or scrubbed without hunting for the row it came from.
 */
export function MusicDock() {
  const { isPlaying, currentTime } = useMusicPlayer();
  const started = isPlaying || currentTime > 0;

  return (
    <div className="music-dock" data-open={started} aria-hidden={!started}>
      {/* Kept out of the tab order until it is on screen, so a keyboard never
          lands on a control the visitor cannot see. */}
      <div className="music-dock__panel" inert={!started}>
        <NowPlayingBar />
      </div>
    </div>
  );
}

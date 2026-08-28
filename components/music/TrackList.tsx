"use client";

import { TrackRow } from "@/components/music/TrackRow";
import { useMusicPlayer } from "@/components/music/MusicProvider";

export function TrackList() {
  const { tracks } = useMusicPlayer();

  return (
    <ul className="flex flex-col">
      {tracks.map((track, index) => (
        <li key={track.id}>
          <TrackRow track={track} index={index} />
        </li>
      ))}
    </ul>
  );
}

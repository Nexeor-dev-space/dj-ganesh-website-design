/** One release in the Music section. Shape of the entries in `lib/music.ts`. */
export type Track = {
  id: string;
  title: string;
  tag: string;
  artist: string;
  /** Public path to the local audio file — playback never uses YouTube. */
  audio: string;
  /** External destination only; no embedded player. */
  youtubeId: string;
  artwork: string;
};

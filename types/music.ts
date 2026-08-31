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
  /**
   * Public path (or external URL) of a real, downloadable file.
   *
   * Optional and absent by default: the four mixes in `public/audio` are the
   * streaming previews the client's own site used behind play buttons, never
   * offered as downloads. Set this only when a file genuinely exists to give
   * away — the Downloads page renders a download action for exactly the
   * tracks that carry one, and none for the rest.
   */
  downloadUrl?: string;
};

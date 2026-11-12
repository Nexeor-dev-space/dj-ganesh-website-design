/**
 * Stadium, festival, arena and major live shows, as supplied by the client.
 * These extend the "Recent Big Shows" list beside the gallery reel.
 *
 * `headliner` is set large; `detail` is the supporting line; `place` and
 * `date` are optional facts; `kind` is the one-word tag.
 */
export type LiveShow = {
  id: string;
  headliner: string;
  detail: string;
  place?: string;
  date?: string;
  /** One-word tag, e.g. Stadium, Festival, Tour, Arena, Club, Residency. */
  kind?: string;
};

export const liveShowsLabel = "Stadium · Festival · Arena";
export const liveShowsHeading = "Major Live Shows";

export const liveShows: readonly LiveShow[] = [
  { id: "karan-aujla", headliner: "Karan Aujla", detail: "Stadium show · Opening act", place: "Chandigarh", kind: "Stadium" },
  { id: "sunburn", headliner: "Sunburn Arena", detail: "Main stage alongside Dimitri Vegas & Like Mike", kind: "Festival" },
  { id: "marshmello", headliner: "Marshmello", detail: "India Tour", place: "Mumbai", date: "March 2024", kind: "Tour" },
  { id: "alan-walker", headliner: "Alan Walker", detail: "India Tour", place: "Mumbai", date: "October 2024", kind: "Tour" },
  { id: "emraan", headliner: "Emraan Hashmi", detail: "Live performance", place: "Quake Arena", kind: "Arena" },
  { id: "honey-singh", headliner: "Yo Yo Honey Singh", detail: "Headline performances alongside him", place: "Surf Club, Dubai", kind: "Club" },
  { id: "bastian", headliner: "Bastian", detail: "Featured across flagship Bastian properties", place: "India", kind: "Residency" },
];

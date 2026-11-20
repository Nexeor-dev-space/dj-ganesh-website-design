import { assetUrl } from "@/lib/asset-url";

/**
 * International & Indian artists DJ Ganesh has shared stages with, as supplied
 * by the client (Dimitri Vegas and Like Mike kept as two names at their
 * request), each with the client-supplied portrait. Built-in defaults; the CMS
 * (Home Page → Shared Stages) overrides them.
 *
 * `focus` is the photo's crop position inside the portrait (4:5) tile, as a
 * CSS object-position, set by hand so the face stays in frame. The files in
 * public/images/artists/ keep the full original frame.
 *
 * Photos under ~800px wide are flagged `lowRes` and should be replaced with
 * sharper versions (CMS upload) when available.
 */
export type Artist = {
  name: string;
  image?: string;
  focus?: string;
  lowRes?: boolean;
};

export type ArtistGroup = { id: string; label: string; artists: readonly Artist[] };

const img = (slug: string) => assetUrl(`/images/artists/${slug}.webp`);

export const internationalArtists: ArtistGroup = {
  id: "international",
  label: "International",
  artists: [
    { name: "Jennifer Lopez", image: img("jennifer-lopez"), focus: "50% 22%" },
    { name: "Rihanna", image: img("rihanna-stage-waist"), focus: "50% 20%" },
    { name: "Black Coffee", image: img("black-coffee"), focus: "48% 35%", lowRes: true },
    { name: "Marshmello", image: img("marshmello"), focus: "50% 40%", lowRes: true },
    { name: "Eric Prydz", image: img("eric-prydz"), focus: "48% 25%" },
    { name: "Alan Walker", image: img("alan-walker"), focus: "50% 40%", lowRes: true },
    { name: "Dimitri Vegas", image: img("dimitri-vegas"), focus: "50% 20%", lowRes: true },
    { name: "Like Mike", image: img("like-mike"), focus: "50% 30%", lowRes: true },
    { name: "KSHMR", image: img("kshmr"), focus: "45% 25%", lowRes: true },
  ],
};

export const indianArtists: ArtistGroup = {
  id: "indian",
  label: "Indian",
  artists: [
    { name: "Arijit Singh", image: img("arijit-singh"), focus: "50% 25%", lowRes: true },
    { name: "Diljit Dosanjh", image: img("diljit-dosanjh"), focus: "50% 30%" },
    { name: "Karan Aujla", image: img("karan-aujla"), focus: "50% 30%", lowRes: true },
    { name: "Vishal-Shekhar", image: img("vishal-shekhar"), focus: "50% 40%", lowRes: true },
    { name: "Stebin Ben", image: img("stebin-ben"), focus: "50% 35%", lowRes: true },
    { name: "Badshah", image: img("badshah"), focus: "50% 30%", lowRes: true },
    { name: "Sanam Puri", image: img("sanam-puri-portrait"), focus: "50% 15%", lowRes: true },
    { name: "Mika Singh", image: img("mika-singh"), focus: "43% 30%", lowRes: true },
    { name: "Shankar Mahadevan", image: img("shankar-mahadevan"), focus: "45% 22%", lowRes: true },
    { name: "Sonu Nigam", image: img("sonu-nigam"), focus: "50% 35%", lowRes: true },
  ],
};

export const artistGroups = [internationalArtists, indianArtists] as const;

export const sharedStagesLabel = "Shared Stages";
export const sharedStagesHeading = ["Same Stage,", "Same Night"] as const;
export const sharedStagesLede =
  "International headliners and India's biggest voices — the artists he has shared stages and performances with.";
// No closing line by default; editors can add one in the CMS.
export const sharedStagesClosing = "";

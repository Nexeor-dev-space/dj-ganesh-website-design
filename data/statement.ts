import type { Statement } from "@/types/statement";

/**
 * The statement plate.
 *
 * IMPORTANT — this is not a quote from DJ Ganesh, and it is not presented as
 * one. Neither supplied `index.html` contains a single first-person sentence
 * from him: the bio is written in the third person and nothing on the client's
 * site is attributed to his own voice. Rather than invent words and put a real
 * person's name under them, the plate is set with the client's own line about
 * the sound, marked as what it is.
 *
 * To turn this into the artist-quote section it is built for, replace `lines`
 * with his actual words, set `spoken: true`, and the plate takes quotation
 * marks and reads as a quote. Nothing else needs to change.
 *
 * `lines` is an array rather than a paragraph so the break points are a design
 * decision, the way a pull quote's always is — and so each line can land on
 * its own beat as the section arrives.
 */
export const statementLabel = "The Statement";

export const statement: Statement = {
  /** Verbatim from the client's bio: "Bollywood, Afrobeats and house, mixed into one." */
  lines: ["Bollywood, Afrobeats", "and house, mixed", "into one."],
  /** False until the line above is something he actually said. */
  spoken: false,
  /** Set in the name face, the way the banner and footer are. */
  name: "DJ Ganesh",
  /** The small line under the signature. */
  note: "The BollyAfro sound · Mumbai, 1998 —",
};

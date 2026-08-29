/**
 * The names on the Trusted By band.
 *
 * Carried verbatim from the client's `index.html` (`.trusted__track`), in the
 * order they appear there. Nothing is added: every name on this list is one
 * the client already publishes, and most are already named elsewhere on the
 * page — the Ambani events, Karan Johar's fiftieth and the A-list weddings all
 * sit in the archive, and Bastian closes the 2026 tour line.
 *
 * The band is a marquee, so it carries no dates or detail. Anything that needs
 * qualifying belongs in the archive, where it can be stated properly.
 */
export const trustedNames = [
  "Ambani",
  "Karan Johar",
  "Shah Rukh Khan",
  "Sid & Kiara",
  "Hardik & Natasa",
  "Bastian",
  "Surf Club Dubai",
  "Poorna Patel",
] as const;

export const trustedLabel = "Trusted By";

import type { Offering } from "@/types/experience";

/**
 * The Experience — what he is actually booked for.
 *
 * Titles, copy, bullet points and call-to-action labels are carried over word
 * for word from the client's own `djganesh-v2/index.html`, where this section
 * lives. Nothing is rewritten and no fourth offering is invented.
 */

export const experienceSectionLabel = "What I Do";

/** Set in two lines so it breaks like the other section titles. */
export const experienceHeading = ["The", "Experience"] as const;

export const offerings: readonly Offering[] = [
  {
    id: "01",
    title: "Royal Weddings",
    summary:
      "From Ambani celebrations to destination weddings in Udaipur, the Maldives and Tuscany. India's biggest private nights.",
    points: [
      "Sangeet · pheras · afterparty sets",
      "Live sax, violin & percussion add-ons",
      "Curated with the family, song by song",
    ],
    cta: "Book for Wedding",
  },
  {
    id: "02",
    title: "Club Residencies",
    summary:
      "Resident at Bastian (Mumbai, Bengaluru, Goa), Surf Club Dubai and Willingdon Sports Club. Every weekend is a sold-out headline set.",
    points: [
      "Bastian Mumbai · Bengaluru · Goa",
      "Surf Club Dubai & Willingdon Club",
      "Peak-hour BollyAfro every weekend",
    ],
    cta: "Reserve VIP",
  },
  {
    id: "03",
    title: "BollyAfro Live",
    summary:
      "The signature sound: Bollywood anthems over Afro House, with live saxophone, violin and percussion on stage.",
    points: [
      "Full live ensemble available",
      "Custom visuals & stage design",
      "Festival & arena ready",
    ],
    cta: "Book the Show",
  },
] as const;

/** Every offering leads to the same place. */
export const experienceCtaHref = "#booking";

import type { Offering, Venue } from "@/types/experience";

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

/**
 * The rooms the Club Nights card pictures. The photos are stand-ins from the
 * site's own library — swap `image` for each venue's own shot when it lands.
 * Keyed by title in the about page, so the CMS card picks them up too.
 */
// TODO: replace with venue photos from Club 77 London, Surf Club Dubai and Kenya.
export const clubNightVenues: readonly Venue[] = [
  { name: "Club 77 London", image: "/images/s-2.jpg" },
  { name: "Surf Club Dubai", image: "/images/hero-beach-club-mumbai.jpg" },
  { name: "Kenya", image: "/images/s-3.jpg" },
];

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
    title: "Club Nights",
    summary:
      "Club nights at Club 77 London, Surf Club Dubai, Kenya and Bastian (Mumbai, Bengaluru, Goa): peak-hour BollyAfro for the room.",
    points: [
      "Club 77 London · Surf Club Dubai",
      "Kenya · Bastian Mumbai, Bengaluru, Goa",
      "Peak-hour BollyAfro sets",
    ],
    cta: "Reserve VIP",
    venues: clubNightVenues,
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
export const experienceCtaHref = "/contact#booking";

import { footerContactEmail } from "@/data/footer";
import { shareImage } from "@/lib/seo";
import { siteConfig, siteUrl, socialLinks } from "@/lib/site";

/**
 * The homepage's structured data: DJ Ganesh as a Person, and the booking
 * business as a LocalBusiness, linked to each other by `@id`.
 *
 * Only facts the site already states: the name (and full name from the
 * privacy policy), the positioning line, "based in Mumbai", the booking
 * email and the three accounts in the navigation. No street address, phone,
 * hours, prices or ratings are confirmed, so none are given.
 */
export function HomeStructuredData() {
  const person = `${siteUrl}/#person`;
  const business = `${siteUrl}/#business`;
  const image = `${siteUrl}${shareImage.url}`;
  const sameAs = socialLinks.map((link) => link.href);
  const mumbai = {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressCountry: "IN",
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": person,
        name: siteConfig.name,
        alternateName: "Ganesh Ranganathan",
        jobTitle: "DJ",
        description: siteConfig.description,
        url: siteUrl,
        image,
        address: mumbai,
        sameAs,
      },
      {
        "@type": "LocalBusiness",
        "@id": business,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteUrl,
        image,
        logo: `${siteUrl}/images/logo-dj-ganesh.png`,
        email: footerContactEmail,
        address: mumbai,
        founder: { "@id": person },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "bookings",
          email: footerContactEmail,
          url: `${siteUrl}/contact`,
        },
        sameAs,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // "<" is escaped so no value can ever close the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

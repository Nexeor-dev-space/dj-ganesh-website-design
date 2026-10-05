import type { Metadata } from "next";

// ISR: re-render from the CMS at most once a minute so published edits appear live.
export const revalidate = 60;

import { BookingForm } from "@/components/contact/BookingForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { Container } from "@/components/layout/Container";
import { DirectContact } from "@/components/contact/DirectContact";
import { FinalCta } from "@/components/contact/FinalCta";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navigation/Navbar";
import { RevealSection } from "@/components/layout/RevealSection";
import {
  bookingInfo,
  connectLinks,
  contactDesks,
  contactMeta,
  enquiryMeta,
  finalCta,
} from "@/data/contact";
import { getContactBooking } from "@/lib/cms/queries";

const str = (v: string | null | undefined, fb: string) => (v && v.trim() ? v : fb);
const lines = (
  v: { line: string }[] | null | undefined,
  fb: readonly string[],
): readonly string[] => {
  const l = (v ?? []).map((x) => x.line).filter((x) => x && x.trim());
  return l.length ? l : fb;
};
const platformLabel: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
  twitter: "X",
};

export const metadata: Metadata = {
  title: "Contact / Booking | DJ Ganesh",
  description:
    "Book DJ Ganesh for events, festivals, venues, private functions and collaborations — send a booking enquiry or get in touch directly.",
};

export default async function ContactPage() {
  const cms = await getContactBooking();

  const meta = {
    eyebrow: str(cms?.contactMeta?.eyebrow, contactMeta.eyebrow),
    heading: lines(cms?.contactMeta?.heading, contactMeta.heading),
    lede: str(cms?.contactMeta?.lede, contactMeta.lede),
  };
  const enquiry = {
    heading: str(cms?.enquiry?.heading, enquiryMeta.heading),
    lede: str(cms?.enquiry?.lede, enquiryMeta.lede),
    submitLabel: str(cms?.enquiry?.submitLabel, enquiryMeta.submitLabel),
  };
  const info = {
    heading: str(cms?.bookingInfoBlock?.heading, bookingInfo.heading),
    copy: str(cms?.bookingInfoBlock?.copy, bookingInfo.copy),
  };
  const cta = {
    heading: lines(cms?.finalCta?.heading, finalCta.heading),
    lede: str(cms?.finalCta?.lede, finalCta.lede),
    label: str(cms?.finalCta?.label, finalCta.label),
    href: str(cms?.finalCta?.href, finalCta.href),
  };
  const desks = [
    {
      ...contactDesks[0],
      address: str(cms?.bookingEmail, contactDesks[0].address),
    },
    {
      ...contactDesks[1],
      address: str(cms?.enquiryEmail, contactDesks[1].address),
    },
  ];
  const cmsSocials = (cms?.socialLinks ?? [])
    .filter((x) => platformLabel[x.platform] && x.url)
    .map((x) => ({ label: platformLabel[x.platform], href: x.url }));
  // The CMS socialLinks model has no "email" platform, but the original
  // "Stay connected" list ends with an Email tile (connectLinks). Keep it by
  // appending any code links (e.g. Email) not representable as a social platform,
  // so the rendered list stays complete when CMS socials are present.
  const cmsLabels = new Set(cmsSocials.map((s) => s.label.toLowerCase()));
  const extraLinks = connectLinks.filter((l) => !cmsLabels.has(l.label.toLowerCase()));
  const socials = cmsSocials.length ? [...cmsSocials, ...extraLinks] : connectLinks;

  return (
    <>
      <Navbar />

      <main className="contact-page">
        <ContactHero meta={meta} />

        <RevealSection
          id="booking-enquiry"
          aria-labelledby="enquiry-title"
          className="section-block contact-enquiry relative overflow-hidden"
        >
          <div className="contact-enquiry__glow" aria-hidden />

          <Container className="relative z-10">
            {/* The heading holds the left column on wide screens and the form
                runs beside it, so the page reads as a spread rather than a
                stack of full-width blocks. */}
            <div className="contact-enquiry__spread">
              <div className="contact-enquiry__intro">
                <h2
                  id="enquiry-title"
                  className="reveal-scroll contact-heading contact-heading--lead"
                >
                  {enquiry.heading}
                </h2>
                <p
                  className="reveal-scroll contact-enquiry__lede"
                  style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
                >
                  {enquiry.lede}
                </p>
              </div>

              <div
                className="reveal-scroll contact-enquiry__form"
                style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
              >
                <BookingForm submitLabel={enquiry.submitLabel} />
              </div>
            </div>
          </Container>
        </RevealSection>

        <DirectContact desks={desks} socials={socials} />
        <FinalCta info={info} cta={cta} />
      </main>

      <Footer />
    </>
  );
}

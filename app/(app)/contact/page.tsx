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
} from "@/data/contact";
import { getContactBooking } from "@/lib/cms/queries";
import { cmsPageMetadata } from "@/lib/seo";

const str = (v: string | null | undefined, fb: string) => (v && v.trim() ? v : fb);
/** The CMS value, or undefined so the component's built-in words apply. */
const opt = (v: string | null | undefined) => (v && v.trim() ? v : undefined);
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

/** Page title, description and share image: the CMS "SEO & Link Previews"
 *  fields first, these built-in values otherwise. */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactBooking();
  return cmsPageMetadata(page?.seo, {
    title: "Contact / Booking | DJ Ganesh",
    description:
      "Book DJ Ganesh for events, festivals, venues, private functions and collaborations — send a booking enquiry or get in touch directly.",
    path: "/contact",
  });
}

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
  const desks = [
    {
      label: str(cms?.direct?.bookingLabel, contactDesks[0].label),
      note: str(cms?.direct?.bookingNote, contactDesks[0].note),
      address: str(cms?.bookingEmail, contactDesks[0].address),
    },
    {
      label: str(cms?.direct?.enquiryLabel, contactDesks[1].label),
      note: str(cms?.direct?.enquiryNote, contactDesks[1].note),
      address: str(cms?.enquiryEmail, contactDesks[1].address),
    },
  ];
  const cmsEventTypes = (cms?.enquiry?.eventTypes ?? []).map((row) => row.type?.trim()).filter(Boolean) as string[];
  const cmsSocials = (cms?.socialLinks ?? [])
    .filter((x) => platformLabel[x.platform] && x.url)
    .map((x) => ({ id: x.id, label: platformLabel[x.platform], href: x.url }));
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
          id="booking"
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
                <BookingForm
                  submitLabel={enquiry.submitLabel}
                  eventTypes={cmsEventTypes.length ? cmsEventTypes : undefined}
                  successTitle={opt(cms?.enquiry?.successTitle)}
                  successText={opt(cms?.enquiry?.successText)}
                  againLabel={opt(cms?.enquiry?.againLabel)}
                  errorText={opt(cms?.enquiry?.errorText)}
                />
              </div>
            </div>
          </Container>
        </RevealSection>

        <DirectContact
          desks={desks}
          socials={socials}
          heading={opt(cms?.direct?.heading)}
          socialHeading={opt(cms?.direct?.socialHeading)}
        />
        <FinalCta info={info} />
      </main>

      <Footer />
    </>
  );
}

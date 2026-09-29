import type { Metadata } from "next";
import { BookingForm } from "@/components/contact/BookingForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { Container } from "@/components/layout/Container";
import { DirectContact } from "@/components/contact/DirectContact";
import { FinalCta } from "@/components/contact/FinalCta";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navigation/Navbar";
import { RevealSection } from "@/components/layout/RevealSection";
import { enquiryMeta } from "@/data/contact";

export const metadata: Metadata = {
  title: "Contact / Booking | DJ Ganesh",
  description:
    "Book DJ Ganesh for events, festivals, venues, private functions and collaborations — send a booking enquiry or get in touch directly.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="contact-page">
        <ContactHero />

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
                  {enquiryMeta.heading}
                </h2>
                <p
                  className="reveal-scroll contact-enquiry__lede"
                  style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
                >
                  {enquiryMeta.lede}
                </p>
              </div>

              <div
                className="reveal-scroll contact-enquiry__form"
                style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
              >
                <BookingForm />
              </div>
            </div>
          </Container>
        </RevealSection>

        <DirectContact />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}

import { AboutSection } from "@/components/about/AboutSection";
import { BookingSection } from "@/components/booking/BookingSection";
import { CallSection } from "@/components/call/CallSection";
import { WhatsAppFab } from "@/components/booking/WhatsAppFab";
import { Footer } from "@/components/footer/Footer";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { GlobalReach } from "@/components/global-reach/GlobalReach";
import { Hero } from "@/components/hero/Hero";
import { StagesSection } from "@/components/stages/StagesSection";
import { StatementSection } from "@/components/statement/StatementSection";
import { LegacySection } from "@/components/legacy/LegacySection";
import { MusicSection } from "@/components/music/MusicSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { TrustedBy } from "@/components/trusted/TrustedBy";
import { Navbar } from "@/components/navigation/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <GlobalReach />
        <StagesSection />
        <MusicSection />
        <AboutSection />
        {/* Straight after the career figures: the numbers, then the rooms
            they were played in. */}
        <TrustedBy />
        <StatementSection />
        <LegacySection />
        {/* The record, then what can actually be booked from it. */}
        <ExperienceSection />
        <TestimonialsSection />

        {/* The question, over footage — asked first, so the booking room
            below it is the answer rather than an afterthought. */}
        <CallSection />

        <BookingSection />
      </main>

      <Footer />

      {/* Above every section, on every scroll position: one way to start a
          booking without hunting for the last room. */}
      <WhatsAppFab />
    </>
  );
}

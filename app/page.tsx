import { AboutSection } from "@/components/about/AboutSection";
import { BookingSection } from "@/components/booking/BookingSection";
import { CallSection } from "@/components/call/CallSection";
import { WhatsAppFab } from "@/components/booking/WhatsAppFab";
import { Footer } from "@/components/footer/Footer";
import { BackgroundAudioProvider } from "@/components/audio/BackgroundAudioProvider";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { GlobalReach } from "@/components/global-reach/GlobalReach";
import { Hero } from "@/components/hero/Hero";
import { PlumeRegion } from "@/components/effects/PlumeRegion";
import { StagesSection } from "@/components/stages/StagesSection";
import { StatementSection } from "@/components/statement/StatementSection";
import { LegacySection } from "@/components/legacy/LegacySection";
import { MusicSection } from "@/components/music/MusicSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { TrustedBy } from "@/components/trusted/TrustedBy";
import { Navbar } from "@/components/navigation/Navbar";
import { resolveHeroAudio } from "@/lib/media";

export default function HomePage() {
  const audioSrc = resolveHeroAudio();

  return (
    <BackgroundAudioProvider src={audioSrc}>
      <Navbar />
      <main>
        <Hero />

        {/* One hidden frame for the whole page below the banner: no section
            carries a background of its own, and the pointer's flame reveals
            the same photograph wherever it burns. */}
        <PlumeRegion src="/images/s-4.jpg">
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
        </PlumeRegion>
      </main>

      <Footer />

      {/* Above every section, on every scroll position: one way to start a
          booking without hunting for the last room. */}
      <WhatsAppFab />
    </BackgroundAudioProvider>
  );
}

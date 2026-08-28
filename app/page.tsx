import { AboutSection } from "@/components/about/AboutSection";
import { BackgroundAudioProvider } from "@/components/audio/BackgroundAudioProvider";
import { GlobalReach } from "@/components/global-reach/GlobalReach";
import { Hero } from "@/components/hero/Hero";
import { PlumeRegion } from "@/components/effects/PlumeRegion";
import { LegacySection } from "@/components/legacy/LegacySection";
import { MusicSection } from "@/components/music/MusicSection";
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
          <MusicSection />
          <AboutSection />
          <LegacySection />
        </PlumeRegion>
      </main>
    </BackgroundAudioProvider>
  );
}

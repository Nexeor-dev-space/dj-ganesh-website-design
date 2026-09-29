import type { Metadata } from "next";
import { AboutHero } from "@/components/about-page/AboutHero";
import { ArtistStory } from "@/components/about-page/ArtistStory";
import { ArtistVisual } from "@/components/about-page/ArtistVisual";
import { BookingTransition } from "@/components/about-page/BookingTransition";
import { ExperiencePreview } from "@/components/about-page/ExperiencePreview";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navigation/Navbar";

/**
 * Description is the client's own bio sentence, trimmed to length — no claim
 * here that the page does not already make.
 */
export const metadata: Metadata = {
  title: "DJ Ganesh — About",
  description:
    "DJ Ganesh built the BollyAfro sound in Mumbai, 1998: Bollywood, Afrobeats and house, mixed into one. From private nights for the Ambani family to stages in 45+ countries.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>
        <AboutHero />
        <ArtistStory />
        <ArtistVisual />
        <ExperiencePreview />
        <BookingTransition />
      </main>

      <Footer />
    </>
  );
}

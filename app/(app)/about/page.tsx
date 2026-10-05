import type { Metadata } from "next";

// ISR: re-render from the CMS at most once a minute so published edits appear live.
export const revalidate = 60;

import { AboutHero } from "@/components/about-page/AboutHero";
import { ArtistStory } from "@/components/about-page/ArtistStory";
import { ArtistVisual } from "@/components/about-page/ArtistVisual";
import { BookingTransition } from "@/components/about-page/BookingTransition";
import { ExperiencePreview } from "@/components/about-page/ExperiencePreview";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navigation/Navbar";
import { aboutFrames } from "@/data/about-page";
import { getAbout, getMilestoneBySlug } from "@/lib/cms/queries";
import { resolveMedia } from "@/lib/cms/media";
import { toMilestone } from "@/lib/cms/mappers";
import type { CareerStat } from "@/types/about";
import type { LegacyMilestone } from "@/payload-types";

const str = (v: string | null | undefined) => (v && v.trim() ? v : undefined);

/** Media field -> {src, alt}; undefined when the CMS has no image (code frame stays). */
function frame(
  field: Parameters<typeof resolveMedia>[0],
  fallback: { src: string; alt: string },
) {
  const m = resolveMedia(field, undefined, fallback.alt);
  return m.url ? { src: m.url, alt: m.alt ?? fallback.alt } : undefined;
}

const PREVIEW_SLUGS = ["origin", "taj", "world-tour"];

/**
 * Description is the client's own bio sentence, trimmed to length — no claim
 * here that the page does not already make.
 */
export const metadata: Metadata = {
  title: "DJ Ganesh — About",
  description:
    "DJ Ganesh built the BollyAfro sound in Mumbai, 1998: Bollywood, Afrobeats and house, mixed into one. From private nights for the Ambani family to stages in 45+ countries.",
};

export default async function AboutPage() {
  const about = await getAbout();

  const paragraphs = (about?.story?.paragraphs ?? [])
    .map((p) => p.paragraph)
    .filter((p) => p && p.trim());
  const strands = (about?.soundStrands ?? []).map((s) => s.strand).filter(Boolean);

  const stats: CareerStat[] = (about?.careerStats?.stats ?? []).flatMap((s) => {
    const value = Number(String(s.value ?? "").replace(/,/g, ""));
    if (!s.label || !Number.isFinite(value)) return [];
    return [{ value, label: s.label, ...(s.suffix ? { suffix: s.suffix } : {}) }];
  });

  // Milestones: editor-picked relationship first, else the three known slugs.
  let docs = (about?.experiencePreview?.milestones ?? []).filter(
    (m): m is LegacyMilestone => typeof m === "object" && m !== null,
  );
  if (docs.length === 0) {
    const bySlug = await Promise.all(PREVIEW_SLUGS.map((s) => getMilestoneBySlug(s)));
    if (bySlug.every(Boolean)) docs = bySlug as LegacyMilestone[];
  }
  const milestones = docs.length ? docs.map(toMilestone) : undefined;

  return (
    <>
      <Navbar />

      <main>
        <AboutHero
          intro={str(about?.labels?.intro)}
          statement={str(about?.story?.statement)}
          strands={strands.length ? strands : undefined}
          since={str(about?.story?.careerStart)}
          lede={str(paragraphs[2])}
          stage={frame(about?.frames?.stage, aboutFrames.stage)}
        />
        <ArtistStory
          label={str(about?.labels?.story)}
          paragraphs={paragraphs.length ? paragraphs : undefined}
          stats={stats.length ? stats : undefined}
        />
        <ArtistVisual
          label={str(about?.labels?.identity)}
          statement={str(about?.story?.statement)}
          strands={strands.length ? strands : undefined}
          portrait={frame(about?.frames?.portrait, aboutFrames.portrait)}
          decks={frame(about?.frames?.decks, aboutFrames.decks)}
        />
        <ExperiencePreview
          label={str(about?.labels?.experience)}
          href={str(about?.experiencePreview?.experienceHref)}
          milestones={milestones}
        />
        <BookingTransition
          question={str(about?.outro?.question)}
          cta={str(about?.outro?.cta)}
          href={str(about?.experiencePreview?.bookingHref)}
        />
      </main>

      <Footer />
    </>
  );
}

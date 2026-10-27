import type { Metadata } from "next";

// ISR: re-render from the CMS at most once a minute so published edits appear live.
export const revalidate = 60;

import { AboutHero } from "@/components/about-page/AboutHero";
import { ArtistStory } from "@/components/about-page/ArtistStory";
import { ArtistVisual } from "@/components/about-page/ArtistVisual";
import { BookingTransition } from "@/components/about-page/BookingTransition";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { Footer } from "@/components/footer/Footer";
import { LegacySection } from "@/components/legacy/LegacySection";
import { Navbar } from "@/components/navigation/Navbar";
import { aboutFrames } from "@/data/about-page";
import {
  getAbout,
  getExperiencesServices,
  getHomePage,
  getLegacyMilestones,
} from "@/lib/cms/queries";
import { resolveMedia } from "@/lib/cms/media";
import { toMilestone } from "@/lib/cms/mappers";
import type { CareerStat } from "@/types/about";

const str = (v: string | null | undefined) => (v && v.trim() ? v : undefined);

/** `[{ line: "x" }]` → `["x"]`, or undefined if fewer than `min` non-empty. */
function strings<T extends Record<string, unknown>>(
  arr: readonly T[] | null | undefined,
  key: keyof T,
  min = 1,
): string[] | undefined {
  const out: string[] = [];
  for (const row of arr ?? []) {
    const v = row[key];
    if (typeof v === "string" && v.trim() !== "") out.push(v);
  }
  return out.length >= min ? out : undefined;
}

/** Media field -> {src, alt}; undefined when the CMS has no image (code frame stays). */
function frame(
  field: Parameters<typeof resolveMedia>[0],
  fallback: { src: string; alt: string },
) {
  const m = resolveMedia(field, undefined, fallback.alt);
  return m.url ? { src: m.url, alt: m.alt ?? fallback.alt } : undefined;
}

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
  const [about, home, milestoneDocs, services] = await Promise.all([
    getAbout(),
    getHomePage(),
    getLegacyMilestones(),
    getExperiencesServices(),
  ]);

  const paragraphs = (about?.story?.paragraphs ?? [])
    .map((p) => p.paragraph)
    .filter((p) => p && p.trim());
  const strands = (about?.soundStrands ?? []).map((s) => s.strand).filter(Boolean);

  const stats: CareerStat[] = (about?.careerStats?.stats ?? []).flatMap((s) => {
    const value = Number(String(s.value ?? "").replace(/,/g, ""));
    if (!s.label || !Number.isFinite(value)) return [];
    return [{ value, label: s.label, ...(s.suffix ? { suffix: s.suffix } : {}) }];
  });

  /* The archive: every published milestone, as on the home page before. */
  const milestones = milestoneDocs.length ? milestoneDocs.map(toMilestone) : undefined;

  /* The experience: the offerings from the Experiences / Services collection. */
  const offerings = services.length
    ? services.map((s, i) => ({
        id: String(i + 1).padStart(2, "0"),
        title: s.title,
        summary: s.shortDescription,
        points: (s.features ?? []).map((f) => f.feature),
        cta: s.ctaText ?? "",
      }))
    : undefined;

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
        {/* The career in full, then what can be booked from it — both moved
            here from the home page, which now keeps to the footage. Their
            labels still live on the home-page global, where the editor set
            them. */}
        <LegacySection
          legacySectionLabel={str(home?.legacySection?.label)}
          legacyHeading={strings(home?.legacySection?.heading, "line", 2)}
          milestones={milestones}
        />
        <ExperienceSection
          experienceSectionLabel={str(home?.experienceSection?.label)}
          experienceHeading={strings(home?.experienceSection?.heading, "line", 2)}
          ctaHref={str(home?.experienceSection?.ctaHref)}
          offerings={offerings}
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

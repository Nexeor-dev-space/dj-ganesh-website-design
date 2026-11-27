import type { Metadata } from "next";

// ISR: re-render from the CMS at most once a minute so published edits appear live.
export const revalidate = 60;

import { AboutHero } from "@/components/about-page/AboutHero";
import { ArtistStory } from "@/components/about-page/ArtistStory";
import { ArtistVisual } from "@/components/about-page/ArtistVisual";
import { BookingTransition } from "@/components/about-page/BookingTransition";
import { JourneySection } from "@/components/about-page/JourneySection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { Footer } from "@/components/footer/Footer";
import { LegacySection } from "@/components/legacy/LegacySection";
import { Navbar } from "@/components/navigation/Navbar";
import { aboutFrames } from "@/data/about-page";
import { journeyAlbum, type JourneyPhoto } from "@/data/journey";
import {
  getAbout,
  getExperiencesServices,
  getGalleryAlbums,
  getHomePage,
  getLegacyMilestones,
} from "@/lib/cms/queries";
import { resolveMedia } from "@/lib/cms/media";
import { toMilestone } from "@/lib/cms/mappers";
import type { CareerStat } from "@/types/about";
import { cmsPageMetadata } from "@/lib/seo";

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
/** Page title, description and share image: the CMS "SEO & Link Previews"
 *  fields first, these built-in values otherwise. */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getAbout();
  return cmsPageMetadata(page?.seo, {
    title: "DJ Ganesh — About",
    description:
      "DJ Ganesh is an award-winning DJ and music producer from Mumbai, India, known for his signature Afro-Bollywood sound.",
    path: "/about",
  });
}

/**
 * The Journey photos from the published Gallery album whose Album / Category
 * is "Journey": each photo's alt text from the Media library, its caption from
 * the album row. Undefined when there is no such album or it has no photos,
 * so the built-in frames show.
 */
function journeyFrom(albums: Awaited<ReturnType<typeof getGalleryAlbums>>) {
  const album = albums.find(
    (a) => a.album?.trim().toLowerCase() === journeyAlbum.toLowerCase(),
  );
  const photos: JourneyPhoto[] = (album?.images ?? []).flatMap((row) => {
    const media = typeof row.image === "object" ? row.image : null;
    const { url, alt } = resolveMedia(row.image);
    if (!url) return [];
    return [{
      src: url,
      alt: alt ?? "",
      caption: str(row.caption) ?? "",
      landscape: Boolean(media?.width && media?.height && media.width > media.height),
    }];
  });
  return photos.length ? { heading: str(album?.title), photos } : undefined;
}

export default async function AboutPage() {
  const [about, home, milestoneDocs, services, albums] = await Promise.all([
    getAbout(),
    getHomePage(),
    getLegacyMilestones(),
    getExperiencesServices(),
    getGalleryAlbums(),
  ]);

  const journey = journeyFrom(albums);

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
        ctaHref: str(s.ctaUrl),
        // Optional per-card venue photos from the CMS; none show until uploaded.
        venues: (s.venuePhotos ?? [])
          .map((v) => ({ id: v.id, name: v.name, image: resolveMedia(v.image).url }))
          .filter((v): v is typeof v & { image: string } => Boolean(v.image)),
      }))
    : undefined;

  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        <AboutHero
          stage={frame(about?.frames?.stage, aboutFrames.stage)}
        />
        <ArtistStory
          paragraphs={paragraphs.length ? paragraphs : undefined}
          stats={stats.length ? stats : undefined}
          heading={str(about?.labels?.story)}
        />
        {/* The bio in photographs: CMS Gallery → the "Journey" album. */}
        <JourneySection heading={journey?.heading} photos={journey?.photos} />
        <ArtistVisual
          label={str(about?.labels?.identity)}
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

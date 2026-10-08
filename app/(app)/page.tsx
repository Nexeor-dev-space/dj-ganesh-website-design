// Re-render from the CMS at most once a minute (ISR), so published edits appear
// on the live site without a rebuild. For instant updates, add on-demand
// revalidation (revalidatePath) in Payload afterChange hooks.
export const revalidate = 60;

import { AboutSection } from "@/components/about/AboutSection";
import { BookingSection } from "@/components/booking/BookingSection";
import { WhatsAppFab } from "@/components/booking/WhatsAppFab";
import { Footer } from "@/components/footer/Footer";
import { GallerySection } from "@/components/gallery/GallerySection";
import { GlobalReach } from "@/components/global-reach/GlobalReach";
import { Hero } from "@/components/hero/Hero";
import { StagesSection } from "@/components/stages/StagesSection";
import { MusicSection } from "@/components/music/MusicSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { TrustedBy } from "@/components/trusted/TrustedBy";
import { Navbar } from "@/components/navigation/Navbar";
import {
  getAbout,
  getHomePage,
  getMusicPage,
  getMusicReleases,
  getTestimonials,
  getUpcomingShows,
} from "@/lib/cms/queries";
import { resolveMedia } from "@/lib/cms/media";
import { toTestimonial, toTrack } from "@/lib/cms/mappers";
import { tracks as codeTracks } from "@/data/tracks";
import { galleryItems as codeGallery } from "@/data/gallery";
import { aboutPortrait as codePortrait } from "@/lib/about";
import { tourShows as codeShows } from "@/lib/tour";
import type { Track } from "@/types/music";
import type { Stage } from "@/types/stages";
import type { TourCity, TourShow } from "@/types/tour";
import type { CareerStat } from "@/types/about";
import type { MusicRelease, UpcomingShow } from "@/payload-types";

/* ── Tiny helpers: every one returns `undefined` when the CMS value is empty,
      so the component's own default (the code constant) renders. ─────────── */

const str = (v: string | null | undefined): string | undefined =>
  typeof v === "string" && v.trim() ? v : undefined;

/** `[{ line: "x" }]` → `["x"]`, or undefined if fewer than `min` non-empty. */
/** CMS sound strands with their hover copy; undefined falls back to code. */
function strands(
  arr: readonly { strand?: string | null; description?: string | null }[] | null | undefined,
): { name: string; description?: string }[] | undefined {
  const out = (arr ?? [])
    .filter((row) => row.strand?.trim())
    .map((row) => ({
      name: row.strand!.trim(),
      description: row.description?.trim() || undefined,
    }));
  return out.length ? out : undefined;
}

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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toTourShow(show: UpcomingShow): TourShow | null {
  const d = new Date(show.date);
  if (Number.isNaN(d.getTime()) || !show.city) return null;
  const codeMatch = codeShows.find((c) => c.city.toLowerCase() === show.city.toLowerCase());
  return {
    city: show.city,
    day: String(d.getUTCDate()),
    month: MONTHS[d.getUTCMonth()],
    venue: show.venue ?? "",
    ticketsUrl: show.ticketUrl || codeMatch?.ticketsUrl || "#",
  };
}

export default async function HomePage() {
  const [home, about, releases, upcoming, testimonialDocs, musicPage] = await Promise.all([
    getHomePage(),
    getAbout(),
    getMusicReleases(),
    getUpcomingShows(),
    getTestimonials(),
    getMusicPage(),
  ]);

  /* Hero ------------------------------------------------------------------ */
  const heroVideo = resolveMedia(home?.hero?.heroVideo, "/videos/dj-ganesh.mp4").url;
  const heroPoster = resolveMedia(home?.hero?.heroVideoPoster).url;

  /* Global reach ---------------------------------------------------------- */
  const cities: TourCity[] = (home?.globalReach?.locations ?? [])
    .filter((l) => l.city && typeof l.lat === "number" && typeof l.lng === "number")
    .map((l) => ({
      name: l.city,
      lat: l.lat as number,
      lng: l.lng as number,
      hub: l.hub || undefined,
      labelDx: l.labelDx ?? undefined,
      labelDy: l.labelDy ?? undefined,
    }));
  const featuredShows = (home?.featuredShows?.shows ?? []).filter(
    (s): s is UpcomingShow => typeof s === "object" && s !== null,
  );
  const showSource = featuredShows.length ? featuredShows : upcoming;
  const shows = showSource.map(toTourShow).filter((s): s is TourShow => s !== null);

  /* Stages: CMS is a flat list; the three marquee rows are presentation. --- */
  const flatStages: Stage[] = (home?.stages?.stages ?? [])
    .filter((s) => s.name)
    .map((s) => ({ name: s.name, ...(s.featured ? { featured: true } : {}) }));
  const stageRows = flatStages.length
    ? (() => {
        const size = Math.ceil(flatStages.length / 3);
        return [0, 1, 2]
          .map((i) => flatStages.slice(i * size, (i + 1) * size))
          .filter((row) => row.length);
      })()
    : undefined;

  /* Music ----------------------------------------------------------------- */
  const featuredTracks = (home?.featuredMusic?.tracks ?? []).filter(
    (t): t is MusicRelease => typeof t === "object" && t !== null,
  );
  const releaseSource = featuredTracks.length ? featuredTracks : releases;
  const tracks: Track[] = releaseSource.length
    ? releaseSource.map((r) => {
        const t = toTrack(r);
        // Fill anything the release leaves blank from the matching code track.
        const code = codeTracks.find((c) => c.youtubeId && c.youtubeId === t.youtubeId);
        return {
          ...t,
          audio: t.audio || code?.audio || "",
          artwork: t.artwork || code?.artwork || "",
        };
      })
    : codeTracks;

  /* About band ------------------------------------------------------------ */
  const portrait = resolveMedia(about?.portrait, codePortrait.src, codePortrait.alt);
  const aboutStats: CareerStat[] | undefined = (() => {
    const rows = (about?.careerStats?.stats ?? [])
      .filter((s) => s.label && Number.isFinite(Number(s.value)))
      .map((s) => ({
        value: Number(s.value),
        ...(s.suffix ? { suffix: s.suffix } : {}),
        label: s.label,
      }));
    return rows.length ? rows : undefined;
  })();
  // The homepage About TEASER keeps its own two-paragraph copy from lib/about
  // (see AboutSection defaults). It is distinct from the fuller /about-page story
  // (about.story.paragraphs), so it is intentionally not sourced from that shared
  // CMS field — wiring it there would overwrite the teaser with the About-page copy.
  const aboutCtaLabel = str(about?.cta?.label);
  const aboutCtaHref = str(about?.cta?.href);

  /* Gallery --------------------------------------------------------------- */
  const galleryItems = (() => {
    const rows = (home?.galleryStrip?.items ?? [])
      .map((item, i) => {
        const code = codeGallery[i];
        const media = resolveMedia(item.image, code?.src, code?.alt);
        if (!media.url) return null;
        return {
          src: media.url,
          alt: str(item.alt) ?? media.alt ?? "",
          href: str(item.href) ?? code?.href ?? "#",
        };
      })
      .filter((r): r is { src: string; alt: string; href: string } => r !== null);
    return rows.length ? rows : undefined;
  })();

  /* The statement plate, the Follow band, the archive, the experience and
     the call band are no longer on this page: the first two are folded into
     the menu and the booking section, the archive and the experience moved to
     /about, and the call band's question now opens the booking section. Their
     CMS groups remain in the schema and still seed; they are simply unread
     here. ------------------------------------------------------------------ */

  /* Testimonials ---------------------------------------------------------- */
  const testimonials = testimonialDocs.length ? testimonialDocs.map(toTestimonial) : undefined;

  /* Booking section ------------------------------------------------------- */
  const bs = home?.bookingSection;
  const bookingLinks = (() => {
    const rows = (bs?.links ?? [])
      .filter((l) => l.label && l.href)
      .map((l) => ({
        label: l.label,
        value: l.value ?? "",
        href: l.href,
        ...(l.external ? { external: true } : {}),
      }));
    return rows.length ? rows : undefined;
  })();

  return (
    <>
      <Navbar />
      <main>
        <Hero videoSrc={heroVideo} poster={heroPoster} />

        {/* Who he is, straight after the banner: the story and the career
            figures before any map, stage or track. */}
        <AboutSection
          aboutSectionLabel={str(about?.labels?.sectionLabel)}
          aboutHeading={strings(about?.story?.heading, "line", 3)}
          soundStrands={strands(about?.soundStrands)}
          aboutCta={
            aboutCtaLabel || aboutCtaHref
              ? {
                  label: aboutCtaLabel ?? "Book a private event",
                  href: aboutCtaHref ?? "#booking",
                }
              : undefined
          }
          aboutPortrait={{ src: portrait.url ?? codePortrait.src, alt: portrait.alt ?? codePortrait.alt }}
          careerStats={aboutStats}
        />

        <GlobalReach
          tourCities={cities.length ? cities : undefined}
          tourShows={shows.length ? shows : undefined}
        />
        <StagesSection
          stagesSectionLabel={str(home?.stages?.label)}
          stagesHeading={strings(home?.stages?.heading, "line", 2)}
          stagesLede={str(home?.stages?.lede)}
          stagesCtaLabel={str(home?.stages?.ctaLabel)}
          stagesCtaHref={str(home?.stages?.ctaHref)}
          stageRows={stageRows}
        />
        <MusicSection
          musicSectionLabel={str(musicPage?.homeSection?.sectionLabel)}
          musicHeading={str(musicPage?.homeSection?.heading)}
          spotifyUrl={str(musicPage?.homeSection?.spotifyUrl)}
          tracks={tracks}
        />
        <TrustedBy
          trustedLabel={str(home?.trustedBy?.label)}
          trustedNames={strings(home?.trustedBy?.names, "name")}
        />
        {/* The archive and the experience now live on /about; here the
            proof is the footage. */}
        <GallerySection
          gallerySectionLabel={str(home?.galleryStrip?.label)}
          galleryItems={galleryItems}
        />

        <TestimonialsSection testimonials={testimonials} />

        {/* The question and the room that answers it, as one closing
            section: the ask on the left, the pass on the right. */}
        <BookingSection
          bookingSectionLabel={str(bs?.label)}
          bookingHeading={strings(bs?.heading, "line")}
          bookingLede={str(bs?.lede)}
          bookingScope={strings(bs?.scope, "item")}
          bookingLinks={bookingLinks}
        />
      </main>

      <Footer />

      {/* Above every section, on every scroll position: one way to start a
          booking without hunting for the last room. */}
      <WhatsAppFab />
    </>
  );
}

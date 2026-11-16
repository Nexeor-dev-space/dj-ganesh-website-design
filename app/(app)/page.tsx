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
import { NonstopSets } from "@/components/nonstop/NonstopSets";
import { nonstopSets as codeNonstop } from "@/data/nonstop";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { TrustedBy } from "@/components/trusted/TrustedBy";
import { PrivateClientele } from "@/components/guest-list/PrivateClientele";
import { SharedStages } from "@/components/shared-stages/SharedStages";
import {
  indianArtists as codeIndianArtists,
  internationalArtists as codeIntlArtists,
} from "@/data/shared-stages";
import {
  celebrityWeddings as codeWeddings,
  guestListCta as codeClienteleCta,
  privateCelebrations as codePrivate,
} from "@/data/guest-list";
import { Navbar } from "@/components/navigation/Navbar";
import {
  getAbout,
  getContactBooking,
  getSiteSettings,
  getHomePage,
  getMusicPage,
  getMusicReleases,
  getTestimonials,
  getUpcomingShows,
} from "@/lib/cms/queries";
import { resolveMedia } from "@/lib/cms/media";
import { toTestimonial, toTrack } from "@/lib/cms/mappers";
import { tracks as codeTracks } from "@/data/tracks";
import { bookingCta as codeBookingCta } from "@/data/booking";
import { galleryFeature as codeFeature, galleryItems as codeGallery } from "@/data/gallery";
import { aboutPortrait as codePortrait, aboutStory as codeStory } from "@/lib/about";
import { tourShows as codeShows } from "@/lib/tour";
import type { Track } from "@/types/music";
import type { Stage } from "@/types/stages";
import type { TourCity, TourShow } from "@/types/tour";
import type { CareerStat } from "@/types/about";
import type { MusicRelease, UpcomingShow } from "@/payload-types";
import type { Metadata } from "next";
import { HomeStructuredData } from "@/components/seo/HomeStructuredData";
import { siteConfig } from "@/lib/site";
import { cmsPageMetadata } from "@/lib/seo";
import { assetUrl } from "@/lib/asset-url";

/** Page title, description and share image: the CMS "SEO & Link Previews"
 *  fields first, these built-in values otherwise. */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  return cmsPageMetadata(page?.seo, {
    title: siteConfig.title,
    description: siteConfig.description,
    path: "/",
  });
}

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

/**
 * The homepage My Story text: paragraphs split on an empty line. The first is
 * the story, the rest the closing line; a lone paragraph keeps the built-in
 * closing line. Undefined when empty, so the built-in text shows.
 */
function storyText(bio: string | null | undefined): string[] | undefined {
  const parts = (bio ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return undefined;
  return [parts[0], parts.slice(1).join(" ") || codeStory[1]];
}

/** Drops undefined keys so a component's own defaults apply to them. */
function stripUndefined<T extends Record<string, unknown>>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
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
    year: String(d.getUTCFullYear()),
    venue: show.venue ?? "",
    ticketsUrl: show.ticketUrl || codeMatch?.ticketsUrl || "#",
  };
}

export default async function HomePage() {
  const [home, about, releases, upcoming, testimonialDocs, musicPage, contact] = await Promise.all([
    getHomePage(),
    getAbout(),
    getMusicReleases(),
    getUpcomingShows(),
    getTestimonials(),
    getMusicPage(),
    getContactBooking(),
  ]);
  // Already loaded by the layout; `cache` makes this a lookup, not a query.
  const settings = await getSiteSettings();
  const profiles = (settings?.socialLinks?.length ? settings.socialLinks : contact?.socialLinks ?? [])
    .map((s) => s.url)
    .filter((u): u is string => typeof u === "string" && /^https?:\/\//.test(u));

  /* Hero ------------------------------------------------------------------ */
  const heroVideo = resolveMedia(home?.hero?.heroVideo, assetUrl("/videos/dj-ganesh.mp4")).url;
  const heroPoster = resolveMedia(home?.hero?.heroVideoPoster).url;

  /* Global reach ---------------------------------------------------------- */
  const cities: TourCity[] = (home?.globalReach?.locations ?? [])
    .filter((l) => l.city && typeof l.lat === "number" && typeof l.lng === "number")
    .map((l) => ({
      id: l.id,
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
    .map((s) => ({ id: s.id, name: s.name, ...(s.featured ? { featured: true } : {}) }));
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
        id: s.id,
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
          href: str(item.href) ?? code?.href,
        };
      })
      .filter((r): r is { src: string; alt: string; href: string | undefined } => r !== null);
    return rows.length ? rows : undefined;
  })();

  /* The statement plate, the Follow band, the archive, the experience and
     the call band are no longer on this page: the first two are folded into
     the menu and the booking section, the archive and the experience moved to
     /about, and the call band's question now opens the booking section. Their
     CMS groups remain in the schema and still seed; they are simply unread
     here. ------------------------------------------------------------------ */

  /* Private Clientele: each list falls back to its built-in names on its own. */
  const pc = home?.privateClientele;
  const clienteleEntries = (
    rows: readonly { id?: string | null; primary?: string | null; secondary?: string | null }[] | null | undefined,
  ) => {
    const out = (rows ?? [])
      .filter((r) => r.primary?.trim())
      .map((r, i) => ({ id: r.id ?? `row-${i}`, primary: r.primary!.trim(), secondary: r.secondary?.trim() ?? "" }));
    return out.length ? out : undefined;
  };
  const clienteleCategories = [
    {
      ...codePrivate,
      label: str(pc?.privateLabel) ?? codePrivate.label,
      shortLabel: str(pc?.privateShortLabel) ?? codePrivate.shortLabel,
      entries: clienteleEntries(pc?.privateEntries) ?? codePrivate.entries,
      closing: str(pc?.privateClosing) ?? codePrivate.closing,
    },
    {
      ...codeWeddings,
      label: str(pc?.weddingsLabel) ?? codeWeddings.label,
      shortLabel: str(pc?.weddingsShortLabel) ?? codeWeddings.shortLabel,
      entries: clienteleEntries(pc?.weddingEntries) ?? codeWeddings.entries,
    },
  ];
  const clienteleStats = (() => {
    const rows = (pc?.stats ?? [])
      .filter((s) => s.label && Number.isFinite(Number(s.value)))
      .map((s) => ({ id: s.id ?? undefined, value: Number(s.value), suffix: s.suffix ?? undefined, label: s.label }));
    return rows.length ? rows : undefined;
  })();

  /* Shared Stages: each list falls back to its built-in artists on its own.
     Per artist, an uploaded photo / focus wins; otherwise the built-in photo
     for that name (matched case-insensitively), so typing a name is enough. */
  const ss = home?.sharedStages;
  const codeArtists = [...codeIntlArtists.artists, ...codeIndianArtists.artists];
  const toArtists = (
    rows: readonly { name?: string | null; photo?: unknown; focus?: string | null }[] | null | undefined,
  ) => {
    const out = (rows ?? [])
      .filter((r) => r.name?.trim())
      .map((r) => {
        const name = r.name!.trim();
        const code = codeArtists.find((c) => c.name.toLowerCase() === name.toLowerCase());
        const photo = resolveMedia(r.photo as Parameters<typeof resolveMedia>[0], code?.image);
        return { name, image: photo.url, focus: str(r.focus) ?? code?.focus };
      });
    return out.length ? out : undefined;
  };
  const sharedGroups = [
    {
      ...codeIntlArtists,
      label: str(ss?.internationalLabel) ?? codeIntlArtists.label,
      artists: toArtists(ss?.internationalArtists) ?? codeIntlArtists.artists,
    },
    {
      ...codeIndianArtists,
      label: str(ss?.indianLabel) ?? codeIndianArtists.label,
      artists: toArtists(ss?.indianArtists) ?? codeIndianArtists.artists,
    },
  ];

  /* The international intro and closing line, shown inside Global Reach. The
     CMS group is still named internationalShows (it began as its own band). */
  const intl = home?.internationalShows;

  /* Testimonials ---------------------------------------------------------- */
  const testimonials = testimonialDocs.length ? testimonialDocs.map(toTestimonial) : undefined;

  /* Hero ------------------------------------------------------------------ */
  const hero = home?.hero;
  const heroProps = {
    kicker: str(hero?.heroSubheading),
    name: str(hero?.heroHeading),
    primaryCta: hero?.heroCtaText || hero?.heroCtaUrl
      ? { label: str(hero?.heroCtaText) ?? "Book DJ Ganesh", href: str(hero?.heroCtaUrl) ?? "/contact#booking" }
      : undefined,
    secondaryCta: hero?.heroSecondaryCtaText || hero?.heroSecondaryCtaUrl
      ? { label: str(hero?.heroSecondaryCtaText) ?? "Listen to Music", href: str(hero?.heroSecondaryCtaUrl) ?? "#music" }
      : undefined,
  };

  /* Gallery reel ------------------------------------------------------------ */
  const gs = home?.galleryStrip;
  const galleryFeature = {
    videoSrc: resolveMedia(gs?.reelVideo, codeFeature.videoSrc).url ?? codeFeature.videoSrc,
    poster: resolveMedia(gs?.reelPoster, codeFeature.poster).url,
    label: str(gs?.reelLabel) ?? codeFeature.label,
    eyebrow: str(gs?.reelEyebrow) ?? codeFeature.eyebrow,
    shows: (() => {
      const rows = (gs?.liveShows ?? [])
        .filter((x) => x.headliner?.trim())
        .map((x, i) => ({
          id: x.id ?? `show-${i}`,
          headliner: x.headliner.trim(),
          detail: str(x.detail) ?? "",
          place: str(x.place),
          date: str(x.date),
          kind: str(x.kind),
        }));
      return rows.length ? rows : codeFeature.shows;
    })(),
  };

  /* Nonstop Sets ------------------------------------------------------------ */
  const ns = home?.nonstop;
  const nonstopSets = (ns?.sets ?? [])
    .filter((x) => x.title)
    .map((x, i) => ({
      id: x.id,
      title: x.title,
      tag: x.tag ?? "",
      length: x.length ?? "",
      image: resolveMedia(x.image, codeNonstop[i % codeNonstop.length]?.image).url ?? "",
      href: str(x.url) ?? "#",
    }));

  /* Testimonials photo wall: uploaded photos, or the built-in set. -------- */
  const wallPhotos = (home?.testimonialsSection?.wallPhotos ?? [])
    .map((row) => resolveMedia(row.image))
    .filter((m): m is typeof m & { url: string } => Boolean(m.url))
    .map((m) => ({ src: m.url, alt: m.alt ?? "" }));

  /* Booking section ------------------------------------------------------- */
  const bs = home?.bookingSection;
  const bookingLinks = (() => {
    const rows = (bs?.links ?? [])
      .filter((l) => l.label && l.href)
      .map((l) => ({
        id: l.id,
        label: l.label,
        value: l.value ?? "",
        href: l.href,
        ...(l.external ? { external: true } : {}),
      }));
    return rows.length ? rows : undefined;
  })();

  return (
    <>
      <HomeStructuredData email={str(contact?.bookingEmail)} profiles={profiles} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero videoSrc={heroVideo} poster={heroPoster} {...stripUndefined(heroProps)} />

        {/* Who he is, straight after the banner: the story and the career
            figures before any map, stage or track. */}
        <AboutSection
          aboutSectionLabel={str(about?.labels?.sectionLabel)}
          aboutHeading={strings(about?.story?.heading, "line", 3)}
          aboutStory={storyText(home?.artistIntro?.introBio)}
          soundStrands={strands(about?.soundStrands)}
          aboutCta={
            aboutCtaLabel || aboutCtaHref
              ? {
                  label: aboutCtaLabel ?? "Book a private event",
                  href: aboutCtaHref ?? "/contact#booking",
                }
              : undefined
          }
          aboutPortrait={{ src: portrait.url ?? codePortrait.src, alt: portrait.alt ?? codePortrait.alt }}
          careerStats={aboutStats}
        />

        <GlobalReach
          tourName={str(home?.globalReach?.label)}
          tourCities={cities.length ? cities : undefined}
          tourShows={shows.length ? shows : undefined}
          enquiryEmail={str(contact?.bookingEmail)}
          {...stripUndefined({ intro: str(intl?.lede), closing: str(intl?.closing) })}
          copy={stripUndefined({
            heading: str(home?.globalReach?.heading),
            hint: str(home?.globalReach?.hint),
            citiesLabel: str(home?.globalReach?.citiesLabel),
            hubLabel: str(home?.globalReach?.hubLabel),
            countriesLine: str(home?.globalReach?.countriesLine),
            enquiryLine: str(home?.globalReach?.enquiryLine),
            upNextLabel: str(home?.featuredShows?.heading),
            nextShowLabel: str(home?.globalReach?.showCard?.nextShowLabel),
            ticketsLabel: str(home?.globalReach?.showCard?.ticketsLabel),
            openDateLabel: str(home?.globalReach?.showCard?.openDateLabel),
            noShowText: str(home?.globalReach?.showCard?.noShowText),
            noShowLede: str(home?.globalReach?.showCard?.noShowLede),
            enquireLabel: str(home?.globalReach?.showCard?.enquireLabel),
          })}
        />
        <StagesSection
          stagesSectionLabel={str(home?.stages?.label)}
          stagesHeading={strings(home?.stages?.heading, "line", 2)}
          stagesLede={str(home?.stages?.lede)}
          stagesCtaLabel={str(home?.stages?.ctaLabel)}
          stagesCtaHref={str(home?.stages?.ctaHref)}
          stageRows={stageRows}
        />

        {/* The artists behind those rooms: after the venues, who shared them. */}
        <SharedStages
          {...stripUndefined({
            label: str(ss?.label),
            heading: strings(ss?.heading, "line"),
            lede: str(ss?.lede),
            closing: str(ss?.closing),
          })}
          groups={sharedGroups}
        />
        <MusicSection
          musicSectionLabel={str(musicPage?.homeSection?.sectionLabel)}
          musicHeading={str(musicPage?.homeSection?.heading)}
          spotifyUrl={str(musicPage?.homeSection?.spotifyUrl)}
          tracks={tracks}
          playerLabels={stripUndefined({
            youtube: str(musicPage?.player?.youtubeLabel),
            spotify: str(musicPage?.player?.spotifyLabel),
            playlist: str(musicPage?.player?.playlistHeading),
          })}
          archiveLabel={str(musicPage?.player?.archiveLinkLabel)}
        />

        {/* Long-form mixes, straight after the singles. */}
        <NonstopSets
          label={str(ns?.label)}
          heading={strings(ns?.heading, "line")}
          lede={str(ns?.lede)}
          sets={nonstopSets.length ? nonstopSets : undefined}
          spotifyUrl={str(ns?.spotifyUrl)}
          podcastUrl={str(ns?.podcastUrl)}
          spotifyLabel={str(ns?.spotifyLabel)}
          podcastLabel={str(ns?.podcastLabel)}
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
          feature={galleryFeature}
        />

        {/* Who has booked him behind closed doors, just before what clients
            say about him. */}
        <PrivateClientele
          {...stripUndefined({
            label: str(pc?.label),
            heading: strings(pc?.heading, "line"),
            lede: str(pc?.lede),
            stats: clienteleStats,
          })}
          categories={clienteleCategories}
          cta={
            str(pc?.ctaLabel) || str(pc?.ctaHref)
              ? { label: str(pc?.ctaLabel) ?? codeClienteleCta.label, href: str(pc?.ctaHref) ?? codeClienteleCta.href }
              : undefined
          }
        />

        <TestimonialsSection
          testimonials={testimonials}
          heading={strings(home?.testimonialsSection?.heading, "line")?.join(" ")}
          subtitle={str(home?.testimonialsSection?.label)}
          wallPhotos={wallPhotos}
        />

        {/* The question and the room that answers it, as one closing
            section: the ask on the left, the pass on the right. */}
        <BookingSection
          bookingSectionLabel={str(bs?.label)}
          bookingHeading={strings(bs?.heading, "line")}
          bookingLede={str(bs?.lede)}
          bookingScope={strings(bs?.scope, "item")}
          bookingLinks={bookingLinks}
          bookingCta={
            str(bs?.ctaLabel) || str(bs?.ctaHref)
              ? { label: str(bs?.ctaLabel) ?? codeBookingCta.label, href: str(bs?.ctaHref) ?? codeBookingCta.href }
              : undefined
          }
        />
      </main>

      <Footer />

      {/* Above every section, on every scroll position: one way to start a
          booking without hunting for the last room. */}
      <WhatsAppFab />
    </>
  );
}

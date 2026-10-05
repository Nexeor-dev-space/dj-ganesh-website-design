import type { Metadata } from "next";

// ISR: re-render from the CMS at most once a minute so published edits appear live.
export const revalidate = 60;

import { ContinueListening } from "@/components/music-page/ContinueListening";
import { Footer } from "@/components/footer/Footer";
import { MusicArchive } from "@/components/music-page/MusicArchive";
import { MusicDock } from "@/components/music-page/MusicDock";
import { MusicHero } from "@/components/music-page/MusicHero";
import { MusicProvider } from "@/components/music/MusicProvider";
import { Navbar } from "@/components/navigation/Navbar";
import { getAbout, getMusicPage, getMusicReleases } from "@/lib/cms/queries";
import { toTrack } from "@/lib/cms/mappers";

const str = (v: string | null | undefined) => (v && v.trim() ? v : undefined);

/**
 * Description is the client's own line about the sound plus what the page
 * actually holds. No genre list, no release claims, nothing the archive itself
 * does not state.
 */
export const metadata: Metadata = {
  title: "DJ Ganesh — Music",
  description:
    "The full listening archive: mixes and mashups by DJ Ganesh — Bollywood, Afrobeats and house, mixed into one. Play every track in full.",
};

/**
 * `/music` — the complete listening archive.
 *
 * The homepage section is discovery: four discs racked up, one of them
 * centred. This is the archive: every release as its own entry — pressing,
 * title, credit and transport together — with a filter, a search and the
 * transport docked at the foot of the screen.
 *
 * `MusicProvider` wraps the whole page rather than a section of it, so the
 * archive rows and the dock are two views of one audio element — which is what makes "only one track at a time" a property of
 * the page rather than something each control has to remember.
 */
export default async function MusicPage() {
  const [page, about, releases] = await Promise.all([
    getMusicPage(),
    getAbout(),
    getMusicReleases(),
  ]);

  const tracks = releases.length ? releases.map(toTrack) : undefined;
  const strands = (about?.soundStrands ?? []).map((s) => s.strand).filter(Boolean);

  return (
    <>
      <Navbar />

      <MusicProvider tracks={tracks}>
        <main>
          <MusicHero
            intro={str(page?.labels?.intro)}
            title={str(page?.pageTitle)}
            statement={str(page?.statement)}
            strands={strands.length ? strands : undefined}
            count={tracks?.length}
          />
          <MusicArchive label={str(page?.labels?.archive)} />
          <ContinueListening
            label={str(page?.labels?.continue)}
            url={str(page?.homeSection?.allReleasesUrl)}
          />
        </main>

        <MusicDock />
      </MusicProvider>

      <Footer />
    </>
  );
}

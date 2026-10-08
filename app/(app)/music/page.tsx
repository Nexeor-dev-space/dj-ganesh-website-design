import type { Metadata } from "next";

// ISR: re-render from the CMS at most once a minute so published edits appear live.
export const revalidate = 60;

import { ContinueListening } from "@/components/music-page/ContinueListening";
import { Footer } from "@/components/footer/Footer";
import { MusicArchive } from "@/components/music-page/MusicArchive";
import { MusicHero } from "@/components/music-page/MusicHero";
import { MusicProvider } from "@/components/music/MusicProvider";
import { Navbar } from "@/components/navigation/Navbar";
import { getMusicPage, getMusicReleases } from "@/lib/cms/queries";
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
 * The page's opening, then the same vinyl player the homepage carries —
 * every release in its sleeve — and the links out to the channel and Spotify.
 *
 * `MusicProvider` wraps the whole page, so the player reads the full running
 * order and only one track can ever sound at a time.
 */
export default async function MusicPage() {
  const [page, releases] = await Promise.all([getMusicPage(), getMusicReleases()]);

  const tracks = releases.length ? releases.map(toTrack) : undefined;

  return (
    <>
      <Navbar />

      <MusicProvider tracks={tracks}>
        <main>
          <MusicHero
            intro={str(page?.labels?.intro)}
            title={str(page?.pageTitle)}
            statement={str(page?.statement)}
          />
          <MusicArchive spotifyUrl={str(page?.homeSection?.spotifyUrl)} />
          <ContinueListening
            label={str(page?.labels?.continue)}
            url={str(page?.homeSection?.allReleasesUrl)}
            spotifyUrl={str(page?.homeSection?.spotifyUrl)}
          />
        </main>
      </MusicProvider>

      <Footer />
    </>
  );
}

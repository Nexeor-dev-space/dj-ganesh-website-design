/**
 * The banner's video background.
 *
 * `public/videos/dj-ganesh.mp4` is the whole frame: full-bleed, `object-fit:
 * cover`, and the only movement in the section — the old site's banner works
 * the same way, so nothing is layered on top of it beyond what the copy needs
 * to stay legible.
 *
 * `poster` is deliberately absent: there is no still of this footage on disk,
 * and pointing it at an unrelated photograph would flash a different image
 * before the video arrives. The section's own dark ground covers that gap.
 *
 * Muted and `playsInline` are what let it start without being asked — a
 * browser will refuse an autoplaying video with sound, and iOS will take a
 * video without `playsInline` fullscreen rather than leaving it in the page.
 */
export function HeroBackground() {
  return (
    <div className="hero-media" aria-hidden>
      <video
        className="hero-media__video"
        src="/videos/dj-ganesh.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Only as much as the copy needs: weighted to the bottom, where the
          lockup sits, so the footage stays visible through the middle. */}
      <div className="hero-media__fade" />
    </div>
  );
}

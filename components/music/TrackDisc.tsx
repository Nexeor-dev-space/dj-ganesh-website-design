import Image from "next/image";

type TrackDiscProps = {
  artwork: string;
  /** Drives the sharpness of the request — only the centred disc is large. */
  focused: boolean;
  /** True while this disc is the one sounding, which is what sets it turning. */
  spinning: boolean;
};

/**
 * The release as a bare disc.
 *
 * Drawn rather than photographed: the sleeve art clipped to a circle, the
 * pressing rings and a specular sweep over it, and the clamping ring and
 * spindle hole on top. Gradients only, so it costs no extra request and stays
 * crisp at every size the rack scales it to.
 *
 * The platter carries the art and the banding and turns while the track plays;
 * the hub stays put, the way the spindle does.
 */
export function TrackDisc({ artwork, focused, spinning }: TrackDiscProps) {
  return (
    <span className="disc" aria-hidden>
      <span className="disc__platter" data-spinning={spinning ? "true" : "false"}>
        <Image
          src={artwork}
          alt=""
          fill
          sizes={focused ? "(min-width: 768px) 460px, 76vw" : "260px"}
          className="disc__art"
        />
        {/* Banding over the art, then the hub above both, so the rings stop
            where the label clamp begins. */}
        <span className="disc__rings" />
      </span>

      <span className="disc__hub" />
    </span>
  );
}

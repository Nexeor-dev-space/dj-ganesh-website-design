import { trustedLabel, trustedNames } from "@/data/trusted";

/**
 * The rooms he has played, as a band that never stops moving.
 *
 * A band rather than a section: it sits between two sections on the page's own
 * hairlines and carries a tighter rhythm, so the names read as a caption
 * running under the story rather than a stop of their own.
 *
 * The list is rendered twice. The track scrolls exactly half its width and
 * starts over, which is seamless only because both halves are identical — the
 * spacing lives inside each item rather than in a flex `gap`, so the two ends
 * meet without half a gap between them. The second copy is `aria-hidden`, so
 * the eight names are announced once each.
 */
export function TrustedBy() {
  return (
    <section aria-label={trustedLabel} className="trusted">
      <p className="trusted__label">{trustedLabel}</p>

      <div className="trusted__viewport">
        <div className="trusted__track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="trusted__half"
              /* The second run exists only to close the loop. */
              aria-hidden={copy === 1 || undefined}
            >
              {trustedNames.map((name) => (
                <li key={name} className="trusted__item">
                  <span className="trusted__name">{name}</span>
                  <span className="trusted__mark" aria-hidden>
                    ✦
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

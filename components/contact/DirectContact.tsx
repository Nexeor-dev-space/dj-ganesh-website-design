import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { RevealSection } from "@/components/layout/RevealSection";
import { connectLinks, contactDesks } from "@/data/contact";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/**
 * The two desks and the two accounts, side by side.
 *
 * Both halves are lists of addresses rather than cards: someone who would
 * rather write their own email should be able to read one off the page and
 * leave, which is the whole job of this section.
 */
export function DirectContact() {
  return (
    <RevealSection
      id="direct"
      aria-labelledby="direct-title"
      className="section-block contact-direct relative overflow-hidden"
    >
      <Container className="relative z-10">
        <div className="contact-direct__spread">
          <div>
            <h2 id="direct-title" className="reveal-scroll contact-heading" style={delay(0)}>
              Or get in touch directly
            </h2>

            <dl className="contact-desks">
              {contactDesks.map((desk, index) => (
                <div
                  key={desk.label}
                  className="reveal-scroll contact-desk"
                  style={delay(120 + index * 90)}
                >
                  <dt className="contact-desk__label">{desk.label}</dt>
                  <dd className="contact-desk__value">
                    <a href={`mailto:${desk.address}`} className="contact-desk__link">
                      {desk.address}
                    </a>
                    <span className="contact-desk__note">{desk.note}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="contact-connect">
            <h2 className="reveal-scroll contact-heading" style={delay(180)}>
              Stay connected
            </h2>

            <ul className="contact-social">
              {connectLinks.map((social, index) => (
                <li
                  key={social.href}
                  className="reveal-scroll"
                  style={delay(260 + index * 90)}
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="contact-social__link"
                  >
                    {social.label}
                    <span aria-hidden className="contact-social__arrow">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </RevealSection>
  );
}

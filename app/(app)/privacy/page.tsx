import type { Metadata } from "next";

export const revalidate = 60;

import { Footer } from "@/components/footer/Footer";
import { Container } from "@/components/layout/Container";
import { Navbar } from "@/components/navigation/Navbar";
import { privacyPolicy } from "@/data/privacy";
import { getPrivacyPolicy } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "DJ Ganesh — Privacy Policy",
  description: "What we collect through the booking form, why, and your rights over it.",
};

const str = (v: string | null | undefined) => (v && v.trim() ? v : undefined);

/**
 * `/privacy` — the privacy policy, short and plain. Copy comes from the CMS
 * "Privacy Policy" global, falling back to data/privacy.ts.
 */
export default async function PrivacyPage() {
  const cms = await getPrivacyPolicy();
  const cmsSections = (cms?.sections ?? [])
    .filter((s) => s.heading && s.body)
    .map((s) => ({ heading: s.heading, body: s.body }));

  const title = str(cms?.title) ?? privacyPolicy.title;
  const updated = str(cms?.updated) ?? privacyPolicy.updated;
  const intro = str(cms?.intro) ?? privacyPolicy.intro;
  const sections = cmsSections.length ? cmsSections : privacyPolicy.sections;

  return (
    <>
      <Navbar />

      <main className="policy">
        <Container>
          <p className="policy__label">Last updated · {updated}</p>
          <h1 className="section-title policy__title">{title}</h1>
          <p className="policy__intro">{intro}</p>

          <div className="policy__sections">
            {sections.map((section) => (
              <section key={section.heading} className="policy__section">
                <h2 className="policy__heading">{section.heading}</h2>
                <p className="policy__body">{section.body}</p>
              </section>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

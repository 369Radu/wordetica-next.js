import { PageCta } from "@/components/shared/PageCta";
import { SocialLinks } from "@/components/shared/SocialLinks";
import type { SocialNetworkId } from "@/data/social-links.config";
import "./about.scss";

const founderPhotoSrc = "/assets/andreea.png?v=20260524d";

const founderSocialNetworks: SocialNetworkId[] = [
  "linkedin",
  "website",
  "researchgate",
  "academia",
];

export function About() {
  return (
    <section className="wo-section about">
      <div className="wo-container about__content">
        <header className="about__header wo-center">
          <span className="wo-tag">About</span>
          <h1>
            Linguistics, augmented - not replaced - by{" "}
            <span className="wo-gradient-text wo-pulse-ai">AI</span>.
          </h1>
          <p>
            Founded eight years ago, Wordetica is a language-driven company built on the belief that words matter. Our name reflects the values that guide our work: &quot;Word&quot; represents language, communication, and knowledge, while &quot;Etica&quot; reflects our commitment to ethics, responsibility, and a human-centered approach. Together, they express our conviction that technology should serve people and that communication should remain meaningful, inclusive, and trustworthy.
          </p>
          <p>
            As artificial intelligence and digital technologies have evolved, so has our work. Yet one principle has remained constant: responsible AI in language services starts with linguistic expertise. We design our workflows around the people who understand language best, integrating AI tools that enhance human capabilities while preserving quality, accuracy, and cultural understanding.
          </p>
          <p>
            Today, Wordetica operates at the intersection of language, education, and artificial intelligence. Through language services, educational programmes, and AI literacy initiatives, we help individuals and companies navigate a rapidly changing world while ensuring that our approach remains ethical, accessible, and human-centered.
          </p>
        </header>

        <section className="founder" aria-labelledby="founder-title">
          <div className="founder__layout">
            <div className="founder__bio">
              <h2 id="founder-title">About the founder</h2>
              <p>
                Andreea holds a PhD (Summa cum Laude) in French Applied Linguistics, with a research focus on the semantic quality of neural machine translation output and the transfer of meaning in specialised texts across language pairs. Grounded in cognitive linguistics, her work examines how human speakers form and structure meaning, how these mental representations shape translation decisions, and where they diverge from the conceptual logic encoded in Transformer-based architectures.
              </p>
              <p>
                With more than 12 years of experience teaching English, French, Romanian, and Spanish, she supports
                students, professionals, and organizations in developing clear, confident, and effective
                multilingual communication - including tailored approaches for neurodiverse profiles.
              </p>
              <p>
                As a translator and interpreter, she combines linguistic expertise with AI-informed analysis to
                enhance accuracy, naturalness, and communicative impact in both written and spoken language.
              </p>
            </div>
            <aside className="founder__profile" aria-labelledby="founder-links-title">
              <figure className="founder__photo">
                {founderPhotoSrc ? (
                  <img
                    src={founderPhotoSrc}
                    alt="Andreea - founder of Wordetica"
                    width="400"
                    height="500"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="founder__photo-slot" aria-hidden="true"></div>
                )}
              </figure>
              <div className="founder__connect">
                <p id="founder-links-title" className="founder__connect-label">Connect</p>
                <SocialLinks variant="pill" networks={founderSocialNetworks} />
                <p className="founder__connect-label">Phone</p>
                <div className="founder__phones">
                  <a className="founder__phone-pill" href="tel:+4915568432670">(+49) 155 6843 2670</a>
                  <a className="founder__phone-pill" href="tel:+40723501791">(+40) 0723 501 791</a>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>

      <PageCta />
    </section>
  );
}

import Link from "next/link";

import { PageCta } from "@/components/shared/PageCta";
import "./translation-interpreting-detail.scss";

interface ServiceSection {
  accentClass: string;
  icon: string;
  title: string;
  description: string;
  focusAreas: string[];
  toolsApproach: string[];
  outcomes: string[];
}

const SECTIONS: ServiceSection[] = [
  {
    accentClass: "section--teal",
    icon: "⇄",
    title: "Written Translation",
    description:
      "Professional translation services combining CAT tools, AI technologies, and human linguistic review to ensure accuracy, consistency, and cultural adaptation across all content types.",
    focusAreas: [
      "Accurate translation of multilingual content",
      "Proofreading and review of existing translations",
      "CAT tool integration (i.e. Trados Studio)",
      "Machine Translation Post-Editing (MTPE)",
      "Localization and cultural adaptation",
      "AI-assisted workflow optimisation",
      "Subtitling & dubbing with AI transcription and timing tools",
      "Speech-to-text transcription for audio and video",
      "AI-driven content refinement for clarity, tone, and quality",
    ],
    toolsApproach: [
      "CAT tools and AI technologies applied with human linguistic review on every deliverable",
      "Transparent workflows balancing automation with quality assurance",
      "Cultural adaptation across projects",
    ],
    outcomes: [
      "Accurate, consistent translations adapted to context and culture",
      "Refined multilingual content with clarity, tone, and quality assured by humans",
      "Efficient workflows from translation through MTPE, localization, and media delivery",
    ],
  },
  {
    accentClass: "section--mint",
    icon: "✧",
    title: "Live Interpreting",
    description:
      "Human interpreting grounded in linguistic expertise, thorough preparation, and contextual understanding - ensuring accurate and effective real-time communication in any setting.",
    focusAreas: [
      "Business meetings and professional discussions",
      "Interviews and appointments",
      "Online or in-person interactions",
      "Everyday communication requiring precise understanding",
    ],
    toolsApproach: [
      "Human interpreting led by linguistic expertise and thorough preparation",
      "Contextual understanding tailored to each setting and audience",
      "Support for online, in-person, and hybrid communication",
    ],
    outcomes: [
      "Accurate, effective real-time communication in high-stakes settings",
      "Clear understanding in meetings, interviews, and everyday interactions",
      "Confidence that nuance and intent are conveyed faithfully",
    ],
  },
];

export function TranslationInterpretingDetail() {
  const sections = SECTIONS;

  return (
    <>
      <section className="wo-section">
        <div className="wo-container">
          <Link href="/services" className="back-link" aria-label="Back to services">
            ← All services
          </Link>

          <header className="header">
            <span className="service-icon" aria-hidden="true">⇄</span>
            <h1>Translation &amp; Interpreting Services</h1>
            <p className="positioning">Written and spoken language services - accurate, context-aware, and enhanced by AI with human expertise at every step.</p>
            <div className="langs">
              <span className="wo-tag">EN</span>
              <span className="wo-tag">FR</span>
              <span className="wo-tag">RO</span>
            </div>
          </header>

          <p className="intro">
            A complete language service covering both written translation and live interpreting - combining CAT tools, AI technologies, and human linguistic expertise to ensure accuracy, cultural adaptation, and effective real-time communication.
          </p>

          <div className="sections">
            {sections.map((sec) => (
              <div
                key={sec.title}
                className={`section-card ${sec.accentClass}`}
              >
                <div className="section-card__head">
                  <div className="section-head-row">
                    <span className="section-icon" aria-hidden="true">{sec.icon}</span>
                    <h2 className="section-title">{sec.title}</h2>
                  </div>
                  <p className="section-desc">{sec.description}</p>
                </div>

                <div className="section-card__body">
                  <div className="block">
                    <h3 className="block-title">Services Offered</h3>
                    <ul className="bullet-list">
                      {sec.focusAreas.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="side-blocks">
                    <div className="block">
                      <h3 className="block-title">Tools &amp; Approach</h3>
                      <ul className="bullet-list">
                        {sec.toolsApproach.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="block">
                      <h3 className="block-title">Outcomes</h3>
                      <ul className="bullet-list">
                        {sec.outcomes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageCta />
    </>
  );
}

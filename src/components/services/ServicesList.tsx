"use client";

import { useState } from "react";
import Link from "next/link";

import { PageCta } from "@/components/shared/PageCta";
import {
  AGENTIC_AI_COMING_SOON,
  SERVICES,
  type ServiceCardAccent,
} from "@/data/services.data";
import "./services-list.scss";

function accentClass(accent: ServiceCardAccent): string {
  return `service-card--${accent}`;
}

export function ServicesList() {
  const services = SERVICES;
  const comingSoon = AGENTIC_AI_COMING_SOON;

  const [previewOpen, setPreviewOpen] = useState(false);

  const onComingSoonClick = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setPreviewOpen(true);
  };

  const onComingSoonKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      onComingSoonClick(event);
    }
  };

  const onComingSoonButtonClick = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setPreviewOpen(true);
  };

  const closePreview = () => setPreviewOpen(false);

  return (
    <>
      {previewOpen && (
        <div
          className="cogent-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="WORDETICA COgent - sneak peek"
          onClick={closePreview}
          onKeyDown={(e) => {
            if (e.key === "Escape") closePreview();
          }}
        >
          <div className="cogent-panel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="cogent-close"
              onClick={closePreview}
              aria-label="Close preview"
            >
              ×
            </button>

            <div className="cogent-header">
              <span className="cogent-header__eyebrow">Just a sneak peek</span>
              <span className="cogent-header__icon" aria-hidden="true">⬡</span>
              <h2 className="cogent-header__title">WORDETICA COgent</h2>
              <p className="cogent-header__tagline">
                What follows is still in the making - we’re working hard to make it something fantastic.
              </p>
            </div>

            <div className="cogent-features">
              <div className="cogent-feature cogent-feature--vibe">
                <div className="cogent-feature__head">
                  <span className="cogent-feature__icon" aria-hidden="true">◈</span>
                  <h3 className="cogent-feature__title">Vibe Coding</h3>
                </div>
                <div className="cogent-feature__body">
                  <p>Transform your learning goals and study material into tailored, adaptive digital tools using simple, clear natural language.</p>
                </div>
              </div>

              <div className="cogent-feature cogent-feature--agent">
                <div className="cogent-feature__head">
                  <span className="cogent-feature__icon" aria-hidden="true">⬡</span>
                  <h3 className="cogent-feature__title">Agentic AI</h3>
                </div>
                <div className="cogent-feature__body">
                  <p>Deploy autonomous agents as personal language tutors to manage complex study workflows, practice conversation, and master the literacy required to orchestrate your own intelligent learning systems.</p>
                </div>
              </div>
            </div>

            <p className="cogent-footer">
              Stay tuned - and <Link href="/contact" onClick={closePreview}>let us know you’re interested</Link>.
            </p>
          </div>
        </div>
      )}

      <section className="wo-section services-page">
        <div className="wo-container">
          <header className="header wo-center">
            <span className="wo-tag">Services</span>
            <h1>
              Where linguistics and{" "}
              <span className="wo-gradient-text wo-pulse-ai">AI</span>
              {" "}work together.
            </h1>
            <p>
              Four focused practice areas-three live today, one on the way-each grounded in human expertise and
              augmented by AI where it adds measurable value.
            </p>
          </header>

          <div className="grid">
            {services.map((svc) => (
              <article
                key={svc.slug}
                className={`service-card ${accentClass(svc.accent)}`}
              >
                <div className="service-card__top">
                  <span className="service-card__icon" aria-hidden="true">{svc.icon}</span>
                  <div className="service-card__langs">
                    {svc.languages.map((lang) => (
                      <span key={lang} className="service-card__lang">{lang}</span>
                    ))}
                  </div>
                </div>
                <h3>{svc.title}</h3>
                <p>{svc.shortDescription}</p>
                <div className="service-card__bottom">
                  {svc.motto && (
                    <p className="service-card__motto">{svc.motto}</p>
                  )}
                  <Link href={`/services/${svc.slug}`} className="wo-btn wo-btn--ghost">Learn more</Link>
                </div>
              </article>
            ))}

            <article
              className={`service-card service-card--coming-soon ${accentClass(comingSoon.accent)}`}
              tabIndex={0}
              role="button"
              aria-label="WORDETICA COgent - coming soon. Click for details."
              onClick={onComingSoonClick}
              onKeyDown={onComingSoonKeyDown}
            >
              <div className="service-card__top">
                <span className="service-card__icon service-card__icon--soon" aria-hidden="true">{comingSoon.icon}</span>
                <div className="service-card__langs">
                  {comingSoon.languages.map((lang) => (
                    <span key={lang} className="service-card__lang wo-tag--muted">{lang}</span>
                  ))}
                </div>
              </div>
              <h3>{comingSoon.title}</h3>
              <p>{comingSoon.shortDescription}</p>
              <div className="service-card__bottom">
                {comingSoon.motto && (
                  <p className="service-card__motto">{comingSoon.motto}</p>
                )}
                <button
                  type="button"
                  className="wo-btn wo-btn--soon wo-pulse-green"
                  onClick={onComingSoonButtonClick}
                >
                  <span className="soon-label soon-label--default">Coming soon</span>
                  <span className="soon-label soon-label--hover">👀 See sneak peek</span>
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <PageCta />
    </>
  );
}

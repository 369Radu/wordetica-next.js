import Link from "next/link";
import { redirect } from "next/navigation";

import { PageCta } from "@/components/shared/PageCta";
import { AGENTIC_AI_COMING_SOON, SERVICES } from "@/data/services.data";
import "./service-detail.scss";

interface ServiceDetailProps {
  slug: string;
}

export function ServiceDetail({ slug }: ServiceDetailProps) {
  if (slug === AGENTIC_AI_COMING_SOON.slug) {
    redirect("/services");
  }

  const svc = SERVICES.find((s) => s.slug === slug);

  if (!svc) {
    return (
      <section className="wo-section">
        <div className="wo-container wo-center">
          <h1>Service not found</h1>
          <p>The service you&apos;re looking for is not available.</p>
          <Link href="/services" className="wo-btn wo-btn--primary">← All services</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="wo-section">
        <div className="wo-container">
          <Link href="/services" className="back-link" aria-label="Back to services">
            ← All services
          </Link>

          <header className="header">
            <span className="service-icon" aria-hidden="true">{svc.icon}</span>
            <h1>{svc.title}</h1>
            <p className="positioning">{svc.positioning}</p>
            <div className="langs">
              {svc.languages.map((lang) => (
                <span key={lang} className="wo-tag">{lang}</span>
              ))}
            </div>
          </header>

          <article className="content">
            <section>
              <h2>Description</h2>
              <p>{svc.description}</p>
            </section>

            <section>
              <h2>Focus areas</h2>
              <ul className="bullets">
                {svc.focusAreas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2>Tools &amp; approach</h2>
              <ul className="bullets">
                {svc.toolsApproach.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2>Outcomes</h2>
              <ul className="bullets">
                {svc.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      </section>

      <PageCta />
    </>
  );
}

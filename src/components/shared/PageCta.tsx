import Link from "next/link";
import "./page-cta.scss";

interface PageCtaProps {
  /** Contact page: show only the background image, no copy or button. */
  imageOnly?: boolean;
}

export function PageCta({ imageOnly = false }: PageCtaProps) {
  return (
    <section
      className={`page-cta${imageOnly ? " page-cta--image-only" : ""}`}
      aria-labelledby={imageOnly ? undefined : "page-cta-title"}
    >
      <div className="page-cta__backdrop" aria-hidden="true"></div>
      {!imageOnly && (
        <div className="wo-container page-cta__inner">
          <span className="wo-tag wo-tag--accent">Let&apos;s talk</span>
          <h2 id="page-cta-title">Where ethics guide language, work, and AI.</h2>
          <Link href="/contact" className="wo-btn wo-btn--accent">
            Start the conversation
          </Link>
        </div>
      )}
    </section>
  );
}

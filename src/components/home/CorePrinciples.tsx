import {
  AI_PRINCIPLES,
  HUMAN_PRINCIPLES,
  SHARED_PRINCIPLES,
} from "@/data/core-principles.data";
import "./core-principles.scss";

export function CorePrinciples() {
  return (
    <section className="cp" aria-labelledby="cp-title">
      <div className="cp__inner">
        <header className="cp__head">
          <h2 id="cp-title" className="cp__title">Core Values</h2>
          <p className="cp__subtitle">Where human expertise and AI work together.</p>
        </header>

        <div className="cp__board">
          <div className="cp__nodes">
            <div className="cp__node cp__node--human" aria-label="Human">
              <span className="cp__node-ring" aria-hidden="true"></span>
              <span className="cp__node-label">HUMAN</span>
            </div>
            <p className="cp__tagline">Collaborative Language Intelligence</p>
            <div className="cp__node cp__node--ai" aria-label="AI">
              <span className="cp__node-ring cp__node-ring--ai" aria-hidden="true"></span>
              <span className="cp__node-core" aria-hidden="true"></span>
              <span className="cp__node-label">AI</span>
            </div>
          </div>

          <div className="cp__columns">
            <div className="cp__col cp__col--human">
              <ul className="cp__cards">
                {HUMAN_PRINCIPLES.map((card) => (
                  <li key={card.id}>
                    <article className="cp__card cp__card--human">
                      <strong className="cp__card-title">{card.title}</strong>
                      <span className="cp__card-text">{card.text}</span>
                    </article>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cp__col cp__col--center">
              <ul className="cp__cards">
                {SHARED_PRINCIPLES.map((card) => (
                  <li key={card.id}>
                    <article className="cp__card cp__card--shared">
                      <strong className="cp__card-title">{card.title}</strong>
                      <span className="cp__card-text">{card.text}</span>
                    </article>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cp__col cp__col--ai">
              <ul className="cp__cards">
                {AI_PRINCIPLES.map((card) => (
                  <li key={card.id}>
                    <article className="cp__card cp__card--ai">
                      <strong className="cp__card-title">{card.title}</strong>
                      <span className="cp__card-text">{card.text}</span>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

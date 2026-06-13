import Link from "next/link";
import {
  LEGAL_ADDRESS,
  LEGAL_CAEN,
  LEGAL_CONTACT_EMAIL,
  LEGAL_EFFECTIVE_DATE,
  LEGAL_ESTABLISHED,
  LEGAL_FISCAL_CODE,
  LEGAL_LAST_UPDATED,
  LEGAL_OWNER,
  LEGAL_REG_NUMBER,
  LEGAL_RESEARCH_TOPICS,
  LEGAL_SERVICE_LINES,
  LEGAL_VAT_NUMBER,
} from "@/lib/legal.constants";

export function TermsOfService() {
  const effectiveDate = LEGAL_EFFECTIVE_DATE;
  const lastUpdated = LEGAL_LAST_UPDATED;
  const contactEmail = LEGAL_CONTACT_EMAIL;
  const serviceLines = LEGAL_SERVICE_LINES;
  const researchTopics = LEGAL_RESEARCH_TOPICS;
  const owner = LEGAL_OWNER;
  const fiscalCode = LEGAL_FISCAL_CODE;
  const vatNumber = LEGAL_VAT_NUMBER;
  const regNumber = LEGAL_REG_NUMBER;
  const established = LEGAL_ESTABLISHED;
  const address = LEGAL_ADDRESS;
  const caen = LEGAL_CAEN;

  return (
    <section className="wo-section legal">
      <div className="wo-container legal__content">
        <header className="legal__header wo-center">
          <span className="wo-tag">Legal</span>
          <h1>Terms of Service</h1>
          <p className="legal__meta">
            Effective {effectiveDate} · Last updated {lastUpdated}
          </p>
          <p className="legal__lead">
            These Terms govern your use of the Wordetica website and the information we publish about our
            language-driven services - where linguistic expertise and responsible AI work together in
            training, translation, interpreting, and coaching. By using the site, you agree to these Terms
            and to our <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <nav className="legal__toc" aria-label="Related legal documents">
            <Link href="/privacy">Privacy Policy</Link>
          </nav>
        </header>

        <article className="legal__body">
          <section className="legal__section" aria-labelledby="tos-company">
            <h2 id="tos-company">1. Company information</h2>
            <p>The service provider and operator of this website is:</p>
            <ul>
              <li><strong>Business name:</strong> {owner} - operating as Wordetica</li>
              <li><strong>Fiscal ID (CIF):</strong> {fiscalCode}</li>
              <li><strong>VAT number:</strong> {vatNumber}</li>
              <li><strong>Trade Register number:</strong> {regNumber}</li>
              <li><strong>Date of establishment:</strong> {established}</li>
              <li><strong>CAEN activity code:</strong> {caen}</li>
              <li><strong>Registered address:</strong> {address}</li>
              <li><strong>Contact:</strong> <a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
            </ul>
          </section>

          <section className="legal__section" aria-labelledby="tos-acceptance">
            <h2 id="tos-acceptance">2. Acceptance</h2>
            <p>
              If you do not agree to these Terms, do not use the website. We may restrict access where
              necessary for security or legal compliance.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-eligibility">
            <h2 id="tos-eligibility">3. Who may use the site</h2>
            <p>
              The site is intended for adults and professional users - clients, institutions, researchers,
              and language professionals. You must have legal capacity to agree to these Terms. Admin tools
              are for authorised Wordetica staff only.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-services">
            <h2 id="tos-services">4. What Wordetica offers</h2>
            <p>
              This website presents Wordetica&apos;s professional language services and research. Our current
              service lines include:
            </p>
            <ul>
              {serviceLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p>
              We also publish <strong>Research</strong> on {researchTopics}. Website content is
              informational; it does not by itself create a binding order or client relationship.
            </p>
            <p>
              <strong>Commissioned work</strong> (translation assignments, interpreting bookings, training
              programmes, coaching packages) is governed by a separate quote, proposal, or contract that
              defines scope, fees, languages, deadlines, confidentiality, and deliverables. If those
              documents conflict with these Terms, the project agreement prevails.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-human-ai">
            <h2 id="tos-human-ai">5. Human expertise and AI</h2>
            <p>
              Wordetica&apos;s model is <strong>linguistics first, AI-assisted where appropriate</strong>.
              Machine translation, LLMs, CAT tools, Vibe Coding environments, and other AI technologies
              may support our workflows, but professional deliverables rely on human judgment, review, and
              accountability unless we expressly agree otherwise in writing (e.g. raw MT for internal
              gisting).
            </p>
            <p>
              You must not use our research articles or site content to imply that Wordetica endorses a
              particular software vendor or that automated output alone equals certified translation or
              official interpreting.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-ai-training">
            <h2 id="tos-ai-training">6. AI training and educational programmes</h2>
            <p>
              Our Human-Centered AI Literacy Training Series provides structured, level-based education in AI
              literacy, critical thinking, and ethical awareness - from primary education through to
              language technology specialisation. Each level is delivered online and results in a
              certificate of completion.
            </p>
            <p>
              Educational content reflects our analysis and professional practice at the time of
              publication. It is for <strong>general professional development</strong> in AI, language,
              and technology - not legal, medical, or regulated advice.
            </p>
            <p>
              You may quote short excerpts with attribution and a link to the original. Republication of
              full course materials or commercial reuse requires our prior written permission.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-translation">
            <h2 id="tos-translation">7. Translation, interpreting, and client materials</h2>
            <p>
              You represent that you have the right to provide source texts, recordings, or terminology
              for processing. You must not ask us to translate or adapt unlawful, infringing, or harmful
              content.
            </p>
            <p>
              Unless agreed otherwise, you retain ownership of your materials; we grant you rights to
              deliverables as set out in your project contract. We handle confidential materials according
              to our <Link href="/privacy">Privacy Policy</Link> and project terms.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-research">
            <h2 id="tos-research">8. Research and articles</h2>
            <p>
              Articles on the site reflect our analysis and practice at the time of publication. They are
              for <strong>general information and professional development</strong> in language, education,
              and technology - not legal, medical, or regulated advice. You may quote short excerpts with
              attribution; full republication requires our written permission.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-accounts">
            <h2 id="tos-accounts">9. Admin accounts</h2>
            <p>
              Staff credentials must be kept confidential. You are responsible for activity under your
              account. We may suspend access for security incidents or policy breaches.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-conduct">
            <h2 id="tos-conduct">10. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the site unlawfully or to misrepresent Wordetica&apos;s services or qualifications;</li>
              <li>Attempt unauthorised access to admin areas, APIs, or infrastructure;</li>
              <li>Scrape or bulk-harvest research or service content without permission;</li>
              <li>Upload malware or interfere with site operation;</li>
              <li>Use contact channels to send spam or unrelated solicitations.</li>
            </ul>
          </section>

          <section className="legal__section" aria-labelledby="tos-ip">
            <h2 id="tos-ip">11. Intellectual property</h2>
            <p>
              Site design, branding, service descriptions, training materials, and research articles are
              owned by or licensed to Wordetica and protected by applicable IP laws. Limited sharing with
              attribution is permitted; other use requires written consent.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-user-content">
            <h2 id="tos-user-content">12. Your submissions</h2>
            <p>
              Enquiries must be accurate and within your rights to share. Do not send full confidential
              manuscripts or sensitive personal data through the public contact form unless we have invited
              you to do so. Email or agreed secure channels are preferred for project material.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-privacy">
            <h2 id="tos-privacy">13. Privacy</h2>
            <p>
              Processing of personal data is described in our
              {" "}<Link href="/privacy">Privacy Policy</Link>, including handling of language materials and
              international work across our locations.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-third-party">
            <h2 id="tos-third-party">14. Third-party links</h2>
            <p>
              Links to CAT tools, professional networks, or reference sites are for convenience. We are
              not responsible for third-party terms or privacy practices.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-disclaimer">
            <h2 id="tos-disclaimer">15. Disclaimers</h2>
            <p>
              THE WEBSITE AND RESEARCH CONTENT ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. AI-ASSISTED OUTPUT
              AND AUTOMATED DRAFTS - WHETHER ON THE SITE OR IN CLIENT WORK - MAY CONTAIN ERRORS; HUMAN
              REVIEW IS ESSENTIAL FOR PROFESSIONAL USE.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-liability">
            <h2 id="tos-liability">16. Limitation of liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WORDETICA IS NOT LIABLE FOR INDIRECT OR
              CONSEQUENTIAL DAMAGES ARISING FROM USE OF THE WEBSITE ALONE. LIABILITY FOR COMMISSIONED
              SERVICES IS LIMITED AS SET OUT IN YOUR PROJECT CONTRACT; FOR WEBSITE-ONLY CLAIMS, OUR
              AGGREGATE LIABILITY IS LIMITED TO EUR 100 OR AMOUNTS PAID TO US IN THE PRIOR 12 MONTHS,
              WHICHEVER IS GREATER, EXCEPT WHERE LAW FORBIDS LIMITATION.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-indemnity">
            <h2 id="tos-indemnity">17. Indemnity</h2>
            <p>
              You indemnify Wordetica against claims arising from your misuse of the site, unlawful
              materials you supply, or violation of these Terms, except where caused by our gross
              negligence or wilful misconduct.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-law">
            <h2 id="tos-law">18. Governing law</h2>
            <p>
              These Terms are governed by Romanian law. Courts in Romania have jurisdiction unless
              mandatory consumer rules in your country require otherwise. We encourage you to contact us
              first at <a href={`mailto:${contactEmail}`}>{contactEmail}</a> to resolve disputes
              informally.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-changes">
            <h2 id="tos-changes">19. Changes</h2>
            <p>
              We may update these Terms when our services or legal context changes. The &quot;Last updated&quot;
              date will change accordingly. Continued use constitutes acceptance.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="tos-contact">
            <h2 id="tos-contact">20. Contact</h2>
            <p>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a> ·{" "}
              <Link href="/contact">Contact form</Link> ·{" "}
              <Link href="/services">Services</Link> ·{" "}
              <Link href="/articles">Research</Link> ·{" "}
              <Link href="/privacy">Privacy Policy</Link>
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}

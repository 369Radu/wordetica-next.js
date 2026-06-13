import Link from "next/link";
import {
  LEGAL_ADDRESS,
  LEGAL_CAEN,
  LEGAL_CONTACT_EMAIL,
  LEGAL_EFFECTIVE_DATE,
  LEGAL_FISCAL_CODE,
  LEGAL_LAST_UPDATED,
  LEGAL_OWNER,
  LEGAL_REG_NUMBER,
  LEGAL_RESEARCH_TOPICS,
  LEGAL_SERVICE_LINES,
  LEGAL_VAT_NUMBER,
} from "@/lib/legal.constants";
import "./privacy-policy.scss";

export function PrivacyPolicy() {
  const effectiveDate = LEGAL_EFFECTIVE_DATE;
  const lastUpdated = LEGAL_LAST_UPDATED;
  const contactEmail = LEGAL_CONTACT_EMAIL;
  const serviceLines = LEGAL_SERVICE_LINES;
  const researchTopics = LEGAL_RESEARCH_TOPICS;
  const owner = LEGAL_OWNER;
  const fiscalCode = LEGAL_FISCAL_CODE;
  const vatNumber = LEGAL_VAT_NUMBER;
  const regNumber = LEGAL_REG_NUMBER;
  const address = LEGAL_ADDRESS;
  const caen = LEGAL_CAEN;

  return (
    <section className="wo-section legal">
      <div className="wo-container legal__content">
        <header className="legal__header wo-center">
          <span className="wo-tag">Legal</span>
          <h1>Privacy Policy</h1>
          <p className="legal__meta">
            Effective {effectiveDate} · Last updated {lastUpdated}
          </p>
          <p className="legal__lead">
            Wordetica is a language-driven practice combining linguistic expertise with responsible AI in
            translation, interpreting, AI training, and language coaching. This Privacy Policy explains
            how we handle personal information when you browse our website, read our research on
            {" "}{researchTopics}, request information about our services, or work with us under contract.
            We process data in line with applicable law, including the GDPR where it applies.
          </p>
          <nav className="legal__toc" aria-label="Privacy policy sections">
            <Link href="/terms">Terms of Service</Link>
            {" "}
            <Link href="/cookies">Cookie Policy</Link>
          </nav>
        </header>

        <article className="legal__body">
          <section className="legal__section" aria-labelledby="pp-intro">
            <h2 id="pp-intro">1. Introduction</h2>
            <p>
              By using our website, you acknowledge this Privacy Policy. If you disagree with our
              practices, please do not submit personal information or contact us until we have addressed
              your concerns.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="pp-activities">
            <h2 id="pp-activities">2. Our activities and why we process data</h2>
            <p>Through this website we:</p>
            <ul>
              {serviceLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li>
                Publish <strong>Research</strong> articles and reflections on {researchTopics};
              </li>
              <li>
                Respond to enquiries from individuals, teams, universities, NGOs, and businesses
                interested in our language and AI-related services (typically in EN, FR, DE, ES, or RO).
              </li>
            </ul>
            <p>
              We only collect personal information that is relevant to these purposes - for example to
              reply to a project enquiry, deliver a commissioned service, secure our systems, or improve
              how we present our work online.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="pp-controller">
            <h2 id="pp-controller">3. Data controller</h2>
            <p>
              The data controller for this website is Wordetica, operated by {owner}.
            </p>
            <ul>
              <li><strong>Fiscal ID (CIF):</strong> {fiscalCode}</li>
              <li><strong>VAT number:</strong> {vatNumber}</li>
              <li><strong>Trade Register:</strong> {regNumber}</li>
              <li><strong>CAEN activity code:</strong> {caen}</li>
              <li><strong>Registered address:</strong> {address}</li>
              <li><strong>Privacy requests:</strong> <a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
            </ul>
          </section>

          <section className="legal__section" aria-labelledby="pp-collect">
            <h2 id="pp-collect">4. Information we collect</h2>

            <h3>4.1 Website visitors and readers</h3>
            <p>When you browse the public site or read research articles, we may process:</p>
            <ul>
              <li>Technical data (IP address, browser, device, pages viewed, access times);</li>
              <li>
                Aggregated or internal analytics on article reach (admin-facing only, not sold to
                advertisers).
              </li>
            </ul>
            <p>Reading research does not require an account.</p>

            <h3>4.2 Enquiries and prospective clients</h3>
            <p>If you contact us, we may receive:</p>
            <ul>
              <li>Name, email, organisation, and message content;</li>
              <li>
                Information you choose to share about your project - such as language pairs, deadlines,
                type of service (translation, interpreting, AI training, coaching), or learning goals;
              </li>
              <li>
                Attachments or sample texts only if you send them by email or as agreed in a proposal.
              </li>
            </ul>
            <p>
              The on-site contact form shows a confirmation in your browser; we recommend emailing us
              directly at <a href={`mailto:${contactEmail}`}>{contactEmail}</a> for project details.
            </p>

            <h3>4.3 Clients and learners under contract</h3>
            <p>For active engagements we may additionally process:</p>
            <ul>
              <li>Billing and scheduling details agreed in your quote or contract;</li>
              <li>
                <strong>Source materials</strong> you provide for translation, interpreting, coaching, or
                training (documents, slides, recordings, terminology lists) - handled confidentially for
                the project;
              </li>
              <li>
                For AI training participants: level, learning goals, completion status, and certificate
                records;
              </li>
              <li>Feedback, deliverables, and correspondence related to quality and delivery.</li>
            </ul>

            <h3>4.4 Authorised staff (admin area)</h3>
            <p>
              Administrators who sign in may have account email, authentication tokens (stored in browser
              local storage), and content they create (articles, drafts, internal notes).
            </p>

            <h3>4.5 AI-assisted internal workflows</h3>
            <p>
              Staff may use in-dashboard tools that send topics or draft text to our AI service for
              article preparation. We instruct users not to put unnecessary personal or client-confidential
              data into prompts. Client work product is processed under project agreements, not via the
              public website.
            </p>
            <p>
              We do not intentionally collect special-category data (health, biometric ID, etc.) through
              the public site. Please do not submit such data unless we have agreed in writing.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="pp-use">
            <h2 id="pp-use">5. How we use your information</h2>
            <ul>
              <li>
                Respond to enquiries about AI training, translation, interpreting, or language coaching;
              </li>
              <li>Prepare proposals, deliver services, and manage ongoing client relationships;</li>
              <li>Issue and record certificates of completion for training programmes;</li>
              <li>Publish and maintain research and service information on the website;</li>
              <li>
                Operate CAT, AI-assisted, and Vibe Coding workflows with human review where applicable;
              </li>
              <li>Secure admin access, prevent abuse, and meet legal or professional obligations;</li>
              <li>Improve our website, content, and service quality.</li>
            </ul>
          </section>

          <section className="legal__section" aria-labelledby="pp-legal-basis">
            <h2 id="pp-legal-basis">6. Legal basis (EEA/UK)</h2>
            <ul>
              <li>
                <strong>Contract</strong> - delivering or negotiating language services you request;
              </li>
              <li>
                <strong>Legitimate interests</strong> - running our website, publishing research, and
                communicating with professionals in our field;
              </li>
              <li>
                <strong>Consent</strong> - where required (e.g. optional marketing, if we offer it in
                future);
              </li>
              <li>
                <strong>Legal obligation</strong> - tax, record-keeping, or regulatory requirements
                applicable in Romania and the EU.
              </li>
            </ul>
          </section>

          <section className="legal__section" aria-labelledby="pp-sharing">
            <h2 id="pp-sharing">7. Sharing and processors</h2>
            <p>We do not sell personal data. We may share information with:</p>
            <ul>
              <li>Hosting and IT providers that run this website and our internal tools;</li>
              <li>
                Trusted linguists or partners involved in your project, under confidentiality obligations;
              </li>
              <li>
                AI or language-technology providers when needed to perform AI-assisted steps you have
                agreed to (always subject to human oversight in our delivery model);
              </li>
              <li>Advisers or authorities when required by law.</li>
            </ul>
          </section>

          <section className="legal__section" aria-labelledby="pp-confidentiality">
            <h2 id="pp-confidentiality">8. Confidentiality of language materials</h2>
            <p>
              Texts, recordings, and terminology you share for translation, interpreting preparation, or
              coaching are used only to perform the agreed service. We treat client materials as
              confidential unless you authorise wider use (e.g. anonymised training examples). Retention
              after project completion follows our contract with you or reasonable professional practice.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="pp-transfers">
            <h2 id="pp-transfers">9. International transfers</h2>
            <p>
              We work across the EU and with international clients. Data may be processed in Romania,
              Germany, Luxembourg, or other locations where our providers operate. Where GDPR requires it,
              we use appropriate safeguards for transfers outside the EEA/UK.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="pp-retention">
            <h2 id="pp-retention">10. Retention</h2>
            <ul>
              <li>Enquiries - typically up to 24 months unless a client relationship continues;</li>
              <li>
                Project files and correspondence - as agreed in your contract or as needed for quality and
                legal purposes;
              </li>
              <li>
                Training records and certificates - retained for the duration required by applicable
                education regulations or as agreed with the learner;
              </li>
              <li>Published articles - while they remain on the site or for archival integrity;</li>
              <li>
                Server logs - limited rolling periods unless needed for security investigations.
              </li>
            </ul>
          </section>

          <section className="legal__section" aria-labelledby="pp-rights">
            <h2 id="pp-rights">11. Your rights</h2>
            <p>
              You may have rights to access, rectify, erase, restrict processing, object, portability,
              and to complain to your supervisory authority. Contact
              {" "}<a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We may verify your identity
              before responding.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="pp-cookies">
            <h2 id="pp-cookies">12. Cookies and local storage</h2>
            <p>
              The public site does not use advertising or social tracking cookies. Essential cookies may
              apply for security or hosting. Admin sign-in stores authentication tokens in local storage
              until you sign out or clear site data. For full details, see our
              {" "}<Link href="/cookies">Cookie Policy</Link>.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="pp-security">
            <h2 id="pp-security">13. Security</h2>
            <p>
              We use measures appropriate to language-service workflows - HTTPS, access controls,
              password hashing, and restricted handling of client files. No online transmission is
              completely risk-free.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="pp-children">
            <h2 id="pp-children">14. Children</h2>
            <p>
              Our website and most services are aimed at adults and professional learners. The
              Human-Centered AI Literacy Training Series includes levels designed for learners from age 8 upward;
              enrolment of minors requires parental or guardian consent under a separate agreement.
              We do not knowingly collect data from children under 16 through the public contact form.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="pp-changes">
            <h2 id="pp-changes">15. Changes</h2>
            <p>
              We may update this policy when our services or legal requirements change. The &quot;Last updated&quot;
              date will reflect revisions. Continued use after an update means you accept the revised
              policy.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="pp-contact">
            <h2 id="pp-contact">16. Contact</h2>
            <p>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a> ·{" "}
              <Link href="/contact">Contact form</Link> ·{" "}
              <Link href="/services">Services</Link> ·{" "}
              <Link href="/terms">Terms of Service</Link>
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}

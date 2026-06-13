import Link from "next/link";
import {
  LEGAL_ADDRESS,
  LEGAL_CAEN,
  LEGAL_CONTACT_EMAIL,
  LEGAL_FISCAL_CODE,
  LEGAL_LAST_UPDATED,
  LEGAL_OWNER,
  LEGAL_REG_NUMBER,
  LEGAL_VAT_NUMBER,
} from "@/lib/legal.constants";

export function CookiePolicy() {
  const lastUpdated = LEGAL_LAST_UPDATED;
  const contactEmail = LEGAL_CONTACT_EMAIL;
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
          <h1>Cookie Policy</h1>
          <p className="legal__meta">Last updated {lastUpdated}</p>
          <p className="legal__lead">
            This Cookie Policy explains how Wordetica uses cookies and similar technologies on
            this website. We keep our use of cookies to a minimum: no advertising networks, no
            cross-site tracking, no selling of browsing data. This policy should be read alongside
            our <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <nav className="legal__toc" aria-label="Cookie policy sections">
            <Link href="/privacy">Privacy Policy</Link>
            {" "}
            <Link href="/terms">Terms of Service</Link>
          </nav>
        </header>

        <article className="legal__body">
          <section className="legal__section" aria-labelledby="cp-what">
            <h2 id="cp-what">1. What are cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They
              allow the site to remember your actions or preferences over time. Similar technologies
              include local storage and session storage — small data stores kept in your browser.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="cp-how">
            <h2 id="cp-how">2. How we use cookies</h2>
            <p>
              Wordetica uses only the categories of cookies described below. We do not use
              advertising, affiliate, or social media tracking cookies.
            </p>

            <h3>2.1 Strictly necessary cookies</h3>
            <p>
              These cookies are required for the website to function. They cannot be switched off
              in our systems. They are usually set in response to actions you take, such as setting
              your privacy preferences or signing in to the admin area.
            </p>
            <table className="legal__table" aria-label="Strictly necessary cookies">
              <thead>
                <tr>
                  <th>Name / technology</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Session storage (auth token)</td>
                  <td>
                    Keeps admin staff signed in to the dashboard during a browser session. Stored
                    in browser local storage; cleared when you sign out or clear site data.
                  </td>
                  <td>Session / until sign-out</td>
                </tr>
                <tr>
                  <td>Hosting / CDN security cookies</td>
                  <td>
                    Set automatically by our hosting provider to protect the site against bots and
                    abuse (e.g. rate-limiting, DDoS protection).
                  </td>
                  <td>Up to 1 year</td>
                </tr>
              </tbody>
            </table>

            <h3>2.2 Functional cookies</h3>
            <p>
              These cookies enable enhanced functionality. The public website currently sets no
              functional cookies. If we add features such as language preference or theme toggles
              in the future, this section will be updated.
            </p>

            <h3>2.3 Analytics cookies</h3>
            <p>
              We use aggregated, internal analytics to understand how visitors engage with our
              content — for example, which research articles are read most. Any analytics
              processing is admin-facing only; data is not shared with advertising platforms and is
              not used to build personal profiles.
            </p>
            <p>
              If we add a third-party analytics tool (e.g. a self-hosted or privacy-first
              solution), we will update this policy and, where required by law, seek your consent
              before setting analytics cookies.
            </p>

            <h3>2.4 What we do not use</h3>
            <ul>
              <li>Advertising or retargeting cookies;</li>
              <li>Social media tracking pixels (Facebook, LinkedIn, Google Ads, etc.);</li>
              <li>Fingerprinting or cross-site tracking technologies;</li>
              <li>Third-party analytics that share your data with ad networks.</li>
            </ul>
          </section>

          <section className="legal__section" aria-labelledby="cp-third-party">
            <h2 id="cp-third-party">3. Third-party cookies</h2>
            <p>
              Our website may embed content or rely on infrastructure from third-party providers.
              These providers may set their own cookies in accordance with their own policies.
              Current third-party dependencies relevant to cookies include:
            </p>
            <ul>
              <li>
                <strong>Hosting / CDN provider</strong> — may set security or performance cookies
                (see section 2.1 above);
              </li>
              <li>
                <strong>Fonts and static assets</strong> — served from our own infrastructure
                where possible to avoid third-party requests.
              </li>
            </ul>
            <p>
              We do not embed third-party social media widgets, advertising scripts, or tracking
              pixels on public pages.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="cp-manage">
            <h2 id="cp-manage">4. Managing your cookie preferences</h2>
            <p>
              Because we only use strictly necessary cookies on the public site, a cookie consent
              banner is not currently displayed. You remain in control of your browser storage at
              all times.
            </p>

            <h3>4.1 Browser settings</h3>
            <p>
              You can configure your browser to block or delete cookies at any time. Instructions
              for common browsers:
            </p>
            <ul>
              <li>
                <strong>Chrome</strong> — Settings → Privacy and security → Cookies and other site
                data;
              </li>
              <li>
                <strong>Firefox</strong> — Settings → Privacy &amp; Security → Cookies and Site
                Data;
              </li>
              <li>
                <strong>Safari</strong> — Preferences → Privacy → Manage Website Data;
              </li>
              <li>
                <strong>Edge</strong> — Settings → Cookies and site permissions → Cookies and site
                data.
              </li>
            </ul>
            <p>
              Blocking strictly necessary cookies may affect the functionality of the admin area
              but will not affect your ability to browse the public website.
            </p>

            <h3>4.2 Clearing local storage</h3>
            <p>
              Admin authentication tokens are stored in browser local storage, not in cookies.
              You can clear these at any time by signing out via the footer link, or through your
              browser&apos;s Developer Tools → Application → Local Storage → wordetica.eu.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="cp-legal-basis">
            <h2 id="cp-legal-basis">5. Legal basis</h2>
            <p>
              Strictly necessary cookies and local storage are used on the basis of our{" "}
              <strong>legitimate interest</strong> in operating a secure and functional website,
              and — for the admin area — on the basis of <strong>contract</strong> (enabling
              authorised staff to perform their role). Where any non-essential cookies are
              introduced in the future, we will rely on your <strong>consent</strong> and update
              this policy accordingly.
            </p>
            <p>
              We process cookie-related data in line with the GDPR and, where applicable,
              the Romanian implementation thereof (Law no. 506/2004 and Government Decision
              no. 1308/2002).
            </p>
          </section>

          <section className="legal__section" aria-labelledby="cp-controller">
            <h2 id="cp-controller">6. Data controller</h2>
            <p>
              The data controller for this website is Wordetica, operated by {owner}.
            </p>
            <ul>
              <li><strong>Fiscal ID (CIF):</strong> {fiscalCode}</li>
              <li><strong>VAT number:</strong> {vatNumber}</li>
              <li><strong>Trade Register:</strong> {regNumber}</li>
              <li><strong>CAEN activity code:</strong> {caen}</li>
              <li><strong>Registered address:</strong> {address}</li>
              <li>
                <strong>Contact:</strong>
                {" "}<a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </li>
            </ul>
          </section>

          <section className="legal__section" aria-labelledby="cp-changes">
            <h2 id="cp-changes">7. Changes to this policy</h2>
            <p>
              We may update this Cookie Policy when we add new features, change providers, or when
              legal requirements change. The &quot;Last updated&quot; date at the top reflects the most
              recent revision. We encourage you to review this page periodically.
            </p>
          </section>

          <section className="legal__section" aria-labelledby="cp-contact">
            <h2 id="cp-contact">8. Contact</h2>
            <p>
              For questions about our use of cookies or to exercise your data rights, please
              contact us:
            </p>
            <p>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a> ·{" "}
              <Link href="/privacy">Privacy Policy</Link> ·{" "}
              <Link href="/terms">Terms of Service</Link>
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}

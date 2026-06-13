"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SocialLinks } from "@/components/shared/SocialLinks";
import type { SocialLink } from "@/data/social-links.config";
import "./footer.scss";

const FOOTER_LINKS: SocialLink[] = [
  { id: "facebook", label: "Facebook", url: "https://www.facebook.com/share/18w1j3gDWD/" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/wordetica/" },
];

export function Footer() {
  const auth = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="wo-container footer__inner">
        <section className="footer__brand">
          <Link
            href="/"
            className="footer__brand-link footer__brand-name"
            aria-label="Wordetica home"
          >
            Wordetica
          </Link>
          <p className="footer__tagline">
            Language-driven services, enhanced by AI and guided by linguistic expertise.
          </p>
          <div className="footer__contact-row" aria-label="Contact and sign in">
            <a className="footer__email" href="mailto:office@wordetica.eu">
              office@wordetica.eu
            </a>
            <div className="footer__auth">
              {auth.isAuthenticated ? (
                <div className="footer__auth-inner">
                  <Link
                    href="/admin"
                    className="footer__sign-in footer__sign-in--primary"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    className="footer__sign-in footer__sign-in--ghost"
                    onClick={() => auth.logout()}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="footer__sign-in footer__sign-in--primary"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="footer__column" aria-labelledby="footer-quicklinks">
          <h5 id="footer-quicklinks" className="footer__heading">
            Explore
          </h5>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/articles">Research</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </section>

        <section className="footer__column footer__column--social" aria-labelledby="footer-social">
          <h5 id="footer-social" className="footer__heading">
            Connect
          </h5>
          <SocialLinks links={FOOTER_LINKS} />
        </section>

        <section className="footer__column" aria-labelledby="footer-legal">
          <h5 id="footer-legal" className="footer__heading">
            Legal
          </h5>
          <ul>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/cookies">Cookie Policy</Link></li>
          </ul>
        </section>
      </div>

      <div className="footer__bottom wo-container">
        <span className="footer__copyright">
          &copy; {year} Wordetica. All rights reserved.
        </span>
        <span className="footer__made-by">
          Site created &amp; maintained by{" "}
          <a href="https://radudenie.me" target="_blank" rel="noopener noreferrer">
            Odus369
          </a>
        </span>
      </div>
    </footer>
  );
}

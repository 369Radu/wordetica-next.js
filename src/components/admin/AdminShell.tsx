"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import "./admin-shell.scss";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname() ?? "";
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  const isExact = (path: string) => pathname === path;
  const isPrefix = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="admin">
      <header className={`admin__header${menuOpen ? " admin__header--menu-open" : ""}`}>
        <div className="admin__header-inner">
          <Link href="/" className="admin__header-btn admin__back-site" onClick={closeMenu}>
            <svg
              className="admin__back-site-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to website
          </Link>

          <button
            type="button"
            className="admin__burger"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className="admin__nav" aria-label="Admin navigation">
            <Link
              href="/admin"
              className={isExact("/admin") ? "is-active" : undefined}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/articles"
              className={isExact("/admin/articles") ? "is-active" : undefined}
              onClick={closeMenu}
            >
              Articles
            </Link>
            <Link
              href="/admin/articles/scheduled"
              className={isPrefix("/admin/articles/scheduled") ? "is-active" : undefined}
              onClick={closeMenu}
            >
              Scheduled
            </Link>
            <Link
              href="/admin/articles/drafts"
              className={isPrefix("/admin/articles/drafts") ? "is-active" : undefined}
              onClick={closeMenu}
            >
              Drafts
            </Link>
            <Link
              href="/admin/ideas"
              className={isPrefix("/admin/ideas") ? "is-active" : undefined}
              onClick={closeMenu}
            >
              Ideas
            </Link>
          </nav>

          <div className="admin__actions">
            {user && (
              <div className="admin__user">
                <strong>
                  {user.first_name} {user.last_name}
                </strong>
                <span>{user.email}</span>
              </div>
            )}
            <button
              type="button"
              className="admin__header-btn admin__signout"
              onClick={() => logout()}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="admin__main" tabIndex={-1}>
        {children}
      </main>

      <ScrollToTop />
    </div>
  );
}

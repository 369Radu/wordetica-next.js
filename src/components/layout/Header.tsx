"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./header.scss";

interface NavItem {
  label: string;
  path: string;
}

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Research", path: "/articles" },
  { label: "Contact", path: "/contact" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) =>
    path === "/"
      ? pathname === "/"
      : pathname === path || pathname?.startsWith(`${path}/`);

  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);
  const onNavIntent = (path: string) => router.prefetch(path);

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="header__inner">
        <Link href="/" className="brand" aria-label="Wordetica home">
          <img
            src="/assets/logo3.png?v=20260530a"
            alt="Wordetica"
            className="brand__logo"
          />
        </Link>

        <nav className={`nav${menuOpen ? " nav--open" : ""}`} aria-label="Primary">
          <ul className="nav__list" role="menubar">
            {NAV_ITEMS.map((item) => (
              <li key={item.path} role="none">
                <Link
                  role="menuitem"
                  href={item.path}
                  className={isActive(item.path) ? "is-active" : undefined}
                  onMouseEnter={() => onNavIntent(item.path)}
                  onFocus={() => onNavIntent(item.path)}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="burger"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

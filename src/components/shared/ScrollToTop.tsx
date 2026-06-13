"use client";

import { useEffect, useState } from "react";
import "./scroll-to-top.scss";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let last = 0;
    const updateVisibility = () => {
      const main = document.getElementById("main");
      const windowY = window.scrollY || document.documentElement.scrollTop;
      const mainY = main?.scrollTop ?? 0;
      setVisible(Math.max(windowY, mainY) > 280);
    };

    const onScroll = () => {
      const now = Date.now();
      if (now - last < 120) return;
      last = now;
      updateVisibility();
    };

    document.addEventListener("scroll", onScroll, { capture: true });
    updateVisibility();
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  const scrollToTop = () => {
    const main = document.getElementById("main");
    window.scrollTo({ top: 0, behavior: "smooth" });
    main?.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`scroll-top${visible ? " scroll-top--visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 5.5 6 11.5l1.4 1.4 3.6-3.6V18h2V9.3l3.6 3.6 1.4-1.4L12 5.5z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}

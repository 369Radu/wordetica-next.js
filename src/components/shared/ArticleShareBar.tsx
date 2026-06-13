"use client";

import { useEffect, useRef, useState } from "react";
import { SocialIcon } from "./SocialIcon";
import "./article-share-bar.scss";

interface ArticleShareBarProps {
  url: string;
  title?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export function ArticleShareBar({
  url,
  title = "Wordetica",
  showLabel = true,
  compact = false,
}: ArticleShareBarProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const copyFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyFeedbackTimer.current) clearTimeout(copyFeedbackTimer.current);
    };
  }, []);

  const showLinkCopied = () => {
    setLinkCopied(true);
    if (copyFeedbackTimer.current) clearTimeout(copyFeedbackTimer.current);
    copyFeedbackTimer.current = setTimeout(() => setLinkCopied(false), 2500);
  };

  const copyLinkFallback = () => {
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      if (document.execCommand("copy")) {
        showLinkCopied();
      }
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const copyLink = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!url) return;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(
        () => showLinkCopied(),
        () => copyLinkFallback(),
      );
      return;
    }
    copyLinkFallback();
  };

  const linkedInShareUrl = () => "https://www.linkedin.com/company/wordetica/";

  const facebookShareUrl = () => "https://www.facebook.com/share/18w1j3gDWD/";

  const onShareClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  if (!url) return null;

  return (
    <div
      className={`share-bar${compact ? " share-bar--compact" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      {showLabel && (
        <span className="share-bar__label" id="share-bar-label">
          Share
        </span>
      )}
      <div
        className="share-bar__actions"
        aria-labelledby={showLabel ? "share-bar-label" : undefined}
        role="group"
        aria-label={showLabel ? undefined : "Share article"}
      >
        <button
          type="button"
          className="share-btn"
          onClick={copyLink}
          aria-label="Copy article link"
        >
          <SocialIcon icon="link" />
        </button>
        <a
          className="share-btn"
          href={linkedInShareUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          onClick={onShareClick}
        >
          <SocialIcon icon="linkedin" />
        </a>
        <a
          className="share-btn"
          href={facebookShareUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          onClick={onShareClick}
        >
          <SocialIcon icon="facebook" />
        </a>
      </div>
      {linkCopied && (
        <p className="share-bar__toast" role="status" aria-live="polite">
          Link copied
        </p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  type Article,
  getArticleAuthorName,
  getArticleDisplayDate,
  getCategoryLabel,
  getSubcategoryLabel,
} from "@/types/article";
import { ArticlesApi } from "@/lib/api/articles";
import { resolveArticleImageUrl } from "@/lib/article-image-url";
import { stripDuplicateTitleFromContent } from "@/lib/article-content.util";
import { ArticleShareBar } from "@/components/shared/ArticleShareBar";
import "./article-detail.scss";

interface ArticleDetailProps {
  id: string;
}

function formatLongDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function ArticleDetail({ id }: ArticleDetailProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Missing article id.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    ArticlesApi.get(id)
      .then((a) => {
        if (!active) return;
        setArticle(a);
        const href = typeof window !== "undefined" ? window.location.href : "";
        if (href) setShareUrl(href.split("#")[0]);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError("Article not found.");
        setLoading(false);
        console.error(err);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const renderedContent = useMemo(() => {
    if (!article) return "";
    return stripDuplicateTitleFromContent(article.content, article.title);
  }, [article]);

  return (
    <section className="wo-section article-page">
      <div className="wo-container article">
        <Link href="/articles" className="back-link">
          ← All research
        </Link>

        {article ? (
          <>
            <header className="article__header">
              <h1 className="article__title">{article.title}</h1>

              {(article.category || article.subcategory) && (
                <div className="article-meta-tags article-meta-tags--stacked article__meta-tags">
                  {article.category && (
                    <span
                      className="article-meta-tag article-meta-tag--cat"
                      title={getCategoryLabel(article.category)}
                    >
                      {getCategoryLabel(article.category)}
                    </span>
                  )}
                  {article.subcategory && (
                    <span
                      className="article-meta-tag article-meta-tag--sub"
                      title={getSubcategoryLabel(article.category, article.subcategory)}
                    >
                      {getSubcategoryLabel(article.category, article.subcategory)}
                    </span>
                  )}
                </div>
              )}

              <dl className="article__byline">
                <div className="article__byline-item">
                  <dt>Author</dt>
                  <dd>{getArticleAuthorName(article)}</dd>
                </div>
                <div className="article__byline-item article__byline-item--brand">
                  <dt>Wordetica EU</dt>
                  <dd className="article__brand-line">
                    <time dateTime={getArticleDisplayDate(article)}>
                      {formatLongDate(getArticleDisplayDate(article))}
                    </time>
                    {article.language && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="article__lang">{article.language.toUpperCase()}</span>
                      </>
                    )}
                  </dd>
                </div>
              </dl>

              {shareUrl && (
                <div className="article__share">
                  <ArticleShareBar url={shareUrl} title={article.title} />
                </div>
              )}

              {article.image && (
                <figure className="article__cover-wrap">
                  <img
                    src={resolveArticleImageUrl(article.image)}
                    alt={article.metadata_title || article.title}
                    className="article__cover"
                    loading="eager"
                    decoding="async"
                  />
                </figure>
              )}
            </header>

            <article
              className="article__body"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            ></article>
          </>
        ) : (
          <>
            {loading && <div className="state">Loading article…</div>}
            {error && <div className="state state--error">{error}</div>}
          </>
        )}
      </div>
    </section>
  );
}

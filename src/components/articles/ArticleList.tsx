"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import {
  ARTICLE_CATEGORY_TREE,
  type Article,
  getArticleDisplayDate,
  getCategoryLabel,
  getSubcategoriesForCategory,
  getSubcategoryLabel,
} from "@/types/article";
import { ArticlesApi } from "@/lib/api/articles";
import { resolveArticleImageUrl } from "@/lib/article-image-url";
import { ArticleShareBar } from "@/components/shared/ArticleShareBar";
import { PageCta } from "@/components/shared/PageCta";
import "./article-list.scss";

const PAGE_SIZE = 6;

function formatMediumDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

interface Filters {
  search: string;
  category: string;
  subcategory: string;
}

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [showContributorModal, setShowContributorModal] = useState(false);

  const categories = ARTICLE_CATEGORY_TREE;

  const subcategoryOptions = useMemo(
    () => getSubcategoriesForCategory(category),
    [category],
  );

  const hasActiveFilters = useMemo(
    () => !!(search.trim() || category || subcategory),
    [search, category, subcategory],
  );

  const emptyTopicLabel = useMemo(() => {
    if (subcategory && category) {
      return getSubcategoryLabel(category, subcategory);
    }
    if (category) {
      return getCategoryLabel(category);
    }
    const q = search.trim();
    return q ? `"${q}"` : "";
  }, [search, category, subcategory]);

  const pageRef = useRef(1);
  const filtersRef = useRef<Filters>({ search: "", category: "", subcategory: "" });
  filtersRef.current = { search, category, subcategory };
  const requestIdRef = useRef(0);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchArticles = useCallback((reset: boolean, override?: Partial<Filters>) => {
    const filters = { ...filtersRef.current, ...override };

    if (reset) {
      pageRef.current = 1;
      setLoading(true);
      setArticles([]);
    } else {
      setLoadingMore(true);
    }

    setError(null);

    const requestId = ++requestIdRef.current;

    const query = {
      page: pageRef.current,
      page_size: PAGE_SIZE,
      search: filters.search.trim() || undefined,
      category: filters.category || undefined,
      subcategory: filters.subcategory || undefined,
      ordering: "-created_at",
    };

    ArticlesApi.list(query)
      .then((page) => {
        if (requestId !== requestIdRef.current) return;
        setTotalCount(page.count);
        setHasMore(!!page.next);
        if (reset) {
          setArticles(page.results);
        } else {
          setArticles((current) => [...current, ...page.results]);
        }
        setLoading(false);
        setLoadingMore(false);
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setError("Could not load articles.");
        setLoading(false);
        setLoadingMore(false);
        console.error(err);
      });
  }, []);

  useEffect(() => {
    fetchArticles(true);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [fetchArticles]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showContributorModal) {
        setShowContributorModal(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showContributorModal]);

  const onSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => fetchArticles(true, { search: value }), 250);
  };

  const onCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setCategory(value);
    setSubcategory("");
    fetchArticles(true, { category: value, subcategory: "" });
  };

  const onSubcategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSubcategory(value);
    fetchArticles(true, { subcategory: value });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSubcategory("");
    fetchArticles(true, { search: "", category: "", subcategory: "" });
  };

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    pageRef.current += 1;
    fetchArticles(false);
  };

  const openContributorModal = () => setShowContributorModal(true);
  const closeContributorModal = () => setShowContributorModal(false);

  const articleShareUrl = (article: Article): string => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/articles/${article.id}`;
  };

  const contactIdeaTopic = emptyTopicLabel || "Research";

  return (
    <>
      <section className="wo-section">
        <div className="wo-container">
          <header className="header wo-center">
            <span className="wo-tag">Research</span>
            <h1 className="header__title">
              <span className="header__title-line">
                Research &amp; Reflections on language, learning, inclusion,
              </span>
              <span className="header__title-line">
                and localization in the age of{" "}
                <span className="wo-gradient-text wo-pulse-ai">AI</span>.
              </span>
            </h1>
            <p className="contributor-cta">
              Want to become a contributing author?
              <button
                type="button"
                className="contributor-cta__link"
                onClick={openContributorModal}
              >
                Learn more
              </button>
            </p>
          </header>

          <div className="filters" role="search">
            <div className="filters__row">
              <div className="filters__field filters__field--search">
                <label className="sr-only" htmlFor="article-search">
                  Search articles
                </label>
                <input
                  id="article-search"
                  type="search"
                  className="wo-input filters__control"
                  placeholder="Search articles…"
                  value={search}
                  onChange={onSearchInput}
                />
              </div>

              <div className="filters__field filters__field--category">
                <label className="sr-only" htmlFor="article-category">
                  Category
                </label>
                <select
                  id="article-category"
                  className="wo-select filters__control"
                  value={category}
                  onChange={onCategoryChange}
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filters__field filters__field--subcategory">
                <label className="sr-only" htmlFor="article-subcategory">
                  Subcategory
                </label>
                <select
                  id="article-subcategory"
                  className="wo-select filters__control"
                  value={subcategory}
                  onChange={onSubcategoryChange}
                  disabled={!category}
                >
                  <option value="">All subcategories</option>
                  {subcategoryOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading && <div className="state">Loading articles…</div>}
          {error && <div className="state state--error">Could not load articles.</div>}

          {!loading && !error && (
            <div>
              {articles.length === 0 && hasActiveFilters && (
                <div className="empty-topic" role="status">
                  <span className="empty-topic__emoji" aria-hidden="true">
                    📚
                  </span>
                  <h2 className="empty-topic__title">No article on this topic yet</h2>
                  {emptyTopicLabel ? (
                    <p className="empty-topic__lead">
                      We don&apos;t have a piece on {emptyTopicLabel} in our library right now - our
                      linguists are probably debating Oxford commas instead of writing it.
                    </p>
                  ) : (
                    <p className="empty-topic__lead">
                      We couldn&apos;t find anything matching your filters - but the idea might still
                      be worth a post.
                    </p>
                  )}
                  <p className="empty-topic__cta">
                    Tell us what you&apos;d like to read about. We&apos;ll consider your suggestion
                    for the next article.
                  </p>
                  <div className="empty-topic__actions">
                    <Link
                      className="wo-btn wo-btn--primary"
                      href={`/contact?topic=${encodeURIComponent(contactIdeaTopic)}`}
                    >
                      Suggest a topic
                    </Link>
                    <button
                      type="button"
                      className="wo-btn wo-btn--ghost"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
              )}

              {articles.length === 0 && !hasActiveFilters && (
                <div className="state">No articles published yet. Check back soon.</div>
              )}

              {articles.length > 0 && (
                <ul className="grid">
                  {articles.map((a) => (
                    <li key={a.id} className="article-card">
                      <Link href={`/articles/${a.id}`} className="article-card__link">
                        {a.image && (
                          <div className="article-card__cover">
                            <img
                              src={resolveArticleImageUrl(a.image)}
                              alt={a.title}
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        )}
                        <div className="article-card__body">
                          {(a.category || a.subcategory) && (
                            <div className="article-meta-tags article-meta-tags--stacked">
                              {a.category && (
                                <span
                                  className="article-meta-tag article-meta-tag--cat"
                                  title={getCategoryLabel(a.category)}
                                >
                                  {getCategoryLabel(a.category)}
                                </span>
                              )}
                              {a.subcategory && (
                                <span
                                  className="article-meta-tag article-meta-tag--sub"
                                  title={getSubcategoryLabel(a.category, a.subcategory)}
                                >
                                  {getSubcategoryLabel(a.category, a.subcategory)}
                                </span>
                              )}
                            </div>
                          )}
                          <h3>{a.title}</h3>
                          <footer className="article-card__footer">
                            <p className="article-card__meta">
                              <span className="article-card__brand">Wordetica EU</span>
                              <span aria-hidden="true">·</span>
                              <time dateTime={getArticleDisplayDate(a)}>
                                {formatMediumDate(getArticleDisplayDate(a))}
                              </time>
                              {a.language && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="article-card__lang">
                                    {a.language.toUpperCase()}
                                  </span>
                                </>
                              )}
                            </p>
                          </footer>
                        </div>
                      </Link>
                      <div className="article-card__share">
                        <ArticleShareBar
                          url={articleShareUrl(a)}
                          title={a.title}
                          showLabel={false}
                          compact={true}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {articles.length > 0 && (
                <div className="list-footer">
                  <p className="list-footer__count" aria-live="polite">
                    Showing {articles.length} of {totalCount} articles
                  </p>
                  {hasMore && (
                    <button
                      type="button"
                      className="wo-btn wo-btn--ghost list-footer__more"
                      onClick={loadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? "Loading…" : "Load more articles"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <PageCta />

      {showContributorModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contributor-modal-title"
          onClick={closeContributorModal}
        >
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal__close"
              onClick={closeContributorModal}
              aria-label="Close dialog"
            >
              &times;
            </button>
            <h2 id="contributor-modal-title" className="modal__title">
              Become a Contributor Author
            </h2>
            <p className="modal__lead">
              Share your expertise with a growing community of language professionals, researchers,
              and educators.
            </p>
            <ul className="modal__benefits">
              <li>Concrete portfolio evidence of writing, analysis, or review work</li>
              <li>Increased professional visibility through publicly accessible publications</li>
              <li>Opportunity to collaborate on interdisciplinary research outputs</li>
              <li>Contribution record that can support CVs, applications, or funding profiles</li>
              <li>
                Editorial and publishing improvements applied to submitted work (formatting, SEO,
                structure, clarity)
              </li>
            </ul>
            <div className="modal__actions">
              <Link
                href="/contact"
                className="wo-btn wo-btn--primary"
                onClick={closeContributorModal}
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

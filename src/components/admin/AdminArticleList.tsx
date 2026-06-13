"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ARTICLE_CATEGORY_TREE,
  getArticleLanguageLabel,
  getCategoryLabel,
  getSubcategoryLabel,
  type Article,
  type ArticleStatus,
} from "@/types/article";
import { ArticlesApi } from "@/lib/api/articles";
import { downloadMultiple } from "@/lib/article-export";
import "./admin-article-list.scss";

export type AdminArticleTab = "published" | "scheduled" | "draft" | "all";

function formatMediumDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusAbbr(status: ArticleStatus | undefined): string {
  if (status === "published") return "PUB";
  if (status === "scheduled") return "SCH";
  return "DRA";
}

export function AdminArticleList({ tab }: { tab: AdminArticleTab }) {
  const router = useRouter();

  const categories = ARTICLE_CATEGORY_TREE;

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [exporting, setExporting] = useState(false);

  const allSelected = useMemo(
    () => articles.length > 0 && articles.every((a) => selectedIds.has(a.id)),
    [articles, selectedIds],
  );
  const someSelected = useMemo(
    () => selectedIds.size > 0 && !allSelected,
    [selectedIds, allSelected],
  );
  const hasSelection = useMemo(() => selectedIds.size > 0, [selectedIds]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSelectedIds(new Set());

    const status = tab === "all" ? undefined : tab;

    ArticlesApi.list({
      ordering: "-created_at",
      category: categoryFilter || undefined,
      status,
    })
      .then((page) => {
        setArticles(page.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load articles.");
        setLoading(false);
      });
  }, [tab, categoryFilter]);

  const setTab = (next: AdminArticleTab) => {
    const path =
      next === "draft"
        ? "/admin/articles/drafts"
        : next === "scheduled"
          ? "/admin/articles/scheduled"
          : next === "all"
            ? "/admin/articles/all"
            : "/admin/articles";
    router.push(path);
  };

  const onCategoryFilter = (value: string) => setCategoryFilter(value);
  const clearCategoryFilter = () => setCategoryFilter("");

  const toggleSelect = (id: number) => {
    setSelectedIds((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(articles.map((a) => a.id)));
    }
  };

  const downloadSelected = async () => {
    const selected = articles.filter((a) => selectedIds.has(a.id));
    if (!selected.length) return;
    setExporting(true);
    try {
      const label =
        selected.length === 1 ? selected[0].title : `wordetica-${selected.length}-articles`;
      await downloadMultiple(selected, label);
    } finally {
      setExporting(false);
    }
  };

  const downloadAll = async () => {
    if (!articles.length) return;
    setExporting(true);
    try {
      await downloadMultiple(articles, `wordetica-${tab}-articles`);
    } finally {
      setExporting(false);
    }
  };

  const remove = (article: Article) => {
    const confirmed = window.confirm(
      `Delete article "${article.title}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    ArticlesApi.remove(article.id)
      .then(() => {
        setArticles((list) => list.filter((a) => a.id !== article.id));
      })
      .catch((err) => {
        console.error(err);
        window.alert("Could not delete the article.");
      });
  };

  return (
    <div className="page">
      <header>
        <div>
          <h1>Articles</h1>
          <p>Manage published research and drafts. Open the Drafts tab to continue writing.</p>
        </div>
        <Link href="/admin/articles/new" className="wo-btn wo-btn--primary">
          + New article
        </Link>
      </header>

      <nav className="tabs" aria-label="Article lists">
        <button
          type="button"
          className={`tabs__btn${tab === "published" ? " is-active" : ""}`}
          onClick={() => setTab("published")}
        >
          Published
        </button>
        <button
          type="button"
          className={`tabs__btn${tab === "scheduled" ? " is-active" : ""}`}
          onClick={() => setTab("scheduled")}
        >
          Scheduled
        </button>
        <button
          type="button"
          className={`tabs__btn${tab === "draft" ? " is-active" : ""}`}
          onClick={() => setTab("draft")}
        >
          Drafts
        </button>
        <button
          type="button"
          className={`tabs__btn${tab === "all" ? " is-active" : ""}`}
          onClick={() => setTab("all")}
        >
          All
        </button>
      </nav>

      {tab === "draft" && (
        <section className="draft-banner" aria-label="Drafts help">
          <p>
            Drafts are not visible on the public site. Use <strong>Edit</strong> to finish, then
            <strong>Publish</strong> or <strong>Scheduled</strong> when ready.
          </p>
        </section>
      )}

      {tab === "scheduled" && (
        <section className="draft-banner" aria-label="Scheduled help">
          <p>
            Scheduled articles go live automatically on the chosen date. Use <strong>Edit</strong>{" "}
            to change content or reschedule.
          </p>
        </section>
      )}

      <div className="toolbar" role="search">
        <label className="wo-label" htmlFor="admin-category-filter">
          Filter by category
        </label>
        <select
          id="admin-category-filter"
          className="wo-select"
          value={categoryFilter}
          onChange={(e) => onCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="wo-btn wo-btn--ghost"
          onClick={clearCategoryFilter}
          disabled={!categoryFilter}
        >
          Clear filter
        </button>
        <span className="toolbar__divider" aria-hidden="true"></span>
        {!loading && !error && articles.length > 0 && (
          <button
            type="button"
            className="wo-btn wo-btn--ghost"
            onClick={() => (hasSelection ? downloadSelected() : downloadAll())}
            disabled={exporting}
          >
            {exporting
              ? "Exporting…"
              : hasSelection
                ? `Download (${selectedIds.size} selected)`
                : `Download (${articles.length})`}
          </button>
        )}
      </div>

      {loading && <div className="state">Loading…</div>}
      {error && <div className="state state--error">{error}</div>}

      {!loading && !error && articles.length > 0 && (
        <div className="table-wrap">
          <table className="articles-table">
            <thead>
              <tr>
                <th scope="col" className="col-select">
                  <input
                    type="checkbox"
                    className="row-check"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleSelectAll}
                    aria-label="Select all articles"
                  />
                </th>
                <th scope="col" className="col-title">
                  Title
                </th>
                <th scope="col" className="col-status">
                  STS
                </th>
                <th scope="col" className="col-category">
                  Category
                </th>
                <th scope="col" className="col-subcategory">
                  Subcategory
                </th>
                <th scope="col" className="col-language">
                  Lang
                </th>
                <th scope="col" className="col-author">
                  Author
                </th>
                {tab === "scheduled" && (
                  <th scope="col" className="col-publish">
                    Publish date
                  </th>
                )}
                <th scope="col" className="col-created">
                  Created
                </th>
                <th scope="col" className="col-actions">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => {
                const rowClass = [
                  a.status === "draft" ? "is-draft" : "",
                  a.status === "scheduled" ? "is-scheduled" : "",
                  selectedIds.has(a.id) ? "is-selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <tr key={a.id} className={rowClass || undefined}>
                    <td className="col-select">
                      <input
                        type="checkbox"
                        className="row-check"
                        checked={selectedIds.has(a.id)}
                        onChange={() => toggleSelect(a.id)}
                        aria-label={`Select ${a.title}`}
                      />
                    </td>
                    <td className="col-title">
                      {a.status === "published" ? (
                        <Link
                          className="title-link"
                          href={`/articles/${a.id}`}
                          target="_blank"
                          rel="noopener"
                        >
                          {a.title}
                        </Link>
                      ) : (
                        <Link className="title-link" href={`/admin/articles/${a.id}/edit`}>
                          {a.title}
                        </Link>
                      )}
                    </td>
                    <td className="col-status">
                      <span
                        className={`status-pill${
                          a.status === "draft" ? " status-pill--draft" : ""
                        }${a.status === "scheduled" ? " status-pill--scheduled" : ""}`}
                      >
                        {statusAbbr(a.status)}
                      </span>
                    </td>
                    <td className="col-category">
                      {a.category ? getCategoryLabel(a.category) : "-"}
                    </td>
                    <td className="col-subcategory">
                      {a.subcategory ? getSubcategoryLabel(a.category, a.subcategory) : "-"}
                    </td>
                    <td className="col-language">
                      {a.language ? (
                        <span className="wo-tag wo-tag--accent wo-tag--lang">
                          {a.language.toUpperCase()}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="col-author">
                      {a.author_name || a.author_full_name || a.author_email}
                    </td>
                    {tab === "scheduled" && (
                      <td className="col-publish">
                        {a.published_at ? formatMediumDate(a.published_at) : "-"}
                      </td>
                    )}
                    <td className="col-created">{formatMediumDate(a.created_at)}</td>
                    <td className="col-actions">
                      <div className="actions-inner">
                        <Link href={`/admin/articles/${a.id}/edit`} className="link">
                          Edit
                        </Link>
                        {a.status === "published" && (
                          <Link
                            href={`/articles/${a.id}`}
                            className="link"
                            target="_blank"
                            rel="noopener"
                          >
                            View
                          </Link>
                        )}
                        <button
                          type="button"
                          className="link link--danger"
                          onClick={() => remove(a)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="state">
          {tab === "scheduled" ? (
            categoryFilter ? (
              <>
                No scheduled articles in this category.{" "}
                <button type="button" className="link" onClick={clearCategoryFilter}>
                  Clear filter
                </button>
              </>
            ) : (
              <>
                No scheduled articles. <Link href="/admin/articles/new">Create one</Link> and use{" "}
                <strong>Scheduled</strong> to pick a publish date.
              </>
            )
          ) : tab === "draft" ? (
            categoryFilter ? (
              <>
                No drafts in this category.{" "}
                <button type="button" className="link" onClick={clearCategoryFilter}>
                  Clear filter
                </button>
              </>
            ) : (
              <>
                No drafts yet. <Link href="/admin/articles/new">Start a new article</Link> (saved
                as draft by default).
              </>
            )
          ) : tab === "published" ? (
            categoryFilter ? (
              <>
                No published articles in this category.{" "}
                <button type="button" className="link" onClick={clearCategoryFilter}>
                  Clear filter
                </button>
              </>
            ) : (
              <>
                No published articles yet. <Link href="/admin/articles/new">Create one</Link> and
                set status to Published.
              </>
            )
          ) : (
            <>
              No articles match your filters.{" "}
              <button type="button" className="link" onClick={clearCategoryFilter}>
                Clear filter
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

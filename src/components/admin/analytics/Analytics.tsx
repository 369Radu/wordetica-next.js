"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ChartConfiguration, ChartData } from "chart.js";
import { AnalyticsApi } from "@/lib/api/analytics";
import { ChartCanvas, type ChartClickPayload } from "@/components/admin/ChartCanvas";
import type {
  AnalyticsArticle,
  AnalyticsFilters,
  CategoryCount,
  DrilldownFilter,
  LanguageCount,
  SubcategoryCount,
  TimelinePoint,
  UnusedResponse,
} from "@/types/analytics";
import "./analytics.scss";

interface FilterForm {
  year: number | null;
  month: number | null;
  category: string | null;
  language: string | null;
}

const PALETTE = [
  "#2dd4bf",
  "#22c55e",
  "#0ea5e9",
  "#a855f7",
  "#ec4899",
  "#f59e0b",
  "#ef4444",
  "#6366f1",
  "#14b8a6",
  "#84cc16",
  "#f43f5e",
  "#06b6d4",
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS = MONTH_NAMES.map((label, i) => ({ value: i + 1, label }));

const chartOptions: ChartConfiguration["options"] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
};
const pieOptions: ChartConfiguration<"doughnut">["options"] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" } },
};
const timelineOptions: ChartConfiguration<"line">["options"] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
};

const EMPTY_CHART: ChartData = { labels: [], datasets: [] };

function formatMediumDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function buildCategoryChart(data: CategoryCount[]): ChartData {
  return {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: data.map((_, i) => PALETTE[i % PALETTE.length]),
        borderRadius: 8,
      },
    ],
  };
}

function buildSubcategoryChart(data: SubcategoryCount[]): ChartData {
  return {
    labels: data.map((d) => d.subcategory_label),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: data.map((_, i) => PALETTE[(i + 3) % PALETTE.length]),
        borderRadius: 8,
      },
    ],
  };
}

function buildLanguageChart(data: LanguageCount[]): ChartData {
  return {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: data.map((_, i) => PALETTE[(i * 2) % PALETTE.length]),
      },
    ],
  };
}

function buildTimelineChart(data: TimelinePoint[]): ChartData {
  return {
    labels: data.map((p) => p.label),
    datasets: [
      {
        data: data.map((p) => p.count),
        borderColor: PALETTE[0],
        backgroundColor: "rgba(45,212,191,0.18)",
        tension: 0.35,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: PALETTE[0],
      },
    ],
  };
}

export function Analytics() {
  const [filters, setFilters] = useState<FilterForm>({
    year: null,
    month: null,
    category: null,
    language: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [perCategory, setPerCategory] = useState<CategoryCount[]>([]);
  const [perSubcategory, setPerSubcategory] = useState<SubcategoryCount[]>([]);
  const [perLanguage, setPerLanguage] = useState<LanguageCount[]>([]);
  const [timelineData, setTimelineData] = useState<TimelinePoint[]>([]);
  const [unused, setUnused] = useState<UnusedResponse | null>(null);

  const [categoryChart, setCategoryChart] = useState<ChartData>(EMPTY_CHART);
  const [subcategoryChart, setSubcategoryChart] = useState<ChartData>(EMPTY_CHART);
  const [languageChart, setLanguageChart] = useState<ChartData>(EMPTY_CHART);
  const [timelineChart, setTimelineChart] = useState<ChartData>(EMPTY_CHART);

  const [drilldownLoading, setDrilldownLoading] = useState(false);
  const [drilldownTitle, setDrilldownTitle] = useState<string | null>(null);
  const [drilldownArticles, setDrilldownArticles] = useState<AnalyticsArticle[]>([]);

  const availableYears = useMemo(() => {
    const years = new Set<number>(timelineData.map((p) => p.year));
    years.add(new Date().getFullYear());
    return [...years].sort((a, b) => b - a);
  }, [timelineData]);

  const availableCategories = useMemo(
    () => perCategory.map((c) => ({ value: c.category, label: c.label })),
    [perCategory],
  );
  const availableLanguages = useMemo(
    () => perLanguage.map((l) => ({ value: l.language, label: l.label })),
    [perLanguage],
  );
  const totalArticles = useMemo(
    () => perCategory.reduce((sum, c) => sum + c.count, 0),
    [perCategory],
  );

  const loadAll = (f: FilterForm) => {
    setLoading(true);
    setError(null);
    const filt: AnalyticsFilters = {
      year: f.year ?? null,
      month: f.month ?? null,
      category: f.category ?? null,
      language: f.language ?? null,
    };

    let remaining = 5;
    const done = () => {
      remaining -= 1;
      if (remaining === 0) setLoading(false);
    };
    const handleError = (err: unknown) => {
      console.error(err);
      setError("Could not load analytics data.");
      done();
    };

    AnalyticsApi.perCategory(filt)
      .then((data) => {
        setPerCategory(data);
        setCategoryChart(buildCategoryChart(data));
        done();
      })
      .catch(handleError);
    AnalyticsApi.perSubcategory(filt)
      .then((data) => {
        setPerSubcategory(data);
        setSubcategoryChart(buildSubcategoryChart(data));
        done();
      })
      .catch(handleError);
    AnalyticsApi.perLanguage(filt)
      .then((data) => {
        setPerLanguage(data);
        setLanguageChart(buildLanguageChart(data));
        done();
      })
      .catch(handleError);
    AnalyticsApi.timeline(filt)
      .then((data) => {
        setTimelineData(data);
        setTimelineChart(buildTimelineChart(data));
        done();
      })
      .catch(handleError);
    AnalyticsApi.unused(filt)
      .then((data) => {
        setUnused(data);
        done();
      })
      .catch(handleError);
  };

  useEffect(() => {
    loadAll(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setYear = (value: string) => {
    const v = value === "" ? null : Number(value);
    setFilters((f) => ({ ...f, year: v === null || Number.isNaN(v) ? null : v }));
  };
  const setMonth = (value: string) => {
    const v = value === "" ? null : Number(value);
    setFilters((f) => ({ ...f, month: v === null || Number.isNaN(v) ? null : v }));
  };
  const setCategory = (value: string) => {
    setFilters((f) => ({ ...f, category: value || null }));
  };
  const setLanguage = (value: string) => {
    setFilters((f) => ({ ...f, language: value || null }));
  };
  const applyFilters = () => loadAll(filters);
  const clearFilters = () => {
    const reset = { year: null, month: null, category: null, language: null };
    setFilters(reset);
    loadAll(reset);
  };

  const firstActiveIndex = (active: ChartClickPayload["active"]): number | null => {
    if (!active || active.length === 0) return null;
    const first = active[0] as { index?: number };
    return typeof first.index === "number" ? first.index : null;
  };

  const runDrilldown = (title: string, filter: DrilldownFilter) => {
    setDrilldownTitle(title);
    setDrilldownLoading(true);
    setDrilldownArticles([]);
    AnalyticsApi.drilldown(filter)
      .then((data) => setDrilldownArticles(data.results))
      .catch((err) => {
        console.error(err);
        setError("Could not load drill-down results.");
      })
      .finally(() => setDrilldownLoading(false));
  };

  const onCategoryClick = ({ active }: ChartClickPayload) => {
    const idx = firstActiveIndex(active);
    if (idx == null) return;
    const item = perCategory[idx];
    if (!item) return;
    runDrilldown(`Category: ${item.label}`, { category: item.category });
  };
  const onSubcategoryClick = ({ active }: ChartClickPayload) => {
    const idx = firstActiveIndex(active);
    if (idx == null) return;
    const item = perSubcategory[idx];
    if (!item) return;
    runDrilldown(`Subcategory: ${item.subcategory_label}`, {
      category: item.category,
      subcategory: item.subcategory,
    });
  };
  const onLanguageClick = ({ active }: ChartClickPayload) => {
    const idx = firstActiveIndex(active);
    if (idx == null) return;
    const item = perLanguage[idx];
    if (!item) return;
    runDrilldown(`Language: ${item.label}`, { language: item.language });
  };
  const onTimelineClick = ({ active }: ChartClickPayload) => {
    const idx = firstActiveIndex(active);
    if (idx == null) return;
    const point = timelineData[idx];
    if (!point) return;
    runDrilldown(`Month: ${MONTH_NAMES[point.month - 1]} ${point.year}`, {
      month: point.month,
      year: point.year,
    });
  };
  const closeDrilldown = () => {
    setDrilldownTitle(null);
    setDrilldownArticles([]);
  };

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>Analytics</h1>
          <p>Interactive charts and drill-down over all articles.</p>
        </div>
        <span className="total-pill">
          Total articles: <strong>{totalArticles}</strong>
        </span>
      </header>

      <section className="filters" aria-label="Filters">
        <label className="field">
          <span>Year</span>
          <select
            className="wo-select"
            value={filters.year ?? ""}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">All years</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Month</span>
          <select
            className="wo-select"
            value={filters.month ?? ""}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">All months</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Category</span>
          <select
            className="wo-select"
            value={filters.category ?? ""}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {availableCategories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Language</span>
          <select
            className="wo-select"
            value={filters.language ?? ""}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">All languages</option>
            {availableLanguages.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <div className="filters__actions">
          <button type="button" className="wo-btn wo-btn--primary" onClick={applyFilters}>
            Apply
          </button>
          <button type="button" className="wo-btn wo-btn--ghost" onClick={clearFilters}>
            Reset
          </button>
        </div>
      </section>

      {error && <p className="wo-error">{error}</p>}
      {loading && <p className="loading">Loading analytics…</p>}

      <section className="grid">
        <article className="card">
          <header>
            <h2>Articles per category</h2>
            <span className="hint">Click a bar to view articles</span>
          </header>
          <div className="chart">
            <ChartCanvas
              type="bar"
              data={categoryChart}
              options={chartOptions}
              onChartClick={onCategoryClick}
            />
          </div>
        </article>

        <article className="card">
          <header>
            <h2>Articles per subcategory</h2>
            <span className="hint">Click a bar to view articles</span>
          </header>
          <div className="chart chart--tall">
            <ChartCanvas
              type="bar"
              data={subcategoryChart}
              options={chartOptions}
              onChartClick={onSubcategoryClick}
            />
          </div>
        </article>

        <article className="card">
          <header>
            <h2>Articles per language</h2>
            <span className="hint">Click a slice to view articles</span>
          </header>
          <div className="chart">
            <ChartCanvas
              type="doughnut"
              data={languageChart}
              options={pieOptions}
              onChartClick={onLanguageClick}
            />
          </div>
        </article>

        <article className="card">
          <header>
            <h2>Timeline (per month)</h2>
            <span className="hint">Click a point to view articles for that month</span>
          </header>
          <div className="chart">
            <ChartCanvas
              type="line"
              data={timelineChart}
              options={timelineOptions}
              onChartClick={onTimelineClick}
            />
          </div>
        </article>
      </section>

      {drilldownTitle && (
        <section className="card drilldown">
          <header>
            <h2>
              {drilldownTitle} - {drilldownArticles.length} article(s)
            </h2>
            <button type="button" className="wo-btn wo-btn--ghost" onClick={closeDrilldown}>
              Close
            </button>
          </header>
          {drilldownLoading && <p className="loading">Loading…</p>}
          {!drilldownLoading && drilldownArticles.length === 0 && (
            <p className="empty">No articles match this selection.</p>
          )}
          {drilldownArticles.length > 0 && (
            <ul className="article-list">
              {drilldownArticles.map((a) => (
                <li key={a.id}>
                  <Link href={`/articles/${a.id}`} target="_blank" rel="noopener">
                    {a.title}
                  </Link>
                  <span className="meta">
                    {a.category_label} · {a.subcategory_label} ·{" "}
                    <strong>{a.language.toUpperCase()}</strong> ·{" "}
                    {formatMediumDate(a.published_at || a.created_at)}
                    <span className={`status status--${a.status}`}>{a.status}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {unused && (
        <section className="card unused">
          <header>
            <h2>Unused categories &amp; subcategories</h2>
          </header>
          <div className="unused__cols">
            <div>
              <h3>Categories with 0 articles</h3>
              {unused.categories.length > 0 ? (
                <ul>
                  {unused.categories.map((c) => (
                    <li key={c.category}>{c.label}</li>
                  ))}
                </ul>
              ) : (
                <p className="empty">Every category has at least one article.</p>
              )}
            </div>
            <div>
              <h3>Subcategories with 0 articles</h3>
              {unused.subcategories.length > 0 ? (
                <ul>
                  {unused.subcategories.map((s) => (
                    <li key={`${s.category}-${s.subcategory}`}>
                      <strong>{s.subcategory_label}</strong>
                      <span className="meta"> - {s.category_label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty">Every subcategory has at least one article.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

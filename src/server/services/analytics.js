import {
  CATEGORY_LABELS,
  CATEGORY_TREE,
  SUBCATEGORY_LABELS,
  ARTICLE_LANGUAGES,
} from "../lib/categories.js";
import { fetchFilteredForAnalytics } from "../repositories/articlesRepository.js";
import { authorDisplayName, serializeAnalyticsArticle } from "./articles.js";

export async function fetchFilteredRows(req) {
  const rows = await fetchFilteredForAnalytics(req);
  return rows.map((row) => ({
    ...row,
    category_label: CATEGORY_LABELS[row.category] || row.category,
    subcategory_label: SUBCATEGORY_LABELS[row.subcategory] || row.subcategory,
  }));
}

export function articlesPerCategory(rows) {
  const counts = {};
  for (const row of rows) counts[row.category] = (counts[row.category] || 0) + 1;
  return CATEGORY_TREE.map(([slug, label]) => ({
    category: slug,
    label,
    count: counts[slug] || 0,
  }));
}

export function articlesPerSubcategory(rows) {
  const counts = {};
  for (const row of rows) {
    const key = `${row.category}\0${row.subcategory}`;
    counts[key] = (counts[key] || 0) + 1;
  }
  const result = [];
  for (const [catSlug, catLabel, subs] of CATEGORY_TREE) {
    for (const [subSlug, subLabel] of subs) {
      result.push({
        category: catSlug,
        category_label: catLabel,
        subcategory: subSlug,
        subcategory_label: subLabel,
        count: counts[`${catSlug}\0${subSlug}`] || 0,
      });
    }
  }
  return result;
}

export function articlesPerLanguage(rows) {
  const counts = {};
  for (const row of rows) counts[row.language] = (counts[row.language] || 0) + 1;
  return Object.entries(ARTICLE_LANGUAGES).map(([code, label]) => ({
    language: code,
    label,
    count: counts[code] || 0,
  }));
}

export function timeline(rows) {
  const buckets = {};
  for (const row of rows) {
    const d = new Date(row.created_at);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }
  return Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, count]) => {
      const [year, month] = label.split("-").map(Number);
      return { year, month, label, count };
    });
}

export function grouped(rows) {
  const byCat = {};
  for (const row of rows) {
    if (!byCat[row.category]) byCat[row.category] = {};
    if (!byCat[row.category][row.subcategory]) byCat[row.category][row.subcategory] = [];
    byCat[row.category][row.subcategory].push(row);
  }

  return CATEGORY_TREE.map(([catSlug, catLabel, subs]) => {
    const subcategories = subs.map(([subSlug, subLabel]) => {
      const items = byCat[catSlug]?.[subSlug] || [];
      return {
        subcategory: subSlug,
        subcategory_label: subLabel,
        count: items.length,
        articles: items.map((r) =>
          serializeAnalyticsArticle({
            ...r,
            category_label: catLabel,
            subcategory_label: subLabel,
          }),
        ),
      };
    });
    return {
      category: catSlug,
      category_label: catLabel,
      subcategories,
      count: subcategories.reduce((s, g) => s + g.count, 0),
    };
  });
}

export function unusedCategories(rows) {
  const usedPairs = new Set(rows.map((r) => `${r.category}\0${r.subcategory}`));
  const usedCats = new Set(rows.map((r) => r.category));

  const categories = CATEGORY_TREE.filter(([slug]) => !usedCats.has(slug)).map(
    ([slug, label]) => ({ category: slug, label }),
  );

  const subcategories = [];
  for (const [catSlug, catLabel, subs] of CATEGORY_TREE) {
    for (const [subSlug, subLabel] of subs) {
      if (!usedPairs.has(`${catSlug}\0${subSlug}`)) {
        subcategories.push({
          category: catSlug,
          category_label: catLabel,
          subcategory: subSlug,
          subcategory_label: subLabel,
        });
      }
    }
  }
  return { categories, subcategories };
}

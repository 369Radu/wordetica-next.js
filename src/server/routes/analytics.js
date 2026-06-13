import { Router } from "express";
import { optionalAuth } from "../middleware/auth.js";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "../lib/categories.js";
import {
  fetchFilteredRows,
  articlesPerCategory,
  articlesPerSubcategory,
  articlesPerLanguage,
  timeline,
  grouped,
  unusedCategories,
} from "../services/analytics.js";
import { serializeAnalyticsArticle } from "../services/articles.js";

const router = Router();

router.use(optionalAuth);

router.get("/articles/grouped", async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req);
    res.json(grouped(rows));
  } catch (err) {
    next(err);
  }
});

router.get("/categories/unused", async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req);
    res.json(unusedCategories(rows));
  } catch (err) {
    next(err);
  }
});

router.get("/articles/filter", async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req);
    const results = rows.map((r) =>
      serializeAnalyticsArticle({
        ...r,
        category_label: CATEGORY_LABELS[r.category],
        subcategory_label: SUBCATEGORY_LABELS[r.subcategory],
      }),
    );
    res.json({ count: results.length, results });
  } catch (err) {
    next(err);
  }
});

router.get("/analytics/articles-per-category", async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req);
    res.json(articlesPerCategory(rows));
  } catch (err) {
    next(err);
  }
});

router.get("/analytics/articles-per-subcategory", async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req);
    res.json(articlesPerSubcategory(rows));
  } catch (err) {
    next(err);
  }
});

router.get("/analytics/articles-per-language", async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req);
    res.json(articlesPerLanguage(rows));
  } catch (err) {
    next(err);
  }
});

router.get("/analytics/timeline", async (req, res, next) => {
  try {
    const rows = await fetchFilteredRows(req);
    res.json(timeline(rows));
  } catch (err) {
    next(err);
  }
});

router.get("/analytics/drilldown", async (req, res, next) => {
  try {
    const q = req.query;
    const category = (q.category || "").trim();
    const subcategory = (q.subcategory || "").trim();
    const language = (q.language || "").trim();
    const month = q.month ? Number.parseInt(q.month, 10) : null;
    const year = q.year ? Number.parseInt(q.year, 10) : null;

    if (![category, subcategory, language, month, year].some(Boolean)) {
      return res.status(400).json({
        detail: "Provide at least one of: category, subcategory, language, month, year.",
      });
    }

    const rows = await fetchFilteredRows(req);
    const results = rows.map((r) =>
      serializeAnalyticsArticle({
        ...r,
        category_label: CATEGORY_LABELS[r.category],
        subcategory_label: SUBCATEGORY_LABELS[r.subcategory],
      }),
    );

    res.json({
      filter: {
        category: category || null,
        category_label: category ? CATEGORY_LABELS[category] : null,
        subcategory: subcategory || null,
        subcategory_label: subcategory ? SUBCATEGORY_LABELS[subcategory] : null,
        language: language || null,
        month: month || null,
        year: year || null,
      },
      count: results.length,
      results,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

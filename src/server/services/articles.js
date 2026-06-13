import {
  ARTICLE_LANGUAGES,
  ARTICLE_STATUSES,
  isValidCategory,
  isValidSubcategory,
} from "../lib/categories.js";
import { sanitizeArticleHtml } from "../lib/sanitizer.js";
import { deleteArticleImage, resolveArticleImageUrl } from "../lib/articleStorage.js";
import { absoluteUrl } from "../lib/urls.js";
import * as articlesRepo from "../repositories/articlesRepository.js";

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * @param {import('express').Request} req
 */
export async function listArticles(req, options) {
  const rows = await articlesRepo.listArticles(req, options);
  return rows.map((row) => serializeArticle(row, req));
}

export async function getArticleById(id, req, options) {
  const row = await articlesRepo.getArticleById(id, req, options);
  return row ? serializeArticle(row, req) : null;
}

export function authorDisplayName(row) {
  if (row.author_name?.trim()) return row.author_name.trim();
  const full = `${row.author_first_name || ""} ${row.author_last_name || ""}`.trim();
  return full || row.author_email || "";
}

export function serializeArticle(row, req) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    metadata_title: row.metadata_title || "",
    metadata_description: row.metadata_description || "",
    metadata_image: absoluteUrl(row.metadata_image || "", req),
    image: resolveArticleImageUrl(row.image, req),
    category: row.category || "",
    subcategory: row.subcategory || "",
    author_name: row.author_name || "",
    published_at: row.published_at ? formatDate(row.published_at) : null,
    language: row.language,
    status: row.status,
    created_at: row.created_at,
    author: row.author_id,
    author_email: row.author_email || "",
    author_full_name: `${row.author_first_name || ""} ${row.author_last_name || ""}`.trim(),
    author_display_name: authorDisplayName(row),
    excerpt: row.excerpt || "",
    meta_keywords: row.meta_keywords || "",
    slug: row.slug || "",
    og_title: row.og_title || "",
    og_description: row.og_description || "",
    google_trends_words: row.google_trends_words || [],
  };
}

function formatDate(d) {
  if (typeof d === "string") return d.slice(0, 10);
  return new Date(d).toISOString().slice(0, 10);
}

export function validateArticleInput(body, existing = null) {
  const errors = {};
  const title = (body.title ?? existing?.title ?? "").trim();
  if (!title) errors.title = ["Title cannot be blank."];

  let content = body.content;
  if (content === undefined && existing) {
    content = existing.content;
  } else if (content !== undefined) {
    content = sanitizeArticleHtml(content);
    if (!content.trim()) errors.content = ["Content cannot be empty after sanitisation."];
  } else if (!existing) {
    errors.content = ["Content cannot be blank."];
  }

  const language = body.language ?? existing?.language ?? "en";
  if (!ARTICLE_LANGUAGES[language]) {
    errors.language = ["Language must be EN, FR, RO, or ES."];
  }

  const category = body.category ?? existing?.category ?? "";
  const subcategory = body.subcategory ?? existing?.subcategory ?? "";
  if (category && !isValidCategory(category)) errors.category = ["Invalid category."];
  if (subcategory && !isValidSubcategory(category, subcategory)) {
    errors.subcategory = ["Invalid subcategory for the selected category."];
  }
  if (subcategory && !category) errors.category = ["Category is required when subcategory is set."];

  let status = body.status ?? existing?.status ?? "draft";
  let publishedAt = body.published_at ?? existing?.published_at ?? null;
  const today = todayDate();

  if (status === "published") {
    if (!publishedAt) publishedAt = today;
  } else if (status === "scheduled") {
    if (!publishedAt) errors.published_at = ["Scheduled articles require a publish date."];
    else if (publishedAt < today) {
      errors.published_at = ["Schedule date must be today or in the future."];
    }
  }

  if (status && !ARTICLE_STATUSES.includes(status)) {
    errors.status = ["Invalid status."];
  }

  return { errors, cleaned: { title, content, language, category, subcategory, status, publishedAt } };
}

export async function createArticle(data, authorId) {
  return articlesRepo.createArticle(data, authorId);
}

export async function updateArticle(id, data) {
  return articlesRepo.updateArticle(id, data);
}

export async function deleteArticle(id) {
  const row = await articlesRepo.getArticleRawById(id);
  if (row?.image) await deleteArticleImage(row.image);
  return articlesRepo.deleteArticle(id);
}

export function serializeAnalyticsArticle(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    category_label: row.category_label || row.category,
    subcategory: row.subcategory,
    subcategory_label: row.subcategory_label || row.subcategory,
    language: row.language,
    status: row.status,
    published_at: row.published_at ? formatDate(row.published_at) : null,
    created_at: row.created_at,
    author_display_name: authorDisplayName(row),
  };
}

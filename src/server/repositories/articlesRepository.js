import {
  getDb,
  nextNumericId,
  stripUndefined,
  toIso,
  todayDateString,
} from "../db/firestoreUtils.js";
import { findUserById } from "./usersRepository.js";

const COLLECTION = "articles";

/** @param {FirebaseFirestore.DocumentData | undefined} data */
function fromDoc(data) {
  if (!data) return null;
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    metadata_title: data.metadata_title || "",
    metadata_description: data.metadata_description || "",
    metadata_image: data.metadata_image || "",
    image: data.image || "",
    category: data.category || "",
    subcategory: data.subcategory || "",
    author_name: data.author_name || "",
    published_at: data.published_at || null,
    language: data.language,
    status: data.status,
    created_at: toIso(data.created_at),
    author_id: data.author_id,
    excerpt: data.excerpt || "",
    meta_keywords: data.meta_keywords || "",
    slug: data.slug || "",
    og_title: data.og_title || "",
    og_description: data.og_description || "",
    google_trends_words: data.google_trends_words || [],
  };
}

function isPublicArticle(article, today = todayDateString()) {
  if (article.status === "published") return true;
  if (article.status === "scheduled" && article.published_at) {
    return article.published_at <= today;
  }
  return false;
}

function matchesQuery(article, q) {
  if (q.title && !article.title.toLowerCase().includes(String(q.title).toLowerCase())) {
    return false;
  }
  if (q.category && article.category.toLowerCase() !== String(q.category).toLowerCase()) {
    return false;
  }
  if (
    q.subcategory &&
    article.subcategory.toLowerCase() !== String(q.subcategory).toLowerCase()
  ) {
    return false;
  }
  if (q.language && article.language !== q.language) return false;
  if (q.status && article.status !== q.status) return false;
  if (q.author && article.author_id !== Number.parseInt(q.author, 10)) return false;

  if (q.created_after) {
    const after = new Date(q.created_after).getTime();
    if (new Date(article.created_at).getTime() < after) return false;
  }
  if (q.created_before) {
    const before = new Date(q.created_before).getTime();
    if (new Date(article.created_at).getTime() > before) return false;
  }

  if (q.search) {
    const term = String(q.search).toLowerCase();
    const haystack = [
      article.title,
      article.category,
      article.subcategory,
      article.metadata_title,
      article.metadata_description,
      article.author_name,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(term)) return false;
  }

  return true;
}

function sortArticles(rows, ordering) {
  const allowed = new Set(["created_at", "title", "id"]);
  let field = "created_at";
  let desc = true;
  if (ordering) {
    desc = ordering.startsWith("-");
    const f = desc ? ordering.slice(1) : ordering;
    if (allowed.has(f)) field = f;
  }

  return [...rows].sort((a, b) => {
    let av = a[field];
    let bv = b[field];
    if (field === "created_at") {
      av = new Date(av).getTime();
      bv = new Date(bv).getTime();
    }
    if (av < bv) return desc ? 1 : -1;
    if (av > bv) return desc ? -1 : 1;
    return 0;
  });
}

async function attachAuthors(rows) {
  const cache = new Map();
  const authorIds = [...new Set(rows.map((row) => row.author_id).filter(Boolean))];
  await Promise.all(
    authorIds.map(async (id) => {
      cache.set(id, await findUserById(id));
    }),
  );

  return rows.map((row) => {
    const author = cache.get(row.author_id);
    return {
      ...row,
      author_email: author?.email || "",
      author_first_name: author?.first_name || "",
      author_last_name: author?.last_name || "",
    };
  });
}

export async function listArticlesRaw({ publicOnly = false, analyticsOnly = false } = {}) {
  const snap = await getDb().collection(COLLECTION).get();
  let rows = snap.docs.map((d) => fromDoc(d.data())).filter(Boolean);

  if (analyticsOnly) {
    rows = rows.filter((a) => a.status === "published");
  } else if (publicOnly) {
    rows = rows.filter((a) => isPublicArticle(a));
  }

  return rows;
}

export async function listArticles(req, { staffOnly = false } = {}) {
  const publicOnly = !staffOnly && !req.user?.is_staff;
  let rows = await listArticlesRaw({ publicOnly });
  rows = rows.filter((a) => matchesQuery(a, req.query));
  rows = sortArticles(rows, req.query.ordering);
  return attachAuthors(rows);
}

export async function getArticleRawById(id) {
  const snap = await getDb().collection(COLLECTION).doc(String(id)).get();
  return snap.exists ? fromDoc(snap.data()) : null;
}

export async function getArticleById(id, req, { staffOnly = false } = {}) {
  const row = await getArticleRawById(id);
  if (!row) return null;

  const publicOnly = !staffOnly && !req.user?.is_staff;
  if (publicOnly && !isPublicArticle(row)) return null;

  const [withAuthor] = await attachAuthors([row]);
  return withAuthor;
}

export async function createArticle(data, authorId) {
  const id = await nextNumericId("articles");
  const now = new Date();
  const doc = stripUndefined({
    id,
    title: data.title,
    content: data.content,
    metadata_title: data.metadata_title || "",
    metadata_description: data.metadata_description || "",
    metadata_image: data.metadata_image || "",
    image: data.image || "",
    category: data.category || "",
    subcategory: data.subcategory || "",
    author_name: data.author_name || "",
    published_at: data.published_at || null,
    language: data.language,
    status: data.status,
    author_id: authorId,
    created_at: now,
    excerpt: data.excerpt || "",
    meta_keywords: data.meta_keywords || "",
    slug: data.slug || "",
    og_title: data.og_title || "",
    og_description: data.og_description || "",
    google_trends_words: data.google_trends_words || [],
  });
  await getDb().collection(COLLECTION).doc(String(id)).set(doc);
  return id;
}

export async function updateArticle(id, data) {
  const patch = stripUndefined({ ...data });
  await getDb().collection(COLLECTION).doc(String(id)).set(patch, { merge: true });
}

export async function deleteArticle(id) {
  await getDb().collection(COLLECTION).doc(String(id)).delete();
}

export async function fetchFilteredForAnalytics(req) {
  const staff = Boolean(req.user?.is_staff);
  let rows = await listArticlesRaw({ analyticsOnly: !staff });
  rows = rows.filter((a) => matchesQuery(a, req.query));
  rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return attachAuthors(rows);
}

export { isPublicArticle, todayDateString };

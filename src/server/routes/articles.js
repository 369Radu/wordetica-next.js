import { Router } from "express";
import multer from "multer";
import { config } from "../config.js";
import { optionalAuth, requireAuth, requireStaff } from "../middleware/auth.js";
import { paginate } from "../lib/pagination.js";
import {
  deleteArticleImage,
  uploadArticleCover,
} from "../lib/articleStorage.js";
import { validateImageBuffer, validateImageExtension } from "../lib/imageValidation.js";
import { getArticleRawById } from "../repositories/articlesRepository.js";
import {
  listArticles,
  getArticleById,
  validateArticleInput,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../services/articles.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploadMaxBytes },
});

function parseBody(req) {
  const body = { ...req.body };
  if (body.published_at === "") body.published_at = null;
  if (body.google_trends_words) {
    try {
      const parsed = typeof body.google_trends_words === "string"
        ? JSON.parse(body.google_trends_words)
        : body.google_trends_words;
      body.google_trends_words = Array.isArray(parsed) ? parsed : [];
    } catch {
      body.google_trends_words = [];
    }
  }
  return body;
}

router.get("/articles/", optionalAuth, async (req, res, next) => {
  try {
    const items = await listArticles(req);
    const base = `${req.protocol}://${req.get("host")}${req.baseUrl}/articles/`;
    req.query._baseUrl = base;
    res.json(paginate(items, req.query));
  } catch (err) {
    next(err);
  }
});

router.get("/articles/:id/", optionalAuth, async (req, res, next) => {
  try {
    const article = await getArticleById(Number(req.params.id), req);
    if (!article) return res.status(404).json({ detail: "Not found." });
    res.json(article);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/articles/",
  requireAuth,
  requireStaff,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const body = parseBody(req);
      const { errors, cleaned } = validateArticleInput(body);
      if (Object.keys(errors).length) return res.status(400).json(errors);

      let imageUrl = "";
      if (req.file) {
        await validateImageBuffer(req.file.buffer, req.file.originalname);
        validateImageExtension(req.file.originalname);
        imageUrl = await uploadArticleCover(req.file.buffer, req.file.originalname);
      }

      const id = await createArticle(
        {
          title: cleaned.title,
          content: cleaned.content,
          metadata_title: (body.metadata_title || "").slice(0, 255),
          metadata_description: body.metadata_description || "",
          metadata_image: body.metadata_image || "",
          image: imageUrl,
          category: cleaned.category || body.category || "",
          subcategory: cleaned.subcategory || body.subcategory || "",
          author_name: (body.author_name || "").trim(),
          published_at: cleaned.publishedAt,
          language: cleaned.language,
          status: cleaned.status,
          excerpt: (body.excerpt || "").slice(0, 320),
          meta_keywords: body.meta_keywords || "",
          slug: (body.slug || "").slice(0, 255),
          og_title: (body.og_title || "").slice(0, 255),
          og_description: (body.og_description || "").slice(0, 320),
          google_trends_words: body.google_trends_words || [],
        },
        req.user.id,
      );

      const article = await getArticleById(id, req, { staffOnly: true });
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  },
);

async function patchArticle(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existingRow = await getArticleRawById(id);
    if (!existingRow) return res.status(404).json({ detail: "Not found." });

    const body = parseBody(req);
    const { errors, cleaned } = validateArticleInput(body, existingRow);
    if (Object.keys(errors).length) return res.status(400).json(errors);

    const updates = {};
    if (body.title !== undefined) updates.title = cleaned.title;
    if (body.content !== undefined) updates.content = cleaned.content;
    if (body.metadata_title !== undefined) updates.metadata_title = body.metadata_title;
    if (body.metadata_description !== undefined) updates.metadata_description = body.metadata_description;
    if (body.metadata_image !== undefined) updates.metadata_image = body.metadata_image;
    if (body.category !== undefined) updates.category = body.category;
    if (body.subcategory !== undefined) updates.subcategory = body.subcategory;
    if (body.author_name !== undefined) updates.author_name = body.author_name.trim();
    if (cleaned.publishedAt !== undefined) updates.published_at = cleaned.publishedAt;
    if (cleaned.language) updates.language = cleaned.language;
    if (cleaned.status) updates.status = cleaned.status;
    if (body.excerpt !== undefined) updates.excerpt = (body.excerpt || "").slice(0, 320);
    if (body.meta_keywords !== undefined) updates.meta_keywords = body.meta_keywords || "";
    if (body.slug !== undefined) updates.slug = (body.slug || "").slice(0, 255);
    if (body.og_title !== undefined) updates.og_title = (body.og_title || "").slice(0, 255);
    if (body.og_description !== undefined) updates.og_description = (body.og_description || "").slice(0, 320);
    if (body.google_trends_words !== undefined) updates.google_trends_words = body.google_trends_words || [];

    if (req.file) {
      await validateImageBuffer(req.file.buffer, req.file.originalname);
      validateImageExtension(req.file.originalname);
      updates.image = await uploadArticleCover(req.file.buffer, req.file.originalname);
      if (existingRow.image) {
        await deleteArticleImage(existingRow.image);
      }
    }

    await updateArticle(id, updates);
    const article = await getArticleById(id, req, { staffOnly: true });
    res.json(article);
  } catch (err) {
    next(err);
  }
}

router.patch(
  "/articles/:id/",
  requireAuth,
  requireStaff,
  upload.single("image"),
  patchArticle,
);
router.put(
  "/articles/:id/",
  requireAuth,
  requireStaff,
  upload.single("image"),
  patchArticle,
);

router.delete("/articles/:id/", requireAuth, requireStaff, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await getArticleById(id, req, { staffOnly: true });
    if (!existing) return res.status(404).json({ detail: "Not found." });
    await deleteArticle(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;

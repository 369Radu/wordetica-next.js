import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { requireAuth, requireStaff } from "../middleware/auth.js";
import { sanitizeArticleHtml } from "../lib/sanitizer.js";
import { createArticle } from "../services/articles.js";

const router = Router();

const generateSchema = z.object({
  topic: z.string().min(2).max(300),
  language: z.string().max(10).default("ro"),
  existing_content: z.string().nullable().optional(),
  section_word_counts: z.record(z.number().int()).nullable().optional(),
  save: z.union([z.boolean(), z.string(), z.number()]).optional(),
});

const optimizeSchema = z.object({
  existing_content: z.string().min(10),
  topic: z.string().max(300).nullable().optional(),
  language: z.string().max(10).default("ro"),
  save: z.union([z.boolean(), z.string(), z.number()]).optional(),
});

class AIServiceError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function postAi(path, payload) {
  const url = `${config.aiServiceUrl}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.aiServiceTimeoutMs);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) {
      let detail = "AI service error.";
      try {
        const body = await response.json();
        detail = body.detail || detail;
      } catch {
        detail = (await response.text()).slice(0, 300) || detail;
      }
      throw new AIServiceError(detail, response.status >= 500 ? 502 : response.status);
    }
    return response.json();
  } catch (err) {
    if (err instanceof AIServiceError) throw err;
    if (err.name === "AbortError") {
      throw new AIServiceError(
        "Article generation timed out. Try lower word counts per section or try again.",
        504,
      );
    }
    throw new AIServiceError("The AI service is currently unreachable.", 503);
  } finally {
    clearTimeout(timeout);
  }
}

function isSaveTruthy(save) {
  return save === true || save === "true" || save === "True" || save === "1" || save === 1;
}

async function maybeSaveDraft(req, result) {
  if (!isSaveTruthy(req.body?.save)) return null;

  const title = (result.h1 || result.meta_title || "Untitled").trim().slice(0, 255);
  const content = sanitizeArticleHtml(result.article || "");
  if (!content.trim()) return null;

  return createArticle(
    {
      title,
      content,
      metadata_title: (result.meta_title || "").slice(0, 255),
      metadata_description: result.meta_description || "",
      metadata_image: "",
      image: "",
      category: "",
      subcategory: "",
      author_name: "",
      published_at: null,
      language: "ro",
      status: "draft",
    },
    req.user.id,
  );
}

router.post("/ai/generate", requireAuth, requireStaff, async (req, res, next) => {
  try {
    const parsed = generateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());

    const data = parsed.data;
    const result = await postAi("/generate", {
      topic: data.topic,
      language: data.language,
      existing_content: data.existing_content ?? null,
      section_word_counts: data.section_word_counts ?? null,
    });

    const savedId = await maybeSaveDraft(req, result);
    if (savedId != null) result.saved_article_id = savedId;
    res.json(result);
  } catch (err) {
    if (err instanceof AIServiceError) {
      return res.status(err.statusCode).json({ detail: err.message });
    }
    next(err);
  }
});

router.post("/ai/optimize", requireAuth, requireStaff, async (req, res, next) => {
  try {
    const parsed = optimizeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());

    const data = parsed.data;
    const result = await postAi("/optimize", {
      existing_content: data.existing_content,
      topic: data.topic ?? null,
      language: data.language,
    });

    const savedId = await maybeSaveDraft(req, result);
    if (savedId != null) result.saved_article_id = savedId;
    res.json(result);
  } catch (err) {
    if (err instanceof AIServiceError) {
      return res.status(err.statusCode).json({ detail: err.message });
    }
    next(err);
  }
});

export default router;

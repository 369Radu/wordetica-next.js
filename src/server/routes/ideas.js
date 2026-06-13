import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireStaff } from "../middleware/auth.js";
import * as ideasRepo from "../repositories/ideasRepository.js";

const router = Router();

const ideaSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
});

function deriveTitle(body) {
  const firstLine = (body || "").trim().split(/\r?\n/)[0]?.trim() || "";
  if (!firstLine) return "Untitled idea";
  return firstLine.length > 120 ? `${firstLine.slice(0, 117)}...` : firstLine;
}

router.use(requireAuth, requireStaff);

router.get("/ideas/", async (req, res, next) => {
  try {
    const rows = await ideasRepo.listIdeasByAuthor(req.user.id, {
      search: req.query.search,
      ordering: req.query.ordering,
    });
    res.json({ count: rows.length, next: null, previous: null, results: rows });
  } catch (err) {
    next(err);
  }
});

router.post("/ideas/", async (req, res, next) => {
  try {
    const parsed = ideaSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());

    const title = (parsed.data.title || "").trim() || deriveTitle(parsed.data.body);
    const idea = await ideasRepo.createIdea({
      title,
      body: parsed.data.body || "",
      authorId: req.user.id,
    });
    res.status(201).json(idea);
  } catch (err) {
    next(err);
  }
});

router.get("/ideas/:id/", async (req, res, next) => {
  try {
    const idea = await ideasRepo.findIdeaById(req.params.id, req.user.id);
    if (!idea) return res.status(404).json({ detail: "Not found." });
    res.json(idea);
  } catch (err) {
    next(err);
  }
});

async function saveIdea(req, res, next) {
  try {
    const parsed = ideaSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());

    const existing = await ideasRepo.findIdeaById(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ detail: "Not found." });

    const title =
      parsed.data.title !== undefined ? parsed.data.title.trim() : existing.title;
    const body = parsed.data.body !== undefined ? parsed.data.body : existing.body;
    const finalTitle = title.trim() || deriveTitle(body);

    const idea = await ideasRepo.updateIdea(req.params.id, { title: finalTitle, body });
    res.json(idea);
  } catch (err) {
    next(err);
  }
}

router.patch("/ideas/:id/", saveIdea);
router.put("/ideas/:id/", saveIdea);

router.delete("/ideas/:id/", async (req, res, next) => {
  try {
    const ok = await ideasRepo.deleteIdea(req.params.id, req.user.id);
    if (!ok) return res.status(404).json({ detail: "Not found." });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;

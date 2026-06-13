import { Router } from "express";
import { z } from "zod";
import { hashPassword } from "../auth/djangoPassword.js";
import { requireAuth, requireAdmin, serializeUser } from "../middleware/auth.js";
import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  listUsers,
  updateUser,
} from "../repositories/usersRepository.js";

const router = Router();

const createSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  profile_image: z.string().url().nullable().optional(),
  is_staff: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

const updateSchema = createSchema.partial().omit({ password: true }).extend({
  password: z.string().min(8).optional(),
});

router.get("/users/me/", requireAuth, (req, res) => {
  res.json(serializeUser(req.user));
});

router.use(requireAuth, requireAdmin);

router.get("/users/", async (req, res, next) => {
  try {
    const isStaff =
      req.query.is_staff !== undefined ? req.query.is_staff === "true" : undefined;
    const rows = await listUsers({ isStaff, search: req.query.search });
    res.json(rows.map(serializeUser));
  } catch (err) {
    next(err);
  }
});

router.post("/users/", async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());

    const d = parsed.data;
    if (await findUserByEmail(d.email)) {
      return res.status(400).json({ email: ["A user with this email already exists."] });
    }
    const user = await createUser({
      email: d.email,
      password: hashPassword(d.password),
      first_name: d.first_name,
      last_name: d.last_name,
      profile_image: d.profile_image ?? null,
      is_staff: d.is_staff,
      is_superuser: d.is_superuser,
      is_active: d.is_active,
    });
    res.status(201).json(serializeUser(user));
  } catch (err) {
    if (err.code === 6 || err.message?.includes("ALREADY_EXISTS")) {
      return res.status(400).json({ email: ["A user with this email already exists."] });
    }
    next(err);
  }
});

router.get("/users/:id/", async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ detail: "Not found." });
    res.json(serializeUser(user));
  } catch (err) {
    next(err);
  }
});

async function updateUserHandler(req, res, next) {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());

    const id = Number(req.params.id);
    const existing = await findUserById(id);
    if (!existing) return res.status(404).json({ detail: "Not found." });

    if (id === req.user.id) {
      const d = parsed.data;
      if (d.is_staff === false || d.is_active === false) {
        return res.status(403).json({
          detail: "You cannot remove staff status or deactivate your own account.",
        });
      }
    }

    const patch = { ...parsed.data };
    if (patch.password) patch.password = hashPassword(patch.password);
    const user = await updateUser(id, patch);
    res.json(serializeUser(user));
  } catch (err) {
    next(err);
  }
}

router.patch("/users/:id/", updateUserHandler);
router.put("/users/:id/", updateUserHandler);

router.delete("/users/:id/", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (id === req.user.id) {
      return res.status(403).json({ detail: "You cannot delete your own account." });
    }
    const existing = await findUserById(id);
    if (!existing) return res.status(404).json({ detail: "Not found." });
    await deleteUser(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;

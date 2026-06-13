import { Router } from "express";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { z } from "zod";
import { verifyPassword } from "../auth/djangoPassword.js";
import {
  invalidLoginError,
  loginLockedError,
  LoginAPIError,
} from "../auth/loginErrors.js";
import { signTokens, verifyAccessToken, verifyRefreshToken } from "../auth/jwt.js";
import { config } from "../config.js";
import {
  findUserByEmail,
  findUserById,
  updateUser,
} from "../repositories/usersRepository.js";
import { serializeUser } from "../middleware/auth.js";

const router = Router();

const rateLimitBase = {
  standardHeaders: true,
  validate: { trustProxy: false },
};

const loginLimiter = rateLimit({ ...rateLimitBase, windowMs: 60_000, max: 10 });
const unlockLimiter = rateLimit({ ...rateLimitBase, windowMs: 60_000, max: 5 });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const unlockSchema = z.object({
  email: z.string().email(),
  unlock_key: z.string().min(1),
});

const refreshSchema = z.object({
  refresh: z.string().min(1),
});

router.post("/login/", loginLimiter, async (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ detail: "Invalid request." });
  }

  const { email, password } = parsed.data;
  const maxAttempts = config.maxLoginAttempts;

  try {
    const user = await findUserByEmail(email.trim());
    const activeUser = user?.is_active ? user : null;

    if (activeUser && (activeUser.force_password_reset || activeUser.failed_login_attempts >= maxAttempts)) {
      if (activeUser.failed_login_attempts >= maxAttempts && !activeUser.force_password_reset) {
        await updateUser(activeUser.id, { force_password_reset: true });
      }
      throw loginLockedError(activeUser.email, maxAttempts);
    }

    if (!activeUser || !verifyPassword(password, activeUser.password)) {
      if (activeUser) {
        const attempts = activeUser.failed_login_attempts + 1;
        await updateUser(activeUser.id, {
          failed_login_attempts: attempts,
          force_password_reset: attempts >= maxAttempts,
        });
        const remaining = Math.max(0, maxAttempts - attempts);
        if (attempts >= maxAttempts) throw loginLockedError(activeUser.email, maxAttempts);
        throw invalidLoginError(remaining, maxAttempts);
      }
      throw invalidLoginError(null, maxAttempts);
    }

    await updateUser(activeUser.id, {
      failed_login_attempts: 0,
      force_password_reset: false,
      last_login: new Date(),
    });

    const tokens = signTokens(activeUser);
    return res.json({
      access: tokens.access,
      refresh: tokens.refresh,
      user: serializeUser(activeUser),
    });
  } catch (err) {
    if (err instanceof LoginAPIError) {
      return res.status(err.statusCode).json(err.payload);
    }
    return next(err);
  }
});

router.post("/refresh/", async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ detail: "Refresh token required." });
  }
  try {
    const payload = verifyRefreshToken(parsed.data.refresh);
    const user = await findUserById(payload.user_id);
    if (!user?.is_active) {
      return res.status(401).json({ detail: "User not found.", code: "token_not_valid" });
    }
    const tokens = signTokens(user);
    return res.json({ access: tokens.access, refresh: tokens.refresh });
  } catch {
    return res.status(401).json({ detail: "Token is invalid or expired", code: "token_not_valid" });
  }
});

router.post("/verify/", async (req, res) => {
  const token = req.body?.token;
  if (!token) return res.status(400).json({ detail: "Token required." });
  try {
    try {
      verifyAccessToken(token);
    } catch {
      verifyRefreshToken(token);
    }
    return res.json({});
  } catch {
    return res.status(401).json({ detail: "Token is invalid or expired", code: "token_not_valid" });
  }
});

router.post("/unlock/", unlockLimiter, async (req, res) => {
  const parsed = unlockSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const expected = config.accountUnlockKey || "";
  const provided = (parsed.data.unlock_key || "").trim();
  const a = Buffer.from(provided.toLowerCase());
  const b = Buffer.from(String(expected).toLowerCase());
  if (!expected || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(400).json({ unlock_key: ["Invalid unlock key."] });
  }

  const user = await findUserByEmail(parsed.data.email.trim());
  if (!user?.is_active) {
    return res.status(400).json({ email: ["Unknown account."] });
  }

  const locked =
    user.force_password_reset || user.failed_login_attempts >= config.maxLoginAttempts;
  if (!locked) {
    return res.status(400).json({ detail: "This account is not locked." });
  }

  await updateUser(user.id, { failed_login_attempts: 0, force_password_reset: false });

  return res.json({
    detail: "Account unlocked. You can sign in again with your password.",
  });
});

export default router;

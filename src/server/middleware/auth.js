import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../auth/jwt.js";
import { findUserById } from "../repositories/usersRepository.js";

export async function optionalAuth(req, _res, next) {
  req.user = null;
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();

  try {
    const payload = verifyAccessToken(token);
    req.user = await findUserById(payload.user_id);
  } catch {
    req.user = null;
  }
  next();
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ detail: "Authentication credentials were not provided." });
  }
  try {
    const payload = verifyAccessToken(token);
    const user = await findUserById(payload.user_id);
    if (!user || !user.is_active) {
      return res.status(401).json({ detail: "User not found or inactive." });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ detail: "Token is invalid or expired", code: "token_not_valid" });
    }
    return res.status(401).json({ detail: "Token is invalid or expired", code: "token_not_valid" });
  }
}

export function requireStaff(req, res, next) {
  if (!req.user?.is_staff) {
    return res.status(403).json({ detail: "You do not have permission to perform this action." });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user?.is_staff) {
    return res.status(403).json({ detail: "You do not have permission to perform this action." });
  }
  next();
}

export function serializeUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    profile_image: row.profile_image,
    is_staff: Boolean(row.is_staff),
    is_superuser: Boolean(row.is_superuser),
    is_active: Boolean(row.is_active),
    date_joined: row.date_joined,
  };
}

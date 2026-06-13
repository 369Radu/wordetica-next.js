import jwt from "jsonwebtoken";
import { config } from "../config.js";

function accessLifetimeSeconds() {
  return config.jwtAccessMinutes * 60;
}

function refreshLifetimeSeconds() {
  return config.jwtRefreshDays * 24 * 60 * 60;
}

/**
 * @param {{ id: number, email: string, is_staff: boolean, is_superuser: boolean }} user
 */
export function signTokens(user) {
  const base = {
    user_id: user.id,
    email: user.email,
    is_staff: Boolean(user.is_staff),
    is_superuser: Boolean(user.is_superuser),
  };

  const access = jwt.sign(
    { ...base, token_type: "access" },
    config.secretKey,
    { expiresIn: accessLifetimeSeconds() },
  );

  const refresh = jwt.sign(
    { ...base, token_type: "refresh" },
    config.secretKey,
    { expiresIn: refreshLifetimeSeconds() },
  );

  return { access, refresh };
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, config.secretKey);
  if (payload.token_type !== "access") {
    throw new jwt.JsonWebTokenError("Invalid token type");
  }
  return payload;
}

export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, config.secretKey);
  if (payload.token_type !== "refresh") {
    throw new jwt.JsonWebTokenError("Invalid token type");
  }
  return payload;
}

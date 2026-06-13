import crypto from "crypto";

const ITERATIONS = 600000;

/** Hash a password in Django-compatible pbkdf2_sha256 format. */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("base64").slice(0, 22);
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256")
    .toString("base64");
  return `pbkdf2_sha256$${ITERATIONS}$${salt}$${hash}`;
}

/** Verify a plain password against a Django-stored hash. */
export function verifyPassword(password, encoded) {
  if (!encoded || !encoded.startsWith("pbkdf2_sha256$")) return false;
  const parts = encoded.split("$");
  if (parts.length !== 4) return false;
  const iterations = Number.parseInt(parts[1], 10);
  const salt = parts[2];
  const expected = parts[3];
  if (!iterations || !salt || !expected) return false;

  const derived = crypto
    .pbkdf2Sync(password, salt, iterations, 32, "sha256")
    .toString("base64");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(derived, "utf8"),
    );
  } catch {
    return false;
  }
}

import { ApiError } from "@/lib/api/http";
import type { LoginErrorBody } from "@/types/auth";

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** Normalise login error payloads from the API (handles stringified numbers). */
export function parseLoginError(err: ApiError): LoginErrorBody {
  const raw = (err.error ?? {}) as Record<string, unknown>;
  const nested =
    raw["detail"] && typeof raw["detail"] === "object" && !Array.isArray(raw["detail"])
      ? (raw["detail"] as Record<string, unknown>)
      : null;
  const source = nested ?? raw;

  return {
    detail: typeof source["detail"] === "string" ? source["detail"] : undefined,
    code:
      source["code"] === "invalid_credentials" || source["code"] === "account_locked"
        ? source["code"]
        : undefined,
    attempts_remaining: readNumber(source["attempts_remaining"]) ?? undefined,
    max_attempts: readNumber(source["max_attempts"]) ?? undefined,
    email: typeof source["email"] === "string" ? source["email"] : undefined,
  };
}

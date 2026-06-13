import type { AuthSession } from "@/types/auth";

/**
 * Shared auth session storage. JWTs are kept in `localStorage` under the same
 * key the original Angular app used (`wordetica.auth`) so behaviour (survive
 * reloads, same XSS trade-offs) is identical. A custom event lets the React
 * AuthProvider and the fetch layer stay in sync when either updates the token.
 */
export const STORAGE_KEY = "wordetica.auth";
export const SESSION_EVENT = "wordetica.auth.change";

export function readSession(): AuthSession | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (!parsed.access || !parsed.refresh || !parsed.user) return null;
    return parsed as AuthSession;
  } catch {
    return null;
  }
}

export function writeSession(session: AuthSession): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    emitChange();
  } catch {
    // Storage might be unavailable (private mode); session stays in memory.
  }
}

export function clearSession(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  emitChange();
}

function emitChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_EVENT));
  }
}

import { API_BASE_URL, BACKEND_URL } from "@/lib/config";
import {
  clearSession,
  readSession,
  writeSession,
} from "@/lib/auth/session";
import type { RefreshResponse } from "@/types/auth";

const AUTH_FREE_PATHS = ["/auth/login/", "/auth/refresh/", "/auth/unlock/"];

/** Mirrors Angular `HttpErrorResponse`: `.status` + parsed `.error` body. */
export class ApiError<T = unknown> extends Error {
  status: number;
  error: T;
  constructor(status: number, error: T, message?: string) {
    super(message ?? `HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.error = error;
  }
}

export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/api/")) return path; // already absolute app path (e.g. /api/contact)
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function shouldAttachToken(url: string): boolean {
  return (
    url.startsWith(API_BASE_URL) ||
    (!!BACKEND_URL && url.startsWith(BACKEND_URL)) ||
    url.includes("/api/")
  );
}

function isAuthEndpoint(url: string): boolean {
  return AUTH_FREE_PATHS.some((p) => url.includes(p));
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const session = readSession();
  if (!session) return null;
  const res = await fetch(apiUrl("/auth/refresh/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: session.refresh }),
  });
  if (!res.ok) {
    clearSession();
    throw new ApiError(res.status, await parseBody(res));
  }
  const data = (await res.json()) as RefreshResponse;
  writeSession({
    ...session,
    access: data.access,
    refresh: data.refresh ?? session.refresh,
  });
  return data.access;
}

function redirectToLogin(reason?: string): void {
  if (typeof window === "undefined") return;
  const url = reason ? `/login?reason=${encodeURIComponent(reason)}` : "/login";
  window.location.assign(url);
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | null;
}

async function doFetch(url: string, init: RequestOptions, token: string | null): Promise<Response> {
  const headers = new Headers(init.headers);
  if (token && shouldAttachToken(url) && !isAuthEndpoint(url)) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, { ...init, headers });
}

/**
 * Core request used by every API module. Reproduces the original
 * `authInterceptor`: attach Bearer token, transparently refresh on 401 and
 * retry once, redirect to /login on refresh failure or 403.
 */
export async function request<T = unknown>(
  path: string,
  init: RequestOptions = {},
): Promise<T> {
  const url = apiUrl(path);
  const session = readSession();
  const token = session?.access ?? null;

  let res = await doFetch(url, init, token);

  if (
    res.status === 401 &&
    session?.refresh &&
    !isAuthEndpoint(url)
  ) {
    try {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        clearSession();
        redirectToLogin();
        throw new ApiError(res.status, await parseBody(res));
      }
      res = await doFetch(url, init, newToken);
    } catch (err) {
      clearSession();
      redirectToLogin();
      throw err;
    }
  }

  if (res.status === 403) {
    redirectToLogin("forbidden");
  }

  if (!res.ok) {
    throw new ApiError(res.status, await parseBody(res));
  }

  return (await parseBody(res)) as T;
}

export function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

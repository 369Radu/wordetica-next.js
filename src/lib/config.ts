/**
 * Frontend runtime configuration.
 *
 * In the merged Next.js app the API is served from the same origin under
 * `/api`, so the base URL is relative by default (equivalent to the original
 * Angular `environment.apiBaseUrl` which pointed at the standalone backend).
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api"
).replace(/\/$/, "");

export const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL || ""
).replace(/\/$/, "");

export const APP_NAME = "Wordetica";

import { config } from "../config.js";

/** Build absolute URL for media paths returned in API JSON. */
export function absoluteUrl(url, req) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const path = url.startsWith("/") ? url : `/${url}`;
  if (req) {
    const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
    const host = req.headers["x-forwarded-host"] || req.get("host");
    if (host) return `${proto}://${host}${path}`;
  }
  return `${config.publicBaseUrl}${path}`;
}

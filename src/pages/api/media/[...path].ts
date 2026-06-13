import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
// @ts-expect-error - JS ESM backend module without type declarations
import { config } from "@/server/config.js";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

/**
 * Serves locally-stored media (mirrors the original Express `/media` static
 * mount). Production cover images are served directly from Firebase Storage
 * via absolute URLs, so this only matters for local/legacy files.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const segments = ([] as string[]).concat((req.query.path as string[]) ?? []);
  const mediaRoot: string = config.mediaRoot;
  const target = path.join(mediaRoot, ...segments);

  // Prevent path traversal outside the media root.
  if (!path.resolve(target).startsWith(path.resolve(mediaRoot))) {
    res.status(403).end();
    return;
  }

  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    res.status(404).json({ detail: "Not found." });
    return;
  }

  const ext = path.extname(target).toLowerCase();
  res.setHeader("Content-Type", CONTENT_TYPES[ext] ?? "application/octet-stream");
  res.setHeader("Cache-Control", "public, max-age=86400");
  fs.createReadStream(target).pipe(res);
}

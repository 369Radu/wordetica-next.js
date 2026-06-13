import crypto from "crypto";
import fs from "fs";
import path from "path";
import { config } from "../config.js";
import { getStorageBucket } from "../firebase.js";
import { validateImageExtension } from "./imageValidation.js";
import { absoluteUrl } from "./urls.js";

const MIME_BY_EXT = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jpe: "image/jpeg",
  jfif: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  dib: "image/bmp",
  tif: "image/tiff",
  tiff: "image/tiff",
  ico: "image/x-icon",
  heic: "image/heic",
  heif: "image/heif",
  avif: "image/avif",
  svg: "image/svg+xml",
  apng: "image/apng",
};

function contentTypeForExt(ext) {
  return MIME_BY_EXT[ext] || "application/octet-stream";
}

function sanitizeFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]+/g, "-");
  return `${base || "cover"}-${Date.now()}${ext}`;
}

function coverObjectPath(originalName) {
  const now = new Date();
  const filename = sanitizeFilename(originalName);
  return `articles/covers/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${filename}`;
}

export function buildFirebaseDownloadUrl(bucketName, objectPath, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
}

/** @param {string | null | undefined} value */
export function isRemoteImageUrl(value) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

/** @param {string} value */
export function extractStorageObjectPath(value) {
  if (!value) return null;

  const firebaseMatch = value.match(
    /firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/([^?]+)/i,
  );
  if (firebaseMatch) {
    return decodeURIComponent(firebaseMatch[1]);
  }

  const gcsMatch = value.match(/storage\.googleapis\.com\/[^/]+\/(.+)$/i);
  if (gcsMatch) {
    return decodeURIComponent(gcsMatch[1]);
  }

  return null;
}

/**
 * Upload an article cover to Firebase Storage.
 * @param {Buffer} buffer
 * @param {string} originalName
 */
export async function uploadArticleCover(buffer, originalName) {
  const ext = validateImageExtension(originalName);
  const objectPath = coverObjectPath(originalName);
  const bucket = getStorageBucket();
  const token = crypto.randomUUID();

  await bucket.file(objectPath).save(buffer, {
    metadata: {
      contentType: contentTypeForExt(ext),
      cacheControl: "public, max-age=31536000",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  return buildFirebaseDownloadUrl(bucket.name, objectPath, token);
}

/** @param {string | null | undefined} imageValue */
export async function deleteArticleImage(imageValue) {
  if (!imageValue) return;

  const objectPath = extractStorageObjectPath(imageValue);
  if (objectPath) {
    await getStorageBucket()
      .file(objectPath)
      .delete()
      .catch((err) => {
        if (err?.code !== 404) throw err;
      });
    return;
  }

  if (isRemoteImageUrl(imageValue)) return;

  const localPath = path.join(config.mediaRoot, imageValue.replace(/^\/+/, ""));
  if (fs.existsSync(localPath)) {
    fs.unlinkSync(localPath);
  }
}

/** Resolve stored image value to a public URL in API responses. */
export function resolveArticleImageUrl(image, req) {
  if (!image) return "";
  if (isRemoteImageUrl(image)) return image;
  const imagePath = `/media/${image.replace(/^\/+/, "")}`;
  return absoluteUrl(imagePath, req);
}

import path from "path";
import { fileTypeFromBuffer } from "file-type";

const ALLOWED_EXTENSIONS = new Set([
  "jpg", "jpeg", "jpe", "jfif", "png", "gif", "webp", "bmp", "dib", "tif",
  "tiff", "ico", "heic", "heif", "avif", "svg", "apng",
]);

const SKIP_MAGIC_CHECK = new Set(["svg", "ico"]);

export function validateImageExtension(filename) {
  const ext = path.extname(filename).toLowerCase().replace(/^\./, "");
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(
      "Unsupported image format. Allowed: JPG, JPEG, PNG, GIF, WEBP, BMP, TIFF, ICO, HEIC, HEIF, AVIF, SVG and similar.",
    );
  }
  return ext;
}

/** @param {Buffer} buffer @param {string} filename */
export async function validateImageBuffer(buffer, filename) {
  const ext = validateImageExtension(filename);
  if (SKIP_MAGIC_CHECK.has(ext)) return;
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !detected.mime.startsWith("image/")) {
    throw new Error("The uploaded file is not a valid image.");
  }
}

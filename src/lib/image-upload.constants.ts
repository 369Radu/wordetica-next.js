/** Extensions accepted for article cover uploads (must match backend). */
export const ARTICLE_IMAGE_ACCEPT =
  'image/*,.jpg,.jpeg,.jpe,.jfif,.png,.gif,.webp,.bmp,.dib,.tif,.tiff,.ico,.heic,.heif,.avif,.svg,.apng';

export const ARTICLE_IMAGE_EXTENSIONS = [
  'jpg',
  'jpeg',
  'jpe',
  'jfif',
  'png',
  'gif',
  'webp',
  'bmp',
  'dib',
  'tif',
  'tiff',
  'ico',
  'heic',
  'heif',
  'avif',
  'svg',
  'apng',
] as const;

export const ARTICLE_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

export function isAllowedArticleImage(file: File): boolean {
  const name = file.name.toLowerCase();
  const ext = name.includes('.') ? name.split('.').pop() ?? '' : '';
  if (ext && (ARTICLE_IMAGE_EXTENSIONS as readonly string[]).includes(ext)) {
    return true;
  }
  return file.type.startsWith('image/');
}

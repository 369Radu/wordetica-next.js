/**
 * Use cover image URLs from the API as-is when they are already absolute.
 * Only relative `/media/...` paths are prefixed with the current site origin.
 */
export function resolveArticleImageUrl(
  url: string | null | undefined,
  cacheBust?: string | number | null,
): string {
  const trimmed = url?.trim() ?? '';
  if (!trimmed) {
    return '';
  }

  let resolved: string;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    resolved = trimmed;
  } else if (trimmed.startsWith('/')) {
    resolved =
      typeof window !== 'undefined'
        ? `${window.location.origin}${trimmed}`
        : trimmed;
  } else {
    const path = `/${trimmed.replace(/^\/+/, '')}`;
    resolved =
      typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
  }

  if (cacheBust == null || String(cacheBust).length === 0) {
    return resolved;
  }

  const base = resolved.split('#')[0];
  const hash = resolved.includes('#') ? resolved.slice(resolved.indexOf('#')) : '';
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}v=${encodeURIComponent(String(cacheBust))}${hash}`;
}

/** Optional cache-bust for admin preview after re-upload (not used on public pages). */
export function articleCoverCacheKey(article: { id: number }): string {
  return String(article.id);
}

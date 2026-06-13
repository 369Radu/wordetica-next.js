/** Default cover images per article category (files under src/assets/category-covers/). */

/** Bump when replacing files under assets/category-covers/ so browsers reload. */
const CATEGORY_COVER_VERSION = '20260530b';

export const CATEGORY_COVER_ASSETS: Readonly<Record<string, string>> = {
  'teaching-learning-age-of-ai': `assets/category-covers/teaching-learning-age-of-ai.png?v=${CATEGORY_COVER_VERSION}`,
  'academic-writing-research-age-of-ai': `assets/category-covers/academic-writing-research-age-of-ai.png?v=${CATEGORY_COVER_VERSION}`,
  'neurodiversity-inclusion-age-of-ai': `assets/category-covers/neurodiversity-inclusion-age-of-ai.png?v=${CATEGORY_COVER_VERSION}`,
  'localization-age-of-ai': `assets/category-covers/localization-age-of-ai.png?v=${CATEGORY_COVER_VERSION}`,
};

export function getCategoryCoverAssetPath(categorySlug: string): string | null {
  return CATEGORY_COVER_ASSETS[categorySlug] ?? null;
}

export async function fetchCategoryCoverFile(categorySlug: string): Promise<File | null> {
  const assetPath = getCategoryCoverAssetPath(categorySlug);
  if (!assetPath) return null;

  const response = await fetch(assetPath);
  if (!response.ok) return null;

  const blob = await response.blob();
  const filename = (assetPath.split('/').pop() ?? 'category-cover.png').split('?')[0];
  return new File([blob], filename, { type: blob.type || 'image/png' });
}

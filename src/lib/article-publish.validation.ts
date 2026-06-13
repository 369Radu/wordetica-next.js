/** Publish / schedule readiness checks for the article editor. */

export interface PublishCheckItem {
  id: string;
  label: string;
  /** Element id to scroll to and focus. */
  anchorId: string;
}

export interface PublishValidationInput {
  title: string;
  authorName: string;
  language: string;
  category: string;
  subcategory: string;
  contentHtml: string;
  excerpt: string;
  metaDescription: string;
  hasCoverImage: boolean;
  canonicalUrlInvalid: boolean;
}

const MIN_TEXT = 20;

export function plainTextFromHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

export function getPublishBlockers(input: PublishValidationInput): PublishCheckItem[] {
  const items: PublishCheckItem[] = [];

  if (!input.title.trim()) {
    items.push({ id: 'title', label: 'Title is required', anchorId: 'title' });
  }

  if (!input.authorName.trim()) {
    items.push({ id: 'authorName', label: 'Author name is required', anchorId: 'authorName' });
  }

  if (!input.language.trim()) {
    items.push({
      id: 'language',
      label: 'Select the article language (EN, FR, RO, or ES)',
      anchorId: 'section-language',
    });
  }

  if (!input.category.trim()) {
    items.push({ id: 'category', label: 'Choose a category', anchorId: 'category' });
  }

  if (!input.subcategory.trim()) {
    items.push({ id: 'subcategory', label: 'Choose a subcategory', anchorId: 'subcategory' });
  }

  const contentLen = plainTextFromHtml(input.contentHtml).length;
  if (contentLen < MIN_TEXT) {
    items.push({
      id: 'content',
      label: `Article content must be at least ${MIN_TEXT} characters`,
      anchorId: 'section-content',
    });
  }

  const excerptLen = input.excerpt.trim().length;
  const metaDescLen = input.metaDescription.trim().length;
  if (excerptLen < MIN_TEXT && metaDescLen < MIN_TEXT) {
    items.push({
      id: 'excerpt',
      label: 'Add an excerpt or meta description (at least 20 characters) for listings and search',
      anchorId: 'excerpt',
    });
  }

  if (!input.hasCoverImage) {
    items.push({
      id: 'coverImage',
      label: 'Upload a cover image',
      anchorId: 'coverImage',
    });
  }

  if (input.canonicalUrlInvalid) {
    items.push({
      id: 'canonicalUrl',
      label: 'Fix the canonical URL (must be a valid http/https link)',
      anchorId: 'canonical',
    });
  }

  return items;
}

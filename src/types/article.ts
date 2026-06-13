export interface ArticleSubcategory {
  value: string;
  label: string;
}

export interface ArticleCategoryGroup {
  value: string;
  label: string;
  subcategories: ArticleSubcategory[];
}

export const ARTICLE_CATEGORY_TREE: readonly ArticleCategoryGroup[] = [
  {
    value: 'teaching-learning-age-of-ai',
    label: 'Teaching & Learning in the Age of AI',
    subcategories: [
      {
        value: 'learning-design-pedagogy-assessment',
        label: 'Language Learning Design, Pedagogy & Assessment',
      },
      {
        value: 'human-centered-edtech-genai-agentic-ai',
        label: 'Human-centered EdTech, GenAI & Agentic AI',
      },
      {
        value: 'lifelong-learning-upskilling-future-ready-skills',
        label: 'Lifelong Learning, Upskilling & Future-Ready Skills',
      },
    ],
  },
  {
    value: 'academic-writing-research-age-of-ai',
    label: 'Academic Writing & Research Communication in the Age of AI',
    subcategories: [
      {
        value: 'scholarly-writing-academic-communication',
        label: 'Scholarly Writing & Academic Communication',
      },
      {
        value: 'research-methods-literature-reviews-reference-management',
        label: 'Research Methods, Literature Reviews & Reference Management',
      },
      {
        value: 'ai-assisted-research-publishing-research-impact',
        label: 'AI-Assisted Research, Publishing & Research Impact',
      },
    ],
  },
  {
    value: 'neurodiversity-inclusion-age-of-ai',
    label: 'Neurodiversity & Inclusion in the Age of AI',
    subcategories: [
      {
        value: 'neurodiversity-ai-enhanced-learning',
        label: 'Neurodiversity & AI-Enhanced Learning',
      },
      {
        value: 'inclusive-design-accessibility-communication',
        label: 'Inclusive Design, Accessibility & Communication',
      },
      {
        value: 'workplace-inclusion-learning-assistive-ai',
        label: 'Workplace Inclusion, Learning & Assistive AI',
      },
    ],
  },
  {
    value: 'localization-age-of-ai',
    label: 'Localization in the Age of AI',
    subcategories: [
      {
        value: 'ai-assisted-translation-localization',
        label: 'AI-Assisted Translation & Localization',
      },
      {
        value: 'cross-cultural-communication-global-content-strategy',
        label: 'Cross-Cultural Communication & Global Content Strategy',
      },
      {
        value: 'localized-user-experience-intelligent-personalization',
        label: 'Localized User Experience & Intelligent Personalization',
      },
    ],
  },
] as const;

/** @deprecated Use ARTICLE_CATEGORY_TREE */
export const ARTICLE_CATEGORIES = ARTICLE_CATEGORY_TREE.map(({ value, label }) => ({
  value,
  label,
}));

export function getSubcategoriesForCategory(categorySlug: string): ArticleSubcategory[] {
  return ARTICLE_CATEGORY_TREE.find((c) => c.value === categorySlug)?.subcategories ?? [];
}

export function getCategoryLabel(categorySlug: string): string {
  return ARTICLE_CATEGORY_TREE.find((c) => c.value === categorySlug)?.label ?? categorySlug;
}

export function getSubcategoryLabel(categorySlug: string, subcategorySlug: string): string {
  const cat = ARTICLE_CATEGORY_TREE.find((c) => c.value === categorySlug);
  return cat?.subcategories.find((s) => s.value === subcategorySlug)?.label ?? subcategorySlug;
}

export type ArticleStatus = 'draft' | 'scheduled' | 'published';

export type ArticleLanguage = 'en' | 'fr' | 'ro' | 'es';

export interface ArticleLanguageOption {
  code: ArticleLanguage;
  label: string;
  labelRo: string;
}

export const ARTICLE_LANGUAGES: readonly ArticleLanguageOption[] = [
  { code: 'en', label: 'English', labelRo: 'Engleză' },
  { code: 'fr', label: 'French', labelRo: 'Franceză' },
  { code: 'ro', label: 'Romanian', labelRo: 'Română' },
  { code: 'es', label: 'Spanish', labelRo: 'Spaniolă' },
] as const;

export interface Article {
  id: number;
  title: string;
  content: string;
  metadata_title: string;
  metadata_description: string;
  metadata_image: string;
  image: string;
  category: string;
  subcategory: string;
  language: ArticleLanguage;
  status: ArticleStatus;
  author_name: string;
  published_at: string | null;
  created_at: string;
  author: number;
  author_email: string;
  author_full_name: string;
  author_display_name: string;
  excerpt: string;
  meta_keywords: string;
  slug: string;
  og_title: string;
  og_description: string;
  google_trends_words: string[];
}

export interface ArticleCreatePayload {
  title: string;
  content: string;
  metadata_title?: string;
  metadata_description?: string;
  metadata_image?: string;
  image?: File | null;
  category?: string;
  subcategory?: string;
  author_name?: string;
  published_at?: string | null;
  language?: ArticleLanguage;
  status?: ArticleStatus;
  excerpt?: string;
  meta_keywords?: string;
  slug?: string;
  og_title?: string;
  og_description?: string;
  google_trends_words?: string[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function getArticleDisplayDate(article: Article): string {
  return article.published_at ?? article.created_at;
}

export function getArticleAuthorName(article: Article): string {
  const name = article.author_display_name?.trim();
  if (name) return name;
  const custom = article.author_name?.trim();
  if (custom) return custom;
  const full = article.author_full_name?.trim();
  if (full) return full;
  if (article.author_email) return article.author_email;
  return 'Wordetica';
}

export function getArticleLanguageLabel(code: ArticleLanguage | string): string {
  return ARTICLE_LANGUAGES.find((l) => l.code === code)?.label ?? code;
}

export function getArticleLanguageLabelRo(code: ArticleLanguage | string): string {
  return ARTICLE_LANGUAGES.find((l) => l.code === code)?.labelRo ?? code;
}


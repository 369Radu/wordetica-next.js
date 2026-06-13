export interface CategoryCount {
  category: string;
  label: string;
  count: number;
}

export interface SubcategoryCount {
  category: string;
  category_label: string;
  subcategory: string;
  subcategory_label: string;
  count: number;
}

export interface LanguageCount {
  language: string;
  label: string;
  count: number;
}

export interface TimelinePoint {
  year: number;
  month: number;
  label: string;
  count: number;
}

export interface AnalyticsArticle {
  id: number;
  title: string;
  category: string;
  category_label: string;
  subcategory: string;
  subcategory_label: string;
  language: string;
  status: 'draft' | 'scheduled' | 'published';
  published_at: string | null;
  created_at: string;
  author_display_name: string;
}

export interface DrilldownFilter {
  category?: string | null;
  category_label?: string | null;
  subcategory?: string | null;
  subcategory_label?: string | null;
  language?: string | null;
  month?: number | null;
  year?: number | null;
}

export interface DrilldownResponse {
  filter: DrilldownFilter;
  count: number;
  results: AnalyticsArticle[];
}

export interface UnusedCategory {
  category: string;
  label: string;
}

export interface UnusedSubcategory {
  category: string;
  category_label: string;
  subcategory: string;
  subcategory_label: string;
}

export interface UnusedResponse {
  categories: UnusedCategory[];
  subcategories: UnusedSubcategory[];
}

export interface GroupedSubcategory {
  subcategory: string;
  subcategory_label: string;
  count: number;
  articles: AnalyticsArticle[];
}

export interface GroupedCategory {
  category: string;
  category_label: string;
  count: number;
  subcategories: GroupedSubcategory[];
}

export interface AnalyticsFilters {
  year?: number | null;
  month?: number | null;
  category?: string | null;
  language?: string | null;
}

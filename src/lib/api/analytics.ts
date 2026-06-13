import { buildQuery, request } from "@/lib/api/http";
import type {
  AnalyticsArticle,
  AnalyticsFilters,
  CategoryCount,
  DrilldownFilter,
  DrilldownResponse,
  GroupedCategory,
  LanguageCount,
  SubcategoryCount,
  TimelinePoint,
  UnusedResponse,
} from "@/types/analytics";

function toQuery(values: Record<string, unknown>): string {
  const params: Record<string, string | number | undefined | null> = {};
  for (const [key, value] of Object.entries(values)) {
    if (value === null || value === undefined || value === "") continue;
    params[key] = String(value);
  }
  return buildQuery(params);
}

export const AnalyticsApi = {
  perCategory(filters: AnalyticsFilters = {}): Promise<CategoryCount[]> {
    return request<CategoryCount[]>(
      `/analytics/articles-per-category${toQuery(filters as Record<string, unknown>)}`,
    );
  },
  perSubcategory(filters: AnalyticsFilters = {}): Promise<SubcategoryCount[]> {
    return request<SubcategoryCount[]>(
      `/analytics/articles-per-subcategory${toQuery(filters as Record<string, unknown>)}`,
    );
  },
  perLanguage(filters: AnalyticsFilters = {}): Promise<LanguageCount[]> {
    return request<LanguageCount[]>(
      `/analytics/articles-per-language${toQuery(filters as Record<string, unknown>)}`,
    );
  },
  timeline(filters: AnalyticsFilters = {}): Promise<TimelinePoint[]> {
    return request<TimelinePoint[]>(
      `/analytics/timeline${toQuery(filters as Record<string, unknown>)}`,
    );
  },
  drilldown(filter: DrilldownFilter): Promise<DrilldownResponse> {
    return request<DrilldownResponse>(
      `/analytics/drilldown${toQuery(filter as Record<string, unknown>)}`,
    );
  },
  filterByMonth(
    year: number,
    month: number,
  ): Promise<{ count: number; results: AnalyticsArticle[] }> {
    return request<{ count: number; results: AnalyticsArticle[] }>(
      `/articles/filter${toQuery({ year, month })}`,
    );
  },
  grouped(filters: AnalyticsFilters = {}): Promise<GroupedCategory[]> {
    return request<GroupedCategory[]>(
      `/articles/grouped${toQuery(filters as Record<string, unknown>)}`,
    );
  },
  unused(filters: AnalyticsFilters = {}): Promise<UnusedResponse> {
    return request<UnusedResponse>(
      `/categories/unused${toQuery(filters as Record<string, unknown>)}`,
    );
  },
};

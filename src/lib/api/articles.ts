import { buildQuery, request } from "@/lib/api/http";
import type {
  Article,
  ArticleCreatePayload,
  ArticleLanguage,
  ArticleStatus,
  PaginatedResponse,
} from "@/types/article";

export interface ArticleQuery {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  subcategory?: string;
  language?: ArticleLanguage;
  status?: ArticleStatus;
  ordering?: string;
}

function toFormData(payload: ArticleCreatePayload, coverImage?: File | null): FormData {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("content", payload.content);

  if (payload.category) formData.append("category", payload.category);
  if (payload.subcategory) formData.append("subcategory", payload.subcategory);
  if (payload.author_name) formData.append("author_name", payload.author_name);
  if (payload.language) formData.append("language", payload.language);
  if (payload.published_at) formData.append("published_at", payload.published_at);
  if (payload.status) formData.append("status", payload.status);
  if (payload.metadata_title) formData.append("metadata_title", payload.metadata_title);
  if (payload.metadata_description) {
    formData.append("metadata_description", payload.metadata_description);
  }
  if (payload.metadata_image) formData.append("metadata_image", payload.metadata_image);
  if (payload.excerpt !== undefined) formData.append("excerpt", payload.excerpt);
  if (payload.meta_keywords !== undefined) formData.append("meta_keywords", payload.meta_keywords);
  if (payload.slug !== undefined) formData.append("slug", payload.slug);
  if (payload.og_title !== undefined) formData.append("og_title", payload.og_title);
  if (payload.og_description !== undefined) formData.append("og_description", payload.og_description);
  if (payload.google_trends_words?.length) {
    formData.append("google_trends_words", JSON.stringify(payload.google_trends_words));
  }
  if (coverImage) formData.append("image", coverImage, coverImage.name);

  return formData;
}

export const ArticlesApi = {
  list(query: ArticleQuery = {}): Promise<PaginatedResponse<Article>> {
    const qs = buildQuery({
      page: query.page,
      page_size: query.page_size,
      search: query.search,
      category: query.category,
      subcategory: query.subcategory,
      language: query.language,
      status: query.status,
      ordering: query.ordering,
    });
    return request<PaginatedResponse<Article>>(`/articles/${qs}`);
  },

  get(id: number | string): Promise<Article> {
    return request<Article>(`/articles/${id}/`);
  },

  create(payload: ArticleCreatePayload, coverImage?: File | null): Promise<Article> {
    return request<Article>("/articles/", {
      method: "POST",
      body: toFormData(payload, coverImage),
    });
  },

  update(
    id: number,
    payload: ArticleCreatePayload,
    coverImage?: File | null,
  ): Promise<Article> {
    return request<Article>(`/articles/${id}/`, {
      method: "PATCH",
      body: toFormData(payload, coverImage),
    });
  },

  remove(id: number): Promise<void> {
    return request<void>(`/articles/${id}/`, { method: "DELETE" });
  },
};

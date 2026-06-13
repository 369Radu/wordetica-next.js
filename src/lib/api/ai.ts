import { request } from "@/lib/api/http";

export interface AiArticleResult {
  article: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  h1: string;
  h2: string[];
  tags: string[];
  keywords: string[];
  keyword_analysis: string;
  google_trends_queries: string[];
  saved_article_id?: number;
}

export interface AiGeneratePayload {
  topic: string;
  language?: string;
  existing_content?: string;
  section_word_counts?: Record<string, number>;
}

export interface AiOptimizePayload {
  existing_content: string;
  topic?: string;
  language?: string;
}

export const AiApi = {
  generate(payload: AiGeneratePayload): Promise<AiArticleResult> {
    return request<AiArticleResult>("/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  optimize(payload: AiOptimizePayload): Promise<AiArticleResult> {
    return request<AiArticleResult>("/ai/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
};

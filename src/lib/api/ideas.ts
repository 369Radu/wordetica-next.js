import { buildQuery, request } from "@/lib/api/http";
import type { Idea, IdeaPayload, PaginatedIdeas } from "@/types/ideas";

export const IdeasApi = {
  list(search = ""): Promise<PaginatedIdeas> {
    const qs = search.trim() ? buildQuery({ search: search.trim() }) : "";
    return request<PaginatedIdeas>(`/ideas/${qs}`);
  },
  get(id: number): Promise<Idea> {
    return request<Idea>(`/ideas/${id}/`);
  },
  create(payload: IdeaPayload = {}): Promise<Idea> {
    return request<Idea>("/ideas/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  update(id: number, payload: IdeaPayload): Promise<Idea> {
    return request<Idea>(`/ideas/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  remove(id: number): Promise<void> {
    return request<void>(`/ideas/${id}/`, { method: "DELETE" });
  },
};

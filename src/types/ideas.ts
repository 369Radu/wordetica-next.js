export interface Idea {
  id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface IdeaPayload {
  title?: string;
  body?: string;
}

export interface PaginatedIdeas {
  count: number;
  next: string | null;
  previous: string | null;
  results: Idea[];
}

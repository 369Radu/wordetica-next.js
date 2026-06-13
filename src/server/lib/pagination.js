import { config } from "../config.js";

export function paginate(items, query) {
  const page = Math.max(1, Number.parseInt(query.page || "1", 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number.parseInt(query.page_size || String(config.pageSize), 10) || config.pageSize),
  );
  const count = items.length;
  const start = (page - 1) * pageSize;
  const results = items.slice(start, start + pageSize);
  const base = query._baseUrl || "";

  const next =
    start + pageSize < count
      ? `${base}?page=${page + 1}&page_size=${pageSize}`
      : null;
  const previous =
    page > 1 ? `${base}?page=${page - 1}&page_size=${pageSize}` : null;

  return { count, next, previous, results };
}

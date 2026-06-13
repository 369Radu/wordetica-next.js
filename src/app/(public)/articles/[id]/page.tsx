import { headers } from "next/headers";

import { ArticleDetail } from "@/components/articles/ArticleDetail";
import { buildMetadata } from "@/lib/seo";
import type { Article } from "@/types/article";

const FALLBACK = { title: "Article", description: "Article from Wordetica." };

async function fetchArticle(id: string): Promise<Article | null> {
  try {
    const headerList = await headers();
    const host = headerList.get("host");
    if (!host) return null;
    const proto = headerList.get("x-forwarded-proto") ?? "http";
    const res = await fetch(`${proto}://${host}/api/articles/${id}/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Article;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await fetchArticle(id);

  if (!article) {
    return buildMetadata(FALLBACK);
  }

  return buildMetadata({
    title: article.metadata_title || article.title,
    description: article.metadata_description,
    image: article.metadata_image || article.image,
    ogTitle: article.og_title || article.metadata_title || article.title,
    ogDescription: article.og_description || article.metadata_description,
    ogType: "article",
    keywords: article.meta_keywords || undefined,
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArticleDetail id={id} />;
}

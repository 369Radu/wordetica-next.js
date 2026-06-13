import { ArticleList } from "@/components/articles/ArticleList";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Articles",
  description:
    "Insights on AI literacy, language technology, responsible AI in education, translation, and interpreting.",
});

export default function ArticlesPage() {
  return <ArticleList />;
}

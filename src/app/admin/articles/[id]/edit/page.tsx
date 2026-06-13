import type { Metadata } from "next";
import { ArticleCreate } from "@/components/admin/ArticleCreate";

export const metadata: Metadata = {
  title: "Admin · Edit article | Wordetica",
  robots: { index: false, follow: false },
};

export default async function AdminEditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArticleCreate id={id} />;
}

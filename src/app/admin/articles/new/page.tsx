import type { Metadata } from "next";
import { ArticleCreate } from "@/components/admin/ArticleCreate";

export const metadata: Metadata = {
  title: "Admin · New article | Wordetica",
  robots: { index: false, follow: false },
};

export default function AdminNewArticlePage() {
  return <ArticleCreate />;
}

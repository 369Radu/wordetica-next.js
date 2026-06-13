import type { Metadata } from "next";
import { AdminArticleList } from "@/components/admin/AdminArticleList";

export const metadata: Metadata = {
  title: "Admin · All articles | Wordetica",
  robots: { index: false, follow: false },
};

export default function AdminAllArticlesPage() {
  return <AdminArticleList tab="all" />;
}

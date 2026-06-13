import type { Metadata } from "next";
import { AdminArticleList } from "@/components/admin/AdminArticleList";

export const metadata: Metadata = {
  title: "Admin · Articles | Wordetica",
  robots: { index: false, follow: false },
};

export default function AdminArticlesPage() {
  return <AdminArticleList tab="published" />;
}

import type { Metadata } from "next";
import { AdminArticleList } from "@/components/admin/AdminArticleList";

export const metadata: Metadata = {
  title: "Admin · Drafts | Wordetica",
  robots: { index: false, follow: false },
};

export default function AdminDraftArticlesPage() {
  return <AdminArticleList tab="draft" />;
}

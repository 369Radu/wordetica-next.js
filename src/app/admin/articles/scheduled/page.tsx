import type { Metadata } from "next";
import { AdminArticleList } from "@/components/admin/AdminArticleList";

export const metadata: Metadata = {
  title: "Admin · Scheduled | Wordetica",
  robots: { index: false, follow: false },
};

export default function AdminScheduledArticlesPage() {
  return <AdminArticleList tab="scheduled" />;
}

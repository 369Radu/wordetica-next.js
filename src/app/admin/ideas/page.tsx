import type { Metadata } from "next";
import { AdminIdeas } from "@/components/admin/ideas/AdminIdeas";

export const metadata: Metadata = {
  title: "Admin · Ideas | Wordetica",
  robots: { index: false, follow: false },
};

export default function AdminIdeasPage() {
  return <AdminIdeas />;
}

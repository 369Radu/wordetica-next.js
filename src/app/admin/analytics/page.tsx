import type { Metadata } from "next";
import { Analytics } from "@/components/admin/analytics/Analytics";

export const metadata: Metadata = {
  title: "Admin · Analytics | Wordetica",
  robots: { index: false, follow: false },
};

export default function AdminAnalyticsPage() {
  return <Analytics />;
}

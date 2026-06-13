import type { Metadata } from "next";
import { CookiePolicy } from "@/components/legal/CookiePolicy";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: "How Wordetica uses cookies and similar technologies on this website.",
  robotsIndex: true,
  robotsFollow: true,
});

export default function CookiesPage() {
  return <CookiePolicy />;
}

import type { Metadata } from "next";
import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Wordetica collects, uses, and protects personal information on our website.",
  robotsIndex: true,
  robotsFollow: true,
});

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}

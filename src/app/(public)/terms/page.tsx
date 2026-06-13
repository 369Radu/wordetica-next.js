import type { Metadata } from "next";
import { TermsOfService } from "@/components/legal/TermsOfService";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Terms and conditions for using the Wordetica website and online services.",
  robotsIndex: true,
  robotsFollow: true,
});

export default function TermsPage() {
  return <TermsOfService />;
}

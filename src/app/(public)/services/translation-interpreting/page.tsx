import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { TranslationInterpretingDetail } from "@/components/services/TranslationInterpretingDetail";

export const metadata: Metadata = buildMetadata({
  title: "Translation & Interpreting Services",
  description:
    "Professional translation and real-time interpreting, combining AI technologies and human linguistic expertise.",
});

export default function TranslationInterpretingDetailPage() {
  return <TranslationInterpretingDetail />;
}

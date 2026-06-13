import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AiTrainingDetail } from "@/components/services/AiTrainingDetail";

export const metadata: Metadata = buildMetadata({
  title: "Human-Centered AI Literacy Training Series",
  description:
    "A progressive, six-level series equipping learners of all ages with AI knowledge, critical skills, and ethical awareness.",
});

export default function AiTrainingDetailPage() {
  return <AiTrainingDetail />;
}

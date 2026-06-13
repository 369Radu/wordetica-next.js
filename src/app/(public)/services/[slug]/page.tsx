import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ServiceDetail } from "@/components/services/ServiceDetail";

export const metadata: Metadata = buildMetadata({
  title: "Service",
  description: "Detailed service offering.",
});

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServiceDetail slug={slug} />;
}

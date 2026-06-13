import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ServicesList } from "@/components/services/ServicesList";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Human-Centered AI Training, language coaching, professional translation and interpreting services - linguistics and AI working together.",
});

export default function ServicesPage() {
  return <ServicesList />;
}

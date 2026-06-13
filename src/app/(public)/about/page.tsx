import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { About } from "@/components/about/About";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "How we work, our approach, and the founder behind Wordetica.",
});

export default function AboutPage() {
  return <About />;
}

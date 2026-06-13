import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Home } from "@/components/home/Home";

export const metadata: Metadata = buildMetadata({
  title: "Home",
  description:
    "Language-driven services, enhanced by AI and guided by linguistic expertise and oversight.",
});

export default function HomePage() {
  return <Home />;
}

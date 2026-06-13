import { Suspense } from "react";
import type { Metadata } from "next";
import { Contact } from "@/components/contact/Contact";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Wordetica.",
});

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <Contact />
    </Suspense>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { Login } from "@/components/auth/Login";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sign in",
  description: "Sign in to the Wordetica admin dashboard.",
});

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { readSession } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Client-side guard replicating the Angular `authGuard` on the admin routes:
 * unauthenticated or non-admin users are redirected to
 * `/login?redirectTo=<current path>`. Renders nothing until authorised.
 *
 * `useAuth()` drives reactivity (e.g. on logout) while `readSession()` provides
 * a synchronous read on first mount so a freshly-loaded admin is not bounced
 * before the provider hydrates from localStorage.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = readSession();
    const sessionAuthed = !!session?.user;
    const sessionAdmin =
      sessionAuthed && (session!.user.is_staff || session!.user.is_superuser);

    const ok = (sessionAuthed && sessionAdmin) || (isAuthenticated && isAdmin);

    if (!ok) {
      setAuthorized(false);
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname ?? "/admin")}`);
      return;
    }
    setAuthorized(true);
  }, [isAuthenticated, isAdmin, pathname, router]);

  if (!authorized) return null;

  return <AdminShell>{children}</AdminShell>;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { request } from "@/lib/api/http";
import {
  SESSION_EVENT,
  STORAGE_KEY,
  clearSession,
  readSession,
  writeSession,
} from "@/lib/auth/session";
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  MessageResponse,
  UnlockAccountRequest,
} from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (payload: LoginRequest) => Promise<AuthUser>;
  unlockAccount: (payload: UnlockAccountRequest) => Promise<MessageResponse>;
  logout: (redirectTo?: string | null) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  // Hydrate from localStorage on mount and keep in sync across tabs / fetch layer.
  useEffect(() => {
    const sync = () => setUser(readSession()?.user ?? null);
    sync();
    window.addEventListener(SESSION_EVENT, sync);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(SESSION_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const response = await request<LoginResponse>("/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    writeSession({
      access: response.access,
      refresh: response.refresh,
      user: response.user,
    });
    setUser(response.user);
    return response.user;
  }, []);

  const unlockAccount = useCallback(
    (payload: UnlockAccountRequest) =>
      request<MessageResponse>("/auth/unlock/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    [],
  );

  const logout = useCallback(
    (redirectTo: string | null = "/login") => {
      clearSession();
      setUser(null);
      if (redirectTo) router.push(redirectTo);
    },
    [router],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: !!user && (user.is_staff || user.is_superuser),
      login,
      unlockAccount,
      logout,
      getAccessToken: () => readSession()?.access ?? null,
      getRefreshToken: () => readSession()?.refresh ?? null,
    }),
    [user, login, unlockAccount, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

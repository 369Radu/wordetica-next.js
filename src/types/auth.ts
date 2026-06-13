export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface RefreshResponse {
  access: string;
  refresh?: string;
}

export interface AuthSession {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface LoginErrorBody {
  detail?: string;
  code?: "invalid_credentials" | "account_locked";
  attempts_remaining?: number;
  max_attempts?: number;
  email?: string;
}

export interface UnlockAccountRequest {
  email: string;
  unlock_key: string;
}

export interface MessageResponse {
  detail: string;
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/AuthProvider";
import { parseLoginError } from "@/lib/login-error.util";
import "./login.scss";

type LoginView = "sign-in" | "locked";

// Mirrors Angular's Validators.email regex (empty value is treated as valid by it).
const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function emailInvalid(value: string): boolean {
  if (value.length === 0) return true; // required
  return !EMAIL_REGEXP.test(value);
}

function toApiError(err: unknown): ApiError {
  return err instanceof ApiError ? err : new ApiError(0, null);
}

export function Login() {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [maxAttempts, setMaxAttempts] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [unlockSubmitting, setUnlockSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [view, setView] = useState<LoginView>("sign-in");
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [lockedEmail, setLockedEmail] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const [form, setForm] = useState({ email: "", password: "" });
  const [formTouched, setFormTouched] = useState({ email: false, password: false });
  const [formDirty, setFormDirty] = useState({ email: false, password: false });

  const [unlockForm, setUnlockForm] = useState({ email: "", unlock_key: "" });
  const [unlockTouched, setUnlockTouched] = useState({ email: false, unlock_key: false });
  const [unlockDirty, setUnlockDirty] = useState({ email: false, unlock_key: false });

  const formEmailInvalid = emailInvalid(form.email);
  const formPasswordInvalid = form.password.length < 1;
  const formInvalid = formEmailInvalid || formPasswordInvalid;

  const unlockEmailInvalid = emailInvalid(unlockForm.email);
  const unlockKeyInvalid = unlockForm.unlock_key.length < 1;
  const unlockFormInvalid = unlockEmailInvalid || unlockKeyInvalid;

  const showAttemptsHint =
    attemptsRemaining !== null && attemptsRemaining >= 0 && view === "sign-in";

  useEffect(() => {
    if (auth.isAuthenticated && auth.isAdmin) {
      redirectAfterLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showLoginError = (controlName: "email" | "password"): boolean => {
    const invalid = controlName === "email" ? formEmailInvalid : formPasswordInvalid;
    return invalid && (formDirty[controlName] || formTouched[controlName]);
  };

  const showUnlockError = (controlName: "email" | "unlock_key"): boolean => {
    const invalid = controlName === "email" ? unlockEmailInvalid : unlockKeyInvalid;
    return invalid && (unlockDirty[controlName] || unlockTouched[controlName]);
  };

  const togglePasswordVisible = () => {
    setPasswordVisible((v) => !v);
  };

  const onPasswordKey = (event: React.KeyboardEvent) => {
    setCapsLockOn(event.getModifierState("CapsLock"));
  };

  const openUnlockForm = (lockedEmailValue: string | null = lockedEmail) => {
    setView("locked");
    setUnlockError(null);
    setUnlockMessage(null);
    setServerError(null);
    setUnlockForm((prev) => ({
      ...prev,
      email: form.email || lockedEmailValue || "",
      unlock_key: "",
    }));
  };

  const backToSignIn = () => {
    setView("sign-in");
    setUnlockError(null);
    setUnlockMessage(null);
    setServerError(null);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormTouched({ email: true, password: true });
    if (formInvalid || submitting || view === "locked") return;

    setSubmitting(true);
    setServerError(null);

    auth.login({ email: form.email, password: form.password }).then(
      (user) => {
        setSubmitting(false);
        setAttemptsRemaining(null);
        if (!user.is_staff && !user.is_superuser) {
          setServerError("Your account does not have admin access.");
          auth.logout(null);
          return;
        }
        redirectAfterLogin();
      },
      (err: unknown) => {
        setSubmitting(false);
        handleLoginError(toApiError(err));
      },
    );
  };

  const submitUnlock = (event: React.FormEvent) => {
    event.preventDefault();
    const email = lockedEmail ?? form.email;
    const nextUnlock = { ...unlockForm, email };
    setUnlockForm(nextUnlock);
    setUnlockTouched({ email: true, unlock_key: true });
    const invalid = emailInvalid(nextUnlock.email) || nextUnlock.unlock_key.length < 1;
    if (invalid || unlockSubmitting) return;

    setUnlockSubmitting(true);
    setUnlockMessage(null);
    setUnlockError(null);

    auth
      .unlockAccount({ email: nextUnlock.email, unlock_key: nextUnlock.unlock_key })
      .then(
        (res) => {
          setUnlockSubmitting(false);
          setUnlockMessage(res.detail);
          setAttemptsRemaining(null);
          setView("sign-in");
          setServerError(null);
          setForm((prev) => ({ ...prev, email: nextUnlock.email }));
        },
        (err: unknown) => {
          setUnlockSubmitting(false);
          setUnlockError(parseGenericError(toApiError(err)));
        },
      );
  };

  const handleLoginError = (err: ApiError) => {
    const body = parseLoginError(err);
    const max = body.max_attempts;
    if (max !== undefined && max >= 0) {
      setMaxAttempts(max);
    }

    if (body.code === "account_locked") {
      const email = body.email ?? form.email;
      setLockedEmail(email);
      setAttemptsRemaining(0);
      openUnlockForm(email);
      setServerError(body.detail ?? "Account locked. Enter the unlock key.");
      return;
    }

    const remaining = body.attempts_remaining;
    if (body.code === "invalid_credentials" && remaining !== undefined && remaining >= 0) {
      setAttemptsRemaining(remaining);
    } else {
      setAttemptsRemaining(null);
    }

    setServerError(body.detail ?? parseGenericError(err));
  };

  const redirectAfterLogin = () => {
    const target = searchParams?.get("redirectTo") ?? "/admin";
    router.push(target);
  };

  const parseGenericError = (err: ApiError): string => {
    if (err.status === 0) return "Could not reach the server. Please try again.";
    const detail = (err.error as { detail?: string } | null)?.detail;
    if (typeof detail === "string") return detail;
    const unlockKey = (err.error as { unlock_key?: string[] } | null)?.unlock_key;
    if (Array.isArray(unlockKey) && unlockKey[0]) return unlockKey[0];
    const email = (err.error as { email?: string[] } | null)?.email;
    if (Array.isArray(email) && email[0]) return email[0];
    return "Something went wrong. Please try again.";
  };

  return (
    <section className="wo-section login">
      <div className="wo-container">
        <div className="card">
          {view === "sign-in" && (
            <>
              <header>
                <span className="wo-tag">Admin</span>
                <h1>Sign in</h1>
                <p>Access the Wordetica content workspace.</p>
              </header>

              <form onSubmit={submit} noValidate>
                <div className="field">
                  <label htmlFor="email" className="wo-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className={`wo-input${showLoginError("email") ? " is-invalid" : ""}`}
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, email: e.target.value }));
                      setFormDirty((prev) => ({ ...prev, email: true }));
                    }}
                    onBlur={() => setFormTouched((prev) => ({ ...prev, email: true }))}
                  />
                  {showLoginError("email") && <p className="wo-error">Enter a valid email.</p>}
                </div>

                <div className="field">
                  <label htmlFor="password" className="wo-label">Password</label>
                  <div className="password-wrap">
                    <input
                      id="password"
                      className={`wo-input password-wrap__input${
                        showLoginError("password") ? " is-invalid" : ""
                      }`}
                      autoComplete="current-password"
                      type={passwordVisible ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, password: e.target.value }));
                        setFormDirty((prev) => ({ ...prev, password: true }));
                      }}
                      onBlur={() => setFormTouched((prev) => ({ ...prev, password: true }))}
                      onKeyDown={onPasswordKey}
                      onKeyUp={onPasswordKey}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisible}
                      aria-label={passwordVisible ? "Hide password" : "Show password"}
                      aria-pressed={passwordVisible}
                    >
                      {passwordVisible ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path
                            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                          />
                          <path
                            d="m4 4 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path
                            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {capsLockOn && (
                    <p className="caps-warning" role="alert">Caps Lock is on</p>
                  )}
                  {showLoginError("password") && <p className="wo-error">Password is required.</p>}
                </div>

                {showAttemptsHint && (
                  <p className="attempts-hint" role="status">
                    Attempts remaining: <strong>{attemptsRemaining}</strong> of
                    {" "}{maxAttempts}
                  </p>
                )}

                {serverError && <p className="wo-error">{serverError}</p>}
                {unlockMessage && <p className="wo-success">{unlockMessage}</p>}

                <button
                  type="submit"
                  className="wo-btn wo-btn--primary wo-btn--block"
                  disabled={submitting || formInvalid}
                >
                  {submitting ? "Signing in…" : "Sign in"}
                </button>

                <button
                  type="button"
                  className="link-btn link-btn--block"
                  onClick={() => openUnlockForm()}
                >
                  Account locked? Enter unlock key
                </button>
              </form>
            </>
          )}

          {view === "locked" && (
            <>
              <header>
                <span className="wo-tag wo-tag--warn">Locked</span>
                <h1>Account locked</h1>
                <p>
                  Too many incorrect sign-in attempts for
                  {" "}<strong>{lockedEmail}</strong>. Enter the account unlock key, then sign in
                  again with your password.
                </p>
              </header>

              <form onSubmit={submitUnlock} noValidate>
                <div className="field">
                  <label htmlFor="unlock-email" className="wo-label">Email</label>
                  <input
                    id="unlock-email"
                    type="email"
                    className={`wo-input${showUnlockError("email") ? " is-invalid" : ""}`}
                    autoComplete="email"
                    value={unlockForm.email}
                    onChange={(e) => {
                      setUnlockForm((prev) => ({ ...prev, email: e.target.value }));
                      setUnlockDirty((prev) => ({ ...prev, email: true }));
                    }}
                    onBlur={() => setUnlockTouched((prev) => ({ ...prev, email: true }))}
                  />
                  {showUnlockError("email") && <p className="wo-error">Enter a valid email.</p>}
                </div>

                <div className="field">
                  <label htmlFor="unlock-key" className="wo-label">Account unlock key</label>
                  <input
                    id="unlock-key"
                    type="password"
                    className={`wo-input${showUnlockError("unlock_key") ? " is-invalid" : ""}`}
                    autoComplete="off"
                    value={unlockForm.unlock_key}
                    onChange={(e) => {
                      setUnlockForm((prev) => ({ ...prev, unlock_key: e.target.value }));
                      setUnlockDirty((prev) => ({ ...prev, unlock_key: true }));
                    }}
                    onBlur={() => setUnlockTouched((prev) => ({ ...prev, unlock_key: true }))}
                  />
                  {showUnlockError("unlock_key") && (
                    <p className="wo-error">Unlock key is required.</p>
                  )}
                </div>

                {unlockMessage && <p className="wo-success">{unlockMessage}</p>}
                {unlockError && <p className="wo-error">{unlockError}</p>}
                {serverError && !unlockMessage && <p className="wo-error">{serverError}</p>}

                <button
                  type="submit"
                  className="wo-btn wo-btn--primary wo-btn--block"
                  disabled={unlockSubmitting || unlockFormInvalid}
                >
                  {unlockSubmitting ? "Unlocking…" : "Unlock account"}
                </button>

                <button
                  type="button"
                  className="wo-btn wo-btn--ghost wo-btn--block"
                  onClick={backToSignIn}
                >
                  Back to sign in
                </button>
              </form>
            </>
          )}

          <footer className="login__footer">
            <Link href="/">← Back to site</Link>
            <span className="login__footer-legal">
              <Link href="/privacy">Privacy Policy</Link>
              <span aria-hidden="true">·</span>
              <Link href="/terms">Terms of Service</Link>
            </span>
          </footer>
        </div>
      </div>
    </section>
  );
}

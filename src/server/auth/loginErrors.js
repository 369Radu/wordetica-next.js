export class LoginAPIError extends Error {
  /**
   * @param {object} opts
   * @param {string} opts.detail
   * @param {string} opts.code
   * @param {number} opts.attemptsRemaining
   * @param {number} opts.maxAttempts
   * @param {string} [opts.email]
   */
  constructor({ detail, code, attemptsRemaining, maxAttempts, email }) {
    super(detail);
    this.name = "LoginAPIError";
    this.statusCode = 401;
    this.payload = {
      detail,
      code,
      attempts_remaining: attemptsRemaining,
      max_attempts: maxAttempts,
    };
    if (email) this.payload.email = email;
  }
}

export function invalidLoginError(attemptsRemaining, maxAttempts) {
  if (attemptsRemaining === null || attemptsRemaining === undefined) {
    return new LoginAPIError({
      detail: "Invalid email or password.",
      code: "invalid_credentials",
      attemptsRemaining: -1,
      maxAttempts,
    });
  }
  if (attemptsRemaining === 1) {
    return new LoginAPIError({
      detail:
        "Invalid email or password. You have 1 attempt remaining before your account is locked.",
      code: "invalid_credentials",
      attemptsRemaining: 1,
      maxAttempts,
    });
  }
  if (attemptsRemaining > 1) {
    return new LoginAPIError({
      detail: `Invalid email or password. You have ${attemptsRemaining} attempts remaining.`,
      code: "invalid_credentials",
      attemptsRemaining,
      maxAttempts,
    });
  }
  return new LoginAPIError({
    detail: "Invalid email or password.",
    code: "invalid_credentials",
    attemptsRemaining: 0,
    maxAttempts,
  });
}

export function loginLockedError(email, maxAttempts) {
  return new LoginAPIError({
    detail:
      "Too many failed sign-in attempts. Enter the account unlock key below to continue.",
    code: "account_locked",
    attemptsRemaining: 0,
    maxAttempts,
    email,
  });
}

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(rootDir, ".env") });

function envBool(name, defaultValue = false) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return defaultValue;
  return ["1", "true", "yes", "on"].includes(String(raw).toLowerCase());
}

function envInt(name, defaultValue) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return defaultValue;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : defaultValue;
}

function envList(name, defaultValue = "") {
  const raw = process.env[name] ?? defaultValue;
  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Vercel/Lambda: read-only bundle at /var/task — only /tmp is writable. */
function detectServerless(deployRoot) {
  if (["1", "true"].includes(String(process.env.VERCEL ?? "").toLowerCase())) return true;
  if (process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT) return true;
  if (deployRoot.replace(/\\/g, "/").startsWith("/var/task")) return true;
  return false;
}

const isServerless = detectServerless(rootDir);

export const config = {
  rootDir,
  isServerless,
  port: envInt("PORT", 8000),
  secretKey: process.env.SECRET_KEY || "change-me-in-production",
  debug: envBool("DEBUG", false),
  allowedHosts: (() => {
    const raw = process.env.ALLOWED_HOSTS ?? "localhost,127.0.0.1";
    const normalized = String(raw).trim().toLowerCase();
    if (normalized === "*" || normalized === "all") return ["*"];
    return envList("ALLOWED_HOSTS", "localhost,127.0.0.1");
  })(),
  frontendUrl: (process.env.FRONTEND_URL || "http://localhost:4200").replace(/\/$/, ""),
  publicBaseUrl: (
    process.env.PUBLIC_BASE_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:4200"
  ).replace(/\/$/, ""),
  /** Vercel only allows writes under /tmp; production images use Firebase Storage. */
  mediaRoot: isServerless
    ? path.join("/tmp", "wordetica-media")
    : path.join(rootDir, "media"),
  mediaUrl: "/media/",
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY || "",
    serviceAccountPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || "",
  },
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  pageSize: envInt("DRF_PAGE_SIZE", 6),
  jwtAccessMinutes: envInt("JWT_ACCESS_MINUTES", 60),
  jwtRefreshDays: envInt("JWT_REFRESH_DAYS", 7),
  maxLoginAttempts: envInt("MAX_LOGIN_ATTEMPTS", 5),
  accountUnlockKey: process.env.ACCOUNT_UNLOCK_KEY || "",
  aiServiceUrl: (process.env.AI_SERVICE_URL || "http://127.0.0.1:8200").replace(/\/$/, ""),
  aiServiceTimeoutMs: envInt("AI_SERVICE_TIMEOUT", 300) * 1000,
  uploadMaxBytes: envInt("FILE_UPLOAD_MAX_MEMORY_SIZE", 10 * 1024 * 1024),
  /** Only enable behind nginx/reverse proxy in production (not local dev). */
  trustProxy: envBool("TRUST_PROXY", false),
  // SMTP — contact form email delivery
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: process.env.SMTP_PORT || '587',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
};

if (!config.debug && config.secretKey.startsWith("change-me")) {
  console.warn("[config] WARNING: using default SECRET_KEY with DEBUG=false");
}

if (!config.debug && !config.accountUnlockKey) {
  const message = "ACCOUNT_UNLOCK_KEY must be set when DEBUG=false";
  if (isServerless) {
    console.error(`[config] ${message}`);
  } else {
    throw new Error(message);
  }
}

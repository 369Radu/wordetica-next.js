import admin from "firebase-admin";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { config } from "./config.js";
import { withTimeout } from "./lib/withTimeout.js";

/** @type {admin.app.App | null} */
let app = null;
/** @type {boolean} */
let firestoreConfigured = false;

function normalizePrivateKey(key) {
  if (!key) return "";
  let normalized = String(key).trim();
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  }
  return normalized.replace(/\\n/g, "\n");
}

function resolveCredentialsPath() {
  const fromEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!fromEnv) return "";
  return path.isAbsolute(fromEnv) ? fromEnv : path.join(config.rootDir, fromEnv);
}

function loadCredential() {
  const { projectId, clientEmail, privateKey } = config.firebase;
  const inlineReady = projectId && clientEmail && privateKey;

  // On Vercel/cloud: prefer inline env vars (no JSON file on disk).
  if (inlineReady && (config.isServerless || !existsSync(resolveCredentialsPath()))) {
    return admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: normalizePrivateKey(privateKey),
    });
  }

  const credPath = resolveCredentialsPath();
  if (credPath && existsSync(credPath)) {
    const json = readFileSync(credPath, "utf8");
    return admin.credential.cert(JSON.parse(json));
  }

  if (inlineReady) {
    return admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: normalizePrivateKey(privateKey),
    });
  }

  throw new Error(
    "Firebase Admin credentials missing.\n" +
      "Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in Vercel env vars.\n" +
      "Remove GOOGLE_APPLICATION_CREDENTIALS on Vercel unless the JSON file exists on the server.",
  );
}

export function getFirebaseApp() {
  if (app) return app;

  // Next.js dev hot-reload re-executes modules but Firebase Admin keeps its
  // process-level singleton — reuse the existing [DEFAULT] app when present.
  if (admin.apps.length > 0) {
    app = admin.app();
    firestoreConfigured = true;
    return app;
  }

  app = admin.initializeApp({ credential: loadCredential() });
  return app;
}

export function getFirestore() {
  const db = getFirebaseApp().firestore();
  if (!firestoreConfigured) {
    if (config.isServerless) {
      db.settings({ preferRest: true });
    }
    firestoreConfigured = true;
  }
  return db;
}

export function getStorageBucket() {
  const bucketName = config.firebaseStorageBucket;
  const storage = getFirebaseApp().storage();
  return bucketName ? storage.bucket(bucketName) : storage.bucket();
}

export async function verifyFirestoreConnection() {
  const db = getFirestore();
  await withTimeout(
    db.collection("_meta").doc("health").get(),
    15000,
    "Firestore connection",
  );
}

export async function verifyStorageConnection() {
  await withTimeout(getStorageBucket().getMetadata(), 15000, "Firebase Storage connection");
}

export function formatFirestoreStartupError(err) {
  const msg = err?.message ?? String(err);
  const disabled =
    err?.code === 7 ||
    msg.includes("PERMISSION_DENIED") ||
    msg.includes("firestore.googleapis.com");

  const storageDisabled =
    msg.includes("firebasestorage.googleapis.com") ||
    msg.includes("storage.googleapis.com") ||
    (msg.includes("PERMISSION_DENIED") && msg.includes("storage"));

  if (msg.includes("timed out")) {
    return (
      "Firebase connection timed out on serverless.\n\n" +
      "1. Confirm FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in Vercel.\n" +
      "2. Remove GOOGLE_APPLICATION_CREDENTIALS from Vercel (use inline key only).\n" +
      "3. FIREBASE_PRIVATE_KEY must include \\n line breaks or real newlines.\n\n" +
      `Details: ${msg}`
    );
  }

  if (disabled) {
    return (
      "Firestore is not available for this Firebase project yet.\n\n" +
      "1. Firebase Console → Build → Firestore Database → Create database (Native mode).\n" +
      "2. Enable the API (if prompted): https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=wordetica\n" +
      "3. Wait 2–5 minutes for Google Cloud to propagate, then restart the backend.\n\n" +
      `Details: ${msg}`
    );
  }

  if (storageDisabled) {
    return (
      "Firebase Storage is not available for this project yet.\n\n" +
      "1. Firebase Console → Build → Storage → Get started.\n" +
      "2. Enable the API (if prompted): https://console.developers.google.com/apis/api/storage.googleapis.com/overview\n" +
      "3. Set FIREBASE_STORAGE_BUCKET in backend/.env (e.g. wordetica.firebasestorage.app).\n" +
      "4. Wait a few minutes, then restart the backend.\n\n" +
      `Details: ${msg}`
    );
  }

  return msg;
}

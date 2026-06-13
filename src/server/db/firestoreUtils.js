import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getFirestore } from "../firebase.js";

export { FieldValue, Timestamp };

export function getDb() {
  return getFirestore();
}

/** @param {FirebaseFirestore.Timestamp | Date | string | null | undefined} value */
export function toIso(value) {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return null;
}

/** @param {string | null | undefined} date YYYY-MM-DD */
export function dateToTimestamp(date) {
  if (!date) return null;
  return Timestamp.fromDate(new Date(`${date}T00:00:00.000Z`));
}

export function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

/** Allocate the next numeric id for a collection (users, articles, ideas). */
export async function nextNumericId(counterKey) {
  const ref = getDb().collection("meta").doc("counters");
  return getDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() || {};
    const next = (data[counterKey] || 0) + 1;
    tx.set(ref, { [counterKey]: next }, { merge: true });
    return next;
  });
}

/** @param {Record<string, unknown>} data */
export function stripUndefined(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined),
  );
}

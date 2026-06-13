import { getDb, nextNumericId, stripUndefined, toIso } from "../db/firestoreUtils.js";

const COLLECTION = "users";

/** @param {FirebaseFirestore.DocumentData | undefined} data */
function fromDoc(data) {
  if (!data) return null;
  return {
    id: data.id,
    password: data.password,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    profile_image: data.profile_image ?? null,
    is_active: Boolean(data.is_active),
    is_staff: Boolean(data.is_staff),
    is_superuser: Boolean(data.is_superuser),
    failed_login_attempts: data.failed_login_attempts ?? 0,
    force_password_reset: Boolean(data.force_password_reset),
    date_joined: toIso(data.date_joined),
    last_login: toIso(data.last_login),
  };
}

export async function findUserById(id) {
  const snap = await getDb().collection(COLLECTION).doc(String(id)).get();
  return snap.exists ? fromDoc(snap.data()) : null;
}

export async function findUserByEmail(email) {
  const normalized = email.trim().toLowerCase();
  const snap = await getDb()
    .collection(COLLECTION)
    .where("email_normalized", "==", normalized)
    .limit(1)
    .get();
  if (snap.empty) return null;
  return fromDoc(snap.docs[0].data());
}

export async function listUsers({ isStaff, search } = {}) {
  const snap = await getDb().collection(COLLECTION).get();
  let rows = snap.docs.map((d) => fromDoc(d.data())).filter(Boolean);
  if (isStaff !== undefined) {
    rows = rows.filter((u) => u.is_staff === isStaff);
  }
  if (search) {
    const term = search.toLowerCase();
    rows = rows.filter(
      (u) =>
        u.email.toLowerCase().includes(term) ||
        u.first_name.toLowerCase().includes(term) ||
        u.last_name.toLowerCase().includes(term),
    );
  }
  rows.sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined));
  return rows;
}

export async function createUser(fields) {
  const id = await nextNumericId("users");
  const now = new Date();
  const doc = stripUndefined({
    id,
    email: fields.email,
    email_normalized: fields.email.trim().toLowerCase(),
    password: fields.password,
    first_name: fields.first_name,
    last_name: fields.last_name,
    profile_image: fields.profile_image ?? null,
    is_active: fields.is_active ?? true,
    is_staff: fields.is_staff ?? true,
    is_superuser: fields.is_superuser ?? true,
    failed_login_attempts: 0,
    force_password_reset: false,
    date_joined: now,
    last_login: null,
  });
  await getDb().collection(COLLECTION).doc(String(id)).set(doc);
  return fromDoc(doc);
}

export async function updateUser(id, fields) {
  const ref = getDb().collection(COLLECTION).doc(String(id));
  const patch = stripUndefined({ ...fields });
  if (patch.email) {
    patch.email_normalized = patch.email.trim().toLowerCase();
  }
  if (patch.is_active !== undefined) patch.is_active = Boolean(patch.is_active);
  if (patch.is_staff !== undefined) patch.is_staff = Boolean(patch.is_staff);
  if (patch.is_superuser !== undefined) patch.is_superuser = Boolean(patch.is_superuser);
  if (patch.force_password_reset !== undefined) {
    patch.force_password_reset = Boolean(patch.force_password_reset);
  }
  await ref.set(patch, { merge: true });
  return findUserById(id);
}

export async function deleteUser(id) {
  await getDb().collection(COLLECTION).doc(String(id)).delete();
  return true;
}

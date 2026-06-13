import { getDb, nextNumericId, stripUndefined, toIso } from "../db/firestoreUtils.js";

const COLLECTION = "ideas";

/** @param {FirebaseFirestore.DocumentData | undefined} data */
function fromDoc(data) {
  if (!data) return null;
  return {
    id: data.id,
    title: data.title,
    body: data.body,
    author_id: data.author_id,
    created_at: toIso(data.created_at),
    updated_at: toIso(data.updated_at),
  };
}

export async function listIdeasByAuthor(authorId, { search, ordering } = {}) {
  const snap = await getDb()
    .collection(COLLECTION)
    .where("author_id", "==", authorId)
    .get();

  let rows = snap.docs.map((d) => fromDoc(d.data())).filter(Boolean);

  if (search) {
    const term = String(search).toLowerCase();
    rows = rows.filter(
      (i) => i.title.toLowerCase().includes(term) || i.body.toLowerCase().includes(term),
    );
  }

  if (ordering === "created_at") {
    rows.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (ordering === "title") {
    rows.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    rows.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  return rows;
}

export async function findIdeaById(id, authorId) {
  const snap = await getDb().collection(COLLECTION).doc(String(id)).get();
  if (!snap.exists) return null;
  const idea = fromDoc(snap.data());
  if (idea.author_id !== authorId) return null;
  return idea;
}

export async function createIdea({ title, body, authorId }) {
  const id = await nextNumericId("ideas");
  const now = new Date();
  const doc = { id, title, body, author_id: authorId, created_at: now, updated_at: now };
  await getDb().collection(COLLECTION).doc(String(id)).set(doc);
  return fromDoc(doc);
}

export async function updateIdea(id, { title, body }) {
  const now = new Date();
  await getDb()
    .collection(COLLECTION)
    .doc(String(id))
    .set(stripUndefined({ title, body, updated_at: now }), { merge: true });
  const snap = await getDb().collection(COLLECTION).doc(String(id)).get();
  return fromDoc(snap.data());
}

export async function deleteIdea(id, authorId) {
  const idea = await findIdeaById(id, authorId);
  if (!idea) return false;
  await getDb().collection(COLLECTION).doc(String(id)).delete();
  return true;
}

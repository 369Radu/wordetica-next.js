import { formatFirestoreStartupError, getFirebaseApp, verifyFirestoreConnection } from "./firebase.js";

export default async function handler(_request, response) {
  try {
    getFirebaseApp();
    await verifyFirestoreConnection();
    response.status(200).json({
      status: "ok",
      firestore: "connected",
    });
  } catch (err) {
    response.status(503).json({
      status: "error",
      detail: formatFirestoreStartupError(err),
    });
  }
}

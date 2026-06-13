import { formatFirestoreStartupError, getFirebaseApp } from "./firebase.js";

let servicesReady = false;
let servicesInitPromise = null;

/** Initialize Firebase Admin only — no blocking storage/metadata checks. */
async function startServicesInit() {
  if (servicesReady) return;
  if (!servicesInitPromise) {
    servicesInitPromise = Promise.resolve()
      .then(() => {
        getFirebaseApp();
        console.log("[startup] Firebase Admin initialized.");
        servicesReady = true;
      })
      .catch((err) => {
        servicesInitPromise = null;
        console.error("[startup] Firebase failed:\n" + formatFirestoreStartupError(err));
        throw err;
      });
  }
  await servicesInitPromise;
}

/** Load route modules only when /api is first hit (Vercel cold start). */
export async function mountApiRoutes(apiRouter) {
  const [, routes] = await Promise.all([
    startServicesInit(),
    Promise.all([
      import("./routes/auth.js"),
      import("./routes/articles.js"),
      import("./routes/ideas.js"),
      import("./routes/users.js"),
      import("./routes/analytics.js"),
      import("./routes/ai.js"),
      import("./routes/contact.js"),
    ]),
  ]);

  const [
    { default: authRoutes },
    { default: articlesRoutes },
    { default: ideasRoutes },
    { default: usersRoutes },
    { default: analyticsRoutes },
    { default: aiRoutes },
    { default: contactRoutes },
  ] = routes;

  apiRouter.use("/auth", authRoutes);
  apiRouter.use(articlesRoutes);
  apiRouter.use(ideasRoutes);
  apiRouter.use(usersRoutes);
  apiRouter.use(analyticsRoutes);
  apiRouter.use(aiRoutes);
  apiRouter.use(contactRoutes);
}

export { startServicesInit };

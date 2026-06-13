import express from "express";
import cors from "cors";
import fs from "fs";
import { config } from "./config.js";
import { LoginAPIError } from "./auth/loginErrors.js";

/** Legacy local covers only; production uses Firebase Storage — skip on Vercel. */
if (!config.isServerless) {
  try {
    fs.mkdirSync(config.mediaRoot, { recursive: true });
  } catch (err) {
    console.warn(`[startup] Could not create media dir (${config.mediaRoot}):`, err.message);
  }
}

const app = express();

if (config.trustProxy) {
  app.set("trust proxy", 1);
}
app.use(cors());
app.use(express.json({ limit: config.uploadMaxBytes }));
app.use(express.urlencoded({ extended: true, limit: config.uploadMaxBytes }));

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

if (!config.isServerless) {
  app.use("/media", express.static(config.mediaRoot));
}

const apiRouter = express.Router();
let apiMounted = false;
let apiMountPromise = null;

async function ensureApiMounted() {
  if (apiMounted) return;
  if (!apiMountPromise) {
    apiMountPromise = import("./mountApi.js")
      .then(({ mountApiRoutes }) => mountApiRoutes(apiRouter))
      .then(() => {
        apiMounted = true;
      })
      .catch((err) => {
        apiMountPromise = null;
        throw err;
      });
  }
  await apiMountPromise;
}

app.use("/api", async (req, res, next) => {
  try {
    await ensureApiMounted();
    apiRouter(req, res, next);
  } catch (err) {
    console.error("[api-mount]", err);
    res.status(503).json({ detail: "Service temporarily unavailable." });
  }
});

app.use((err, req, res, _next) => {
  if (err instanceof LoginAPIError) {
    return res.status(err.statusCode).json(err.payload);
  }
  console.error("[error]", err);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ detail: "File too large." });
  }
  res.status(500).json({ detail: "Internal server error." });
});

// When imported by Next.js (NEXT_RUNTIME is set), do not open a standalone
// listener — Next owns the HTTP server and forwards requests to this app.
if (!config.isServerless && !process.env.NEXT_RUNTIME) {
  import("./mountApi.js")
    .then(({ startServicesInit }) => startServicesInit())
    .then(() => {
      app.listen(config.port, "0.0.0.0", () => {
        console.log(`Wordetica API listening on port ${config.port}`);
      });
    })
    .catch(() => process.exit(1));
}

export default app;

import type { NextApiRequest, NextApiResponse } from "next";
// The Express application is itself a (req, res) request handler. We pass the
// raw Next.js request/response straight through so all routing, controllers,
// middleware and DB logic run exactly as in the original backend.

import app from "@/server/index.js";

export const config = {
  api: {
    // Let Express (express.json / multer) consume the raw request body.
    bodyParser: false,
    externalResolver: true,
  },
  // Matches the original backend's Express function limit on Vercel.
  maxDuration: 60,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  return app(req, res);
}

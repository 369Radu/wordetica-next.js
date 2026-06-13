import type { NextApiRequest, NextApiResponse } from "next";
// @ts-expect-error - JS ESM backend module without type declarations
import statusHandler from "@/server/api-status.js";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return statusHandler(req, res);
}

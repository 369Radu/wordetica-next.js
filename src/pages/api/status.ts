import type { NextApiRequest, NextApiResponse } from "next";
import statusHandler from "@/server/api-status.js";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return statusHandler(req, res);
}

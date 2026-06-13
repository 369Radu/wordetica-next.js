import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  images: {
    unoptimized: true,
  },
  // Bundle the Express backend as external server code (don't trace-bundle natively).
  serverExternalPackages: [
    "firebase-admin",
    "bcrypt",
    "multer",
    "express",
    "serverless-http",
    "nodemailer",
    "sanitize-html",
    "file-type",
  ],
  async rewrites() {
    return [
      // Local media files (legacy/dev). Production cover images use Firebase Storage URLs.
      { source: "/media/:path*", destination: "/api/media/:path*" },
    ];
  },
  async redirects() {
    // Mirrors the Angular router redirect routes (pathMatch: 'full').
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
      { source: "/cookie-policy", destination: "/cookies", permanent: true },
      {
        source: "/services/translation-services",
        destination: "/services/translation-interpreting",
        permanent: true,
      },
      {
        source: "/services/interpreting-services",
        destination: "/services/translation-interpreting",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { Metadata } from "next";
import { APP_NAME } from "./config";

export interface SeoMeta {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  keywords?: string;
}

const TITLE_SUFFIX = " | Wordetica";

/**
 * Mirrors the original Angular `SeoService.setMeta`: same title suffix,
 * description, keywords, robots, Open Graph and Twitter card behaviour.
 */
export function buildMetadata(input: SeoMeta): Metadata {
  const title = input.title ? `${input.title}${TITLE_SUFFIX}` : APP_NAME;
  const description = input.description ?? "";

  const ogTitle = input.ogTitle ?? input.title ?? APP_NAME;
  const ogDescription = input.ogDescription ?? description;
  const ogImage = input.ogImage ?? input.image ?? "";

  const metadata: Metadata = {
    title,
    description,
    robots: {
      index: input.robotsIndex !== false,
      follow: input.robotsFollow !== false,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: input.ogType ?? "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };

  if (input.keywords) {
    metadata.keywords = input.keywords;
  }

  if (input.canonical) {
    metadata.alternates = { canonical: input.canonical };
  }

  return metadata;
}

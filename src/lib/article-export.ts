import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

import {
  getArticleLanguageLabel,
  getCategoryLabel,
  getSubcategoryLabel,
  type Article,
} from "@/types/article";

interface InlineFmt {
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
}

/**
 * Plain-TS port of the Angular `ArticleExportService`. Builds DOCX documents
 * from articles client-side using the `docx` library. Logic is identical to the
 * original service; only the Angular `@Injectable` wrapper was dropped.
 */

export async function downloadSingle(article: Article): Promise<void> {
  const doc = buildDocument([article]);
  await triggerDownload(doc, safeFilename(article.title));
}

export async function downloadMultiple(
  articles: Article[],
  filename = "wordetica-articles",
): Promise<void> {
  const doc = buildDocument(articles);
  await triggerDownload(doc, filename);
}

function buildDocument(articles: Article[]): Document {
  return new Document({
    creator: "Wordetica",
    title: articles.length === 1 ? articles[0].title : "Wordetica Articles Export",
    description: "Exported from Wordetica admin dashboard",
    sections: articles.map((a) => ({ children: buildArticleParagraphs(a) })),
  });
}

function buildArticleParagraphs(article: Article): Paragraph[] {
  const ps: Paragraph[] = [];

  ps.push(
    new Paragraph({
      text: article.title || "(Untitled)",
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 240 },
    }),
  );

  ps.push(
    new Paragraph({
      text: "Article Information",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 120 },
    }),
  );

  ps.push(
    ...metaRows([
      ["Status", statusLabel(article.status)],
      ["Category", article.category ? getCategoryLabel(article.category) : "-"],
      [
        "Subcategory",
        article.subcategory ? getSubcategoryLabel(article.category, article.subcategory) : "-",
      ],
      ["Language", article.language ? getArticleLanguageLabel(article.language) : "-"],
      ["Author", article.author_name || article.author_full_name || article.author_email || "-"],
      ["Published", article.published_at ? formatDate(article.published_at) : "-"],
      ["Created", article.created_at ? formatDate(article.created_at) : "-"],
    ]),
  );

  ps.push(
    new Paragraph({
      text: "SEO / Metadata",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 280, after: 120 },
    }),
  );

  ps.push(
    ...metaRows([
      ["Metadata Title", article.metadata_title || "-"],
      ["Metadata Description", article.metadata_description || "-"],
      ["Metadata Image URL", article.metadata_image || "-"],
      ["Excerpt / Summary", article.excerpt || "-"],
      ["Meta Keywords", article.meta_keywords || "-"],
      ["Slug", article.slug || "-"],
      ["OG Title", article.og_title || "-"],
      ["OG Description", article.og_description || "-"],
    ]),
  );

  const trends = article.google_trends_words?.filter(Boolean) ?? [];
  if (trends.length) {
    ps.push(
      new Paragraph({
        text: "Google Trends Keywords",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 120 },
      }),
    );
    trends.forEach((word) => {
      ps.push(
        new Paragraph({
          children: [new TextRun({ text: "• " }), new TextRun({ text: word })],
          indent: { left: 360 },
          spacing: { after: 60 },
        }),
      );
    });
  }

  ps.push(
    new Paragraph({
      text: "Content",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 280, after: 120 },
    }),
  );

  ps.push(...htmlToParagraphs(article.content || ""));

  return ps;
}

function metaRows(rows: [string, string][]): Paragraph[] {
  return rows.map(
    ([label, value]) =>
      new Paragraph({
        children: [
          new TextRun({ text: `${label}: `, bold: true }),
          new TextRun({ text: value }),
        ],
        spacing: { after: 80 },
      }),
  );
}

// ── HTML → docx ─────────────────────────────────────────────────────────────

function htmlToParagraphs(html: string): Paragraph[] {
  if (!html?.trim()) return [new Paragraph({ text: "" })];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const out: Paragraph[] = [];
  walkBlock(doc.body, out);
  return out.length ? out : [new Paragraph({ text: "" })];
}

function walkBlock(el: Element | HTMLElement, out: Paragraph[]): void {
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent ?? "").trim();
      if (text) out.push(new Paragraph({ children: [new TextRun(text)] }));
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const child = node as Element;
    const tag = child.tagName.toLowerCase();

    switch (tag) {
      case "h1":
        out.push(new Paragraph({ text: child.textContent ?? "", heading: HeadingLevel.HEADING_1 }));
        break;
      case "h2":
        out.push(new Paragraph({ text: child.textContent ?? "", heading: HeadingLevel.HEADING_2 }));
        break;
      case "h3":
        out.push(new Paragraph({ text: child.textContent ?? "", heading: HeadingLevel.HEADING_3 }));
        break;
      case "h4":
      case "h5":
      case "h6":
        out.push(new Paragraph({ text: child.textContent ?? "", heading: HeadingLevel.HEADING_4 }));
        break;
      case "p":
      case "div": {
        const runs = inlineRuns(child);
        if (runs.length) {
          out.push(new Paragraph({ children: runs, spacing: { after: 160 } }));
        }
        break;
      }
      case "ul":
      case "ol":
        child.querySelectorAll(":scope > li").forEach((li) => {
          out.push(
            new Paragraph({
              children: [new TextRun({ text: "• " }), ...inlineRuns(li)],
              indent: { left: 360 },
              spacing: { after: 60 },
            }),
          );
        });
        break;
      case "blockquote":
        out.push(
          new Paragraph({
            children: inlineRuns(child),
            indent: { left: 720 },
            spacing: { after: 160 },
          }),
        );
        break;
      case "pre":
        out.push(
          new Paragraph({
            children: [
              new TextRun({ text: child.textContent ?? "", font: "Courier New", size: 18 }),
            ],
            indent: { left: 360 },
            spacing: { after: 160 },
          }),
        );
        break;
      case "br":
        out.push(new Paragraph({ text: "" }));
        break;
      default:
        walkBlock(child as HTMLElement, out);
    }
  });
}

function inlineRuns(el: Element): TextRun[] {
  const runs: TextRun[] = [];
  collectRuns(el.childNodes, runs, {});
  return runs;
}

function collectRuns(nodes: NodeListOf<ChildNode>, runs: TextRun[], fmt: InlineFmt): void {
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (text) {
        runs.push(
          new TextRun({
            text,
            bold: fmt.bold,
            italics: fmt.italics,
            underline: fmt.underline ? {} : undefined,
          }),
        );
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    if (tag === "br") {
      runs.push(new TextRun({ break: 1 }));
      return;
    }
    if (tag === "img") {
      const alt = el.getAttribute("alt");
      if (alt) runs.push(new TextRun({ text: `[image: ${alt}]`, italics: true }));
      return;
    }
    const next: InlineFmt = {
      bold: fmt.bold || tag === "strong" || tag === "b",
      italics: fmt.italics || tag === "em" || tag === "i",
      underline: fmt.underline || tag === "u",
    };
    collectRuns(el.childNodes, runs, next);
  });
}

// ── Utilities ────────────────────────────────────────────────────────────────

async function triggerDownload(doc: Document, filename: string): Promise<void> {
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function safeFilename(title: string): string {
  return `wordetica-${(title || "article")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)}`;
}

function statusLabel(status: string | undefined): string {
  if (status === "published") return "Published";
  if (status === "scheduled") return "Scheduled";
  return "Draft";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ApiError } from "@/lib/api/http";
import { ArticlesApi } from "@/lib/api/articles";
import { AiApi, type AiArticleResult } from "@/lib/api/ai";
import {
  ARTICLE_CATEGORY_TREE,
  ARTICLE_LANGUAGES,
  getArticleLanguageLabel,
  getSubcategoriesForCategory,
  type Article,
  type ArticleCreatePayload,
  type ArticleLanguage,
  type ArticleStatus,
} from "@/types/article";
import {
  getPublishBlockers,
  type PublishCheckItem,
} from "@/lib/article-publish.validation";
import { AI_GENERATE_LABELS, AI_OPTIMISE_LABELS } from "@/lib/ai-assistant.labels";
import {
  APA_STYLE_NOTE,
  ARTICLE_STRUCTURE_SECTIONS,
  defaultSectionWordCounts,
  totalSectionWords,
} from "@/data/article-structure.data";
import { fetchCategoryCoverFile } from "@/data/category-cover.data";
import {
  ARTICLE_IMAGE_ACCEPT,
  ARTICLE_IMAGE_MAX_BYTES,
  isAllowedArticleImage,
} from "@/lib/image-upload.constants";
import {
  articleCoverCacheKey,
  resolveArticleImageUrl,
} from "@/lib/article-image-url";
import { CharCounter } from "@/components/shared/CharCounter";
import { FieldHelp } from "@/components/shared/FieldHelp";
import "./article-create.scss";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

interface FormState {
  title: string;
  excerpt: string;
  authorName: string;
  language: ArticleLanguage | "";
  category: string;
  subcategory: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  slug: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  excerpt: "",
  authorName: "",
  language: "",
  category: "",
  subcategory: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  slug: "",
  canonicalUrl: "",
  robotsIndex: true,
  robotsFollow: true,
  ogTitle: "",
  ogDescription: "",
};

function isCanonicalInvalid(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  try {
    const url = new URL(v);
    return !["http:", "https:"].includes(url.protocol);
  } catch {
    return true;
  }
}

function plainTextFromHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ArticleCreate({ id }: { id?: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const categories = ARTICLE_CATEGORY_TREE;
  const articleLanguages = ARTICLE_LANGUAGES;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [tags, setTags] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [articleId, setArticleId] = useState<number | null>(null);
  const isEditMode = !!id;

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [coverImageError, setCoverImageError] = useState<string | null>(null);
  const [coverManuallyUploaded, setCoverManuallyUploaded] = useState(false);
  const [applyingCategoryCover, setApplyingCategoryCover] = useState(false);

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [publishChecklistOpen, setPublishChecklistOpen] = useState(false);
  const [publishBlockers, setPublishBlockers] = useState<readonly PublishCheckItem[]>([]);
  const [publishIntent, setPublishIntent] = useState<"publish" | "schedule" | null>(null);

  // AI assistant state
  const [aiTopic, setAiTopic] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAction, setAiAction] = useState<"generate" | "optimize" | null>(null);
  const [aiGenerateLang, setAiGenerateLang] = useState<ArticleLanguage | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [aiTrends, setAiTrends] = useState<string[]>([]);
  const [sectionWordCounts, setSectionWordCounts] = useState<Record<string, number>>(
    defaultSectionWordCounts(),
  );

  // Touched/dirty tracking to mirror Angular's "invalid && (dirty || touched)".
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [allTouched, setAllTouched] = useState(false);

  const objectPreviewUrl = useRef<string | null>(null);

  const subcategoryDisabled = form.category === "";
  const subcategoryOptions = getSubcategoriesForCategory(form.category);

  const errors = useMemo(() => {
    const contentText = plainTextFromHtml(form.content);
    return {
      title: form.title === "" || form.title.length > 255,
      excerpt: form.excerpt.length > 320,
      authorName: form.authorName === "" || form.authorName.length > 150,
      language: form.language === "",
      category: form.category === "",
      // subcategory only validates when its control is enabled (category chosen).
      subcategory: form.category !== "" && form.subcategory === "",
      content: form.content === "" || contentText.length < 20,
      metaTitle: form.metaTitle.length > 255,
      metaDescription: form.metaDescription.length > 320,
      canonicalUrl: isCanonicalInvalid(form.canonicalUrl),
      ogTitle: form.ogTitle.length > 255,
      ogDescription: form.ogDescription.length > 320,
    } as Record<string, boolean>;
  }, [form]);

  const formInvalid = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  const markTouched = (name: string) =>
    setTouched((prev) => {
      const next = new Set(prev);
      next.add(name);
      return next;
    });

  const setField = <K extends keyof FormState>(name: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [name]: value }));
    markTouched(name as string);
  };

  const showError = (name: string): boolean =>
    !!errors[name] && (allTouched || touched.has(name));

  const showLanguageError = (): boolean =>
    errors.language && (allTouched || touched.has("language"));

  // ---- Cover image helpers ----
  const clearObjectPreview = () => {
    if (objectPreviewUrl.current) {
      URL.revokeObjectURL(objectPreviewUrl.current);
      objectPreviewUrl.current = null;
    }
  };

  const displayCoverUrl = (): string | null =>
    coverPreviewUrl ?? existingCoverUrl ?? null;

  const applyCategoryCover = async (categorySlug: string) => {
    setApplyingCategoryCover(true);
    setCoverImageError(null);
    try {
      const file = await fetchCategoryCoverFile(categorySlug);
      if (!file) {
        setCoverImageError("Category cover image could not be loaded.");
        return;
      }
      clearObjectPreview();
      setCoverImageFile(file);
      objectPreviewUrl.current = URL.createObjectURL(file);
      setCoverPreviewUrl(objectPreviewUrl.current);
      setExistingCoverUrl(null);
    } catch {
      setCoverImageError("Category cover image could not be loaded.");
    } finally {
      setApplyingCategoryCover(false);
    }
  };

  const onCoverImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    setCoverImageError(null);

    if (!isAllowedArticleImage(file)) {
      setCoverImageError(
        "Unsupported format. Use JPG, JPEG, PNG, GIF, WEBP, BMP, TIFF, ICO, HEIC, HEIF, AVIF, SVG or similar.",
      );
      return;
    }

    if (file.size > ARTICLE_IMAGE_MAX_BYTES) {
      setCoverImageError("Image is too large. Maximum size is 10 MB.");
      return;
    }

    clearObjectPreview();
    setCoverImageFile(file);
    objectPreviewUrl.current = URL.createObjectURL(file);
    setCoverPreviewUrl(objectPreviewUrl.current);
    setCoverManuallyUploaded(true);
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    clearObjectPreview();
    setCoverPreviewUrl(null);
    setExistingCoverUrl(null);
    setCoverImageError(null);
    setCoverManuallyUploaded(false);
    if (form.category) {
      void applyCategoryCover(form.category);
    }
  };

  // ---- Category / language ----
  const onCategoryChange = (value: string) => {
    setForm((f) => ({ ...f, category: value, subcategory: "" }));
    markTouched("category");
    if (value) {
      if (!coverManuallyUploaded) {
        void applyCategoryCover(value);
      }
    }
  };

  const selectLanguage = (code: ArticleLanguage) => {
    setField("language", code);
    markTouched("language");
  };

  // ---- Tags ----
  const addTag = () => setTags((t) => [...t, ""]);
  const removeTag = (index: number) => setTags((t) => t.filter((_, i) => i !== index));
  const updateTag = (index: number, value: string) =>
    setTags((t) => t.map((tag, i) => (i === index ? value : tag)));

  // ---- Load / patch (edit mode) ----
  const loadArticle = (articleIdToLoad: number) => {
    setLoadingArticle(true);
    setServerError(null);
    ArticlesApi.get(articleIdToLoad)
      .then((article) => patchArticle(article))
      .catch((err) => {
        setLoadingArticle(false);
        setServerError(
          err instanceof ApiError && err.status === 404
            ? "Article not found."
            : "Could not load the article.",
        );
      });
  };

  const patchArticle = (article: Article) => {
    setForm({
      title: article.title,
      content: article.content,
      authorName:
        article.author_name || article.author_display_name || article.author_full_name,
      language: (article.language ?? "en") as ArticleLanguage,
      category: article.category,
      subcategory: article.subcategory,
      excerpt: article.excerpt || article.metadata_description,
      metaTitle: article.metadata_title,
      metaDescription: article.metadata_description,
      metaKeywords: article.meta_keywords,
      slug: article.slug,
      canonicalUrl: "",
      robotsIndex: true,
      robotsFollow: true,
      ogTitle: article.og_title || article.metadata_title,
      ogDescription: article.og_description || article.metadata_description,
    });
    setAiTrends(article.google_trends_words || []);
    setCoverManuallyUploaded(false);
    setCoverImageFile(null);
    clearObjectPreview();
    setExistingCoverUrl(
      article.image ? resolveArticleImageUrl(article.image, articleCoverCacheKey(article)) : null,
    );
    setCoverPreviewUrl(null);
    setLoadingArticle(false);
    if (!article.image && article.category) {
      void applyCategoryCover(article.category);
    }
  };

  const prefillAuthorName = () => {
    if (!user) return;
    const name = `${user.first_name} ${user.last_name}`.trim();
    if (name) {
      setForm((f) => (f.authorName ? f : { ...f, authorName: name }));
    }
  };

  useEffect(() => {
    if (!id) {
      prefillAuthorName();
      return;
    }
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      setServerError("Invalid article id.");
      return;
    }
    setArticleId(numericId);
    loadArticle(numericId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => () => clearObjectPreview(), []);

  // ---- Reset ----
  const requestReset = () => setResetConfirmOpen(true);
  const cancelReset = () => setResetConfirmOpen(false);
  const confirmReset = () => {
    setResetConfirmOpen(false);
    executeReset();
  };

  const executeReset = () => {
    if (isEditMode && articleId) {
      loadArticle(articleId);
      return;
    }
    setForm(EMPTY_FORM);
    setTags([]);
    removeCoverImage();
    setSuccess(false);
    setServerError(null);
    setTouched(new Set());
    setAllTouched(false);
    prefillAuthorName();
  };

  // ---- Publish flow ----
  const todayValue = todayIso();

  const collectPublishBlockers = (): PublishCheckItem[] => {
    const formBlockers = getPublishBlockers({
      title: form.title,
      authorName: form.authorName,
      language: form.language,
      category: form.category,
      subcategory: form.subcategory,
      contentHtml: form.content,
      excerpt: form.excerpt,
      metaDescription: form.metaDescription,
      hasCoverImage: !!displayCoverUrl(),
      canonicalUrlInvalid: isCanonicalInvalid(form.canonicalUrl),
    });

    if (coverImageError) {
      return [
        { id: "coverImage", label: coverImageError, anchorId: "coverImage" },
        ...formBlockers.filter((b) => b.id !== "coverImage"),
      ];
    }

    return formBlockers;
  };

  const ensureReadyToPublish = (intent: "publish" | "schedule"): boolean => {
    setAllTouched(true);
    setPublishIntent(intent);

    const blockers = collectPublishBlockers();
    if (blockers.length > 0) {
      setPublishBlockers(blockers);
      setPublishChecklistOpen(true);
      setServerError(null);
      return false;
    }

    setPublishBlockers([]);
    setPublishChecklistOpen(false);
    return true;
  };

  const closePublishChecklist = () => {
    setPublishChecklistOpen(false);
    setPublishIntent(null);
  };

  const goToPublishField = (item: PublishCheckItem) => {
    setPublishChecklistOpen(false);
    setAllTouched(true);

    requestAnimationFrame(() => {
      const el = document.getElementById(item.anchorId);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      if (item.anchorId === "section-content") {
        const editor = el.querySelector<HTMLElement>(".ql-editor");
        if (editor) {
          editor.focus();
          return;
        }
      }

      const focusable = el.querySelector<HTMLElement>(
        "input:not([type=file]), select, textarea, button.lang-select",
      );
      if (
        focusable &&
        !("disabled" in focusable && (focusable as HTMLButtonElement).disabled)
      ) {
        focusable.focus();
      } else if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement
      ) {
        el.focus();
      }
    });
  };

  const cancelSchedule = () => {
    setScheduleDialogOpen(false);
    setScheduleError(null);
  };

  const openScheduleDialog = () => {
    if (!ensureReadyToPublish("schedule")) return;
    setScheduleError(null);
    setScheduleDate(todayIso());
    setScheduleDialogOpen(true);
  };

  const confirmSchedule = () => {
    if (!ensureReadyToPublish("schedule")) {
      setScheduleDialogOpen(false);
      return;
    }
    const date = scheduleDate.trim();
    if (!date) {
      setScheduleError("Choose a publish date.");
      return;
    }
    if (date < todayIso()) {
      setScheduleError("The date must be today or in the future.");
      return;
    }
    setScheduleDialogOpen(false);
    saveWithStatus("scheduled", date);
  };

  const saveDraft = () => saveWithStatus("draft");
  const savePublish = () => {
    if (!ensureReadyToPublish("publish")) return;
    saveWithStatus("published", todayIso());
  };

  const adminListPath = (status: ArticleStatus): string => {
    if (status === "draft") return "/admin/articles/drafts";
    if (status === "scheduled") return "/admin/articles/scheduled";
    return "/admin/articles";
  };

  const parseError = (err: unknown): string => {
    if (err instanceof ApiError) {
      if (err.status === 400 && err.error && typeof err.error === "object") {
        const messages = Object.entries(err.error as Record<string, unknown>)
          .map(
            ([field, value]) =>
              `${field}: ${Array.isArray(value) ? value.join(", ") : String(value)}`,
          )
          .join(" - ");
        return messages || "Validation failed.";
      }
      if (err.status === 401 || err.status === 403) {
        return isEditMode
          ? "You are not authorised to edit articles."
          : "You are not authorised to create articles.";
      }
      if (err.status === 0) return "Could not reach the server.";
    }
    return isEditMode
      ? "Could not update the article. Please try again."
      : "Could not save the article. Please try again.";
  };

  const saveWithStatus = (status: ArticleStatus, publishedAt?: string) => {
    if (submitting || loadingArticle) return;

    if (status !== "draft") {
      if (!ensureReadyToPublish(status === "scheduled" ? "schedule" : "publish")) return;
    } else {
      setAllTouched(true);
      if (formInvalid) return;
    }

    const payload: ArticleCreatePayload = {
      title: form.title.trim(),
      content: form.content,
      author_name: form.authorName.trim(),
      language: form.language ? (form.language as ArticleLanguage) : undefined,
      category: form.category || undefined,
      subcategory: form.subcategory || undefined,
      published_at: publishedAt,
      status,
      metadata_title: form.metaTitle.trim() || form.ogTitle.trim() || undefined,
      metadata_description:
        form.metaDescription.trim() ||
        form.ogDescription.trim() ||
        form.excerpt.trim() ||
        undefined,
      excerpt: form.excerpt.trim() || undefined,
      meta_keywords: form.metaKeywords.trim() || undefined,
      slug: form.slug.trim() || undefined,
      og_title: form.ogTitle.trim() || undefined,
      og_description: form.ogDescription.trim() || undefined,
      google_trends_words: aiTrends.length ? aiTrends : undefined,
    };

    const coverFile = coverImageFile;

    setSubmitting(true);
    setServerError(null);
    setSuccess(false);

    const request =
      isEditMode && articleId
        ? ArticlesApi.update(articleId, payload, coverFile)
        : ArticlesApi.create(payload, coverFile);

    request
      .then(() => {
        setSubmitting(false);
        setSuccess(true);
        router.push(adminListPath(status));
      })
      .catch((err) => {
        setSubmitting(false);
        setServerError(parseError(err));
      });
  };

  // ---- AI assistant ----
  const currentLanguage = (): string => form.language || "ro";

  const isGeneratingLang = (lang: ArticleLanguage): boolean =>
    aiLoading && aiAction === "generate" && aiGenerateLang === lang;

  const generateButtonLabel = (lang: ArticleLanguage): string => {
    const labels = AI_GENERATE_LABELS[lang];
    return isGeneratingLang(lang) ? labels.generating : labels.generate;
  };

  const totalStructureWords = (): number => totalSectionWords(sectionWordCounts);

  const updateSectionWordCount = (sectionId: string, raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    const value = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    setSectionWordCounts((prev) => ({ ...prev, [sectionId]: value }));
  };

  const resetStructureWordCounts = () => setSectionWordCounts(defaultSectionWordCounts());

  const extractApiDetail = (err: unknown): string | null => {
    if (!(err instanceof ApiError)) return null;
    const body = err.error;
    if (!body) return null;
    if (typeof body === "object" && body !== null && "detail" in body) {
      const detail = (body as { detail: unknown }).detail;
      if (typeof detail === "string" && detail.trim()) return detail.trim();
      if (Array.isArray(detail)) return detail.map(String).join(" ");
    }
    if (typeof body === "string" && body.trim().length < 500 && !body.includes("<html")) {
      return body.trim();
    }
    return null;
  };

  const handleAiError = (err: unknown) => {
    setAiLoading(false);
    setAiAction(null);
    setAiGenerateLang(null);

    const detail = extractApiDetail(err);
    if (detail) {
      setAiError(detail);
      return;
    }

    const status = err instanceof ApiError ? err.status : undefined;
    if (status === 401 || status === 403) {
      setAiError("You must be signed in as an admin to use the AI assistant.");
    } else if (status === 0) {
      setAiError(
        "Could not reach the server. The request may have timed out - try again with lower word counts.",
      );
    } else if (status === 504 || status === 408) {
      setAiError(
        "Generation timed out (the article is large). Lower section word counts or wait and try again.",
      );
    } else if (status === 502 || status === 503) {
      setAiError("The AI service is temporarily unavailable. Please try again in a moment.");
    } else {
      setAiError(`AI request failed (${status || "unknown"}). Please try again.`);
    }
  };

  const applyAiResult = (result: AiArticleResult, notice: string, lang: ArticleLanguage | null) => {
    setForm((f) => ({
      ...f,
      ...(lang ? { language: lang } : {}),
      title: result.h1?.trim() || f.title,
      content: result.article?.trim() || f.content,
      metaTitle: result.meta_title?.trim() || f.metaTitle,
      metaDescription: result.meta_description?.trim() || f.metaDescription,
      excerpt: result.meta_description?.trim() || f.excerpt,
      slug: result.slug?.trim() || f.slug,
      metaKeywords: (result.keywords || []).join(", ") || f.metaKeywords,
      ogTitle: result.meta_title?.trim() || f.ogTitle,
      ogDescription: result.meta_description?.trim() || f.ogDescription,
    }));

    const resultTags = result.tags || [];
    if (resultTags.length) {
      setTags(resultTags.filter((t) => t?.trim()).map((t) => t.trim()));
    }

    setAiTrends(result.google_trends_queries || []);
    setAiLoading(false);
    setAiAction(null);
    setAiGenerateLang(null);
    setAiNotice(notice);
  };

  const generateArticle = (language: ArticleLanguage) => {
    if (aiLoading) return;
    const topic = (aiTopic || form.title || "").trim();
    if (!topic) {
      setAiError("Add a topic (or a title) before generating.");
      return;
    }

    selectLanguage(language);
    setAiError(null);
    setAiNotice(null);
    setAiLoading(true);
    setAiAction("generate");
    setAiGenerateLang(language);

    if (totalStructureWords() < 1) {
      setAiError("Set at least one target word count before generating.");
      setAiLoading(false);
      setAiAction(null);
      setAiGenerateLang(null);
      return;
    }

    const existing = plainTextFromHtml(form.content).replace(/\s+/g, " ").trim();
    AiApi.generate({
      topic,
      language,
      existing_content: existing || undefined,
      section_word_counts: sectionWordCounts,
    })
      .then((result) =>
        applyAiResult(
          result,
          `Article generated in ${language.toUpperCase()} and fields populated.`,
          language,
        ),
      )
      .catch((err) => handleAiError(err));
  };

  const optimizeArticle = () => {
    if (aiLoading) return;
    const content = form.content;
    if (plainTextFromHtml(content).replace(/\s+/g, " ").trim().length < 20) {
      setAiError("Write some content first, then optimise it.");
      return;
    }

    setAiError(null);
    setAiNotice(null);
    setAiLoading(true);
    setAiAction("optimize");

    AiApi.optimize({
      existing_content: content,
      topic: (aiTopic || form.title || "").trim() || undefined,
      language: currentLanguage(),
    })
      .then((result) =>
        applyAiResult(result, "Article optimised and SEO fields updated.", null),
      )
      .catch((err) => handleAiError(err));
  };

  const cover = displayCoverUrl();

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>{isEditMode ? "Edit article" : "New article"}</h1>
          <p>
            {isEditMode
              ? "Update content, category and SEO metadata."
              : "Compose, optimise for search and publish to Wordetica."}
          </p>
        </div>
        <Link href="/admin/articles" className="wo-btn wo-btn--ghost">
          Cancel
        </Link>
      </header>

      {loadingArticle && <div className="state">Loading article…</div>}

      {!loadingArticle && (
        <section className="ai-panel">
          <div className="ai-panel__head">
            <h2 className="ai-panel__title">AI assistant</h2>
            <p className="ai-panel__subtitle">
              Set topic and section lengths, then generate. Review all fields before publishing.
            </p>
          </div>

          <div className="ai-panel__setup">
            <div className="ai-panel__card ai-panel__card--topic">
              <h3 className="ai-panel__card-title">1. Topic</h3>
              <p className="ai-panel__card-lead">What should the article be about?</p>
              <label className="sr-only" htmlFor="ai-topic">
                Article topic
              </label>
              <div className="ai-panel__topic-editor">
                <textarea
                  id="ai-topic"
                  className="wo-textarea ai-panel__topic-field"
                  rows={5}
                  placeholder="e.g. Cognitive offloading in language learning classrooms"
                  value={aiTopic}
                  onChange={(e) => {
                    setAiTopic(e.target.value);
                    setAiError(null);
                  }}
                ></textarea>
              </div>
              <p className="ai-panel__topic-hint">Drag the bottom-right corner to resize.</p>
            </div>

            <div className="ai-panel__card ai-panel__card--layout">
              <div className="ai-panel__card-head">
                <div>
                  <h3 className="ai-panel__card-title">2. Article layout</h3>
                  <p className="ai-panel__card-lead">
                    {APA_STYLE_NOTE} · total {totalStructureWords()} words
                  </p>
                </div>
                <button
                  type="button"
                  className="wo-btn wo-btn--ghost wo-btn--small"
                  onClick={resetStructureWordCounts}
                >
                  Reset
                </button>
              </div>

              <div className="ai-panel__table-wrap">
                <table className="ai-panel__table">
                  <thead>
                    <tr>
                      <th scope="col">Section</th>
                      <th scope="col" className="ai-panel__col-words">
                        Words
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ARTICLE_STRUCTURE_SECTIONS.map((section) => (
                      <tr key={section.id}>
                        <th scope="row" className="ai-panel__section-name">
                          {section.title}
                          {section.hint && (
                            <span className="ai-panel__section-hint" title={section.hint}>
                              {section.hint}
                            </span>
                          )}
                        </th>
                        <td className="ai-panel__col-words">
                          <input
                            className="wo-input ai-panel__word-input"
                            type="number"
                            min={0}
                            max={20000}
                            step={50}
                            aria-label={`Target words for ${section.title}`}
                            value={sectionWordCounts[section.id]}
                            onChange={(e) => updateSectionWordCount(section.id, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="ai-panel__body">
            <p className="ai-panel__step-label">3. Generate or optimise</p>
            <div className="ai-panel__actions">
              <div className="ai-panel__group ai-panel__group--generate">
                <span className="ai-panel__group-label">New article by language</span>
                <div className="ai-panel__grid">
                  {articleLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`wo-btn wo-btn--primary ai-panel__lang-btn${
                        isGeneratingLang(lang.code) ? " ai-panel__lang-btn--generating" : ""
                      }`}
                      onClick={() => generateArticle(lang.code)}
                      disabled={aiLoading}
                      aria-busy={isGeneratingLang(lang.code)}
                      aria-label={generateButtonLabel(lang.code)}
                    >
                      {isGeneratingLang(lang.code) && (
                        <span className="ai-gen-pulse" aria-hidden="true">
                          <span className="ai-gen-pulse__ring ai-gen-pulse__ring--1"></span>
                          <span className="ai-gen-pulse__ring ai-gen-pulse__ring--2"></span>
                          <span className="ai-gen-pulse__core"></span>
                        </span>
                      )}
                      <span
                        className={`ai-panel__lang-btn-inner${
                          isGeneratingLang(lang.code) ? " ai-panel__lang-btn-inner--hidden" : ""
                        }`}
                      >
                        <span className="ai-panel__lang-code">{lang.code.toUpperCase()}</span>
                        <span className="ai-panel__lang-text">
                          {generateButtonLabel(lang.code)}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="ai-panel__divider" aria-hidden="true"></div>

              <div className="ai-panel__group ai-panel__group--optimise">
                <span className="ai-panel__group-label">Optimise existing draft</span>
                <button
                  type="button"
                  className="wo-btn wo-btn--ghost ai-panel__optimise-btn"
                  onClick={optimizeArticle}
                  disabled={aiLoading}
                >
                  {aiLoading && aiAction === "optimize"
                    ? AI_OPTIMISE_LABELS.optimising
                    : AI_OPTIMISE_LABELS.optimise}
                </button>
              </div>
            </div>
          </div>

          {aiError && <p className="wo-error">{aiError}</p>}
          {aiNotice && <p className="ai-panel__notice">{aiNotice}</p>}

          {aiTrends.length > 0 && (
            <div className="ai-panel__trends">
              <span className="ai-panel__trends-label">Google Trends:</span>
              {aiTrends.map((q, i) => (
                <span className="ai-panel__chip" key={`${q}-${i}`}>
                  {q}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {!loadingArticle && (
        <form noValidate className="layout" onSubmit={(e) => e.preventDefault()}>
          {/* Core fields */}
          <section className="card">
            <h2 className="card__heading">Article</h2>

            <div className="field">
              <label className="wo-label wo-label--with-help" htmlFor="title">
                Title *
                <FieldHelp
                  hint="The main headline readers see on the site and in search results. Keep it specific, under ~70 characters, and include the topic or benefit."
                  example="How cultural context shapes NMT output in legal EN→RO translation"
                />
              </label>
              <input
                id="title"
                className="wo-input"
                maxLength={255}
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                onBlur={() => markTouched("title")}
              />
              <CharCounter value={form.title} max={255} />
              {showError("title") && <p className="wo-error">A title is required.</p>}
            </div>

            <div className="field">
              <label className="wo-label wo-label--with-help" htmlFor="excerpt">
                Excerpt / summary
                <FieldHelp
                  hint="A short preview (1–2 sentences) for article cards and social snippets. Summarise the insight, not the whole article."
                  example="Why generic NMT struggles with jurisdiction-specific terms-and a quick checklist before you publish technical EN→RO texts."
                />
              </label>
              <textarea
                id="excerpt"
                className="wo-textarea"
                rows={3}
                maxLength={320}
                value={form.excerpt}
                onChange={(e) => setField("excerpt", e.target.value)}
              ></textarea>
              <CharCounter value={form.excerpt} max={320} />
            </div>

            <div className="row row--triple">
              <div className="field">
                <label className="wo-label wo-label--with-help" htmlFor="authorName">
                  Author *
                  <FieldHelp
                    hint="The name shown on the public article page. Use your byline or full name as readers should see it."
                    example="Dr. Maria Popescu"
                  />
                </label>
                <input
                  id="authorName"
                  className="wo-input"
                  maxLength={150}
                  placeholder="Author name"
                  value={form.authorName}
                  onChange={(e) => setField("authorName", e.target.value)}
                  onBlur={() => markTouched("authorName")}
                />
                {showError("authorName") && (
                  <p className="wo-error">Author name is required.</p>
                )}
              </div>

              <div className="field">
                <label className="wo-label wo-label--with-help" htmlFor="category">
                  Category *
                  <FieldHelp
                    hint="The broad research theme so visitors can browse Wordetica by topic. Choose the area that best matches your article’s main focus."
                    example="Translation & Interpreting Practice - for field notes on real interpreting or adaptation challenges."
                  />
                </label>
                <select
                  id="category"
                  className="wo-select"
                  value={form.category}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  onBlur={() => markTouched("category")}
                >
                  <option value="" disabled>
                    Select a category…
                  </option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {showError("category") && <p className="wo-error">Please choose a category.</p>}
              </div>

              <div className="field">
                <label className="wo-label wo-label--with-help" htmlFor="subcategory">
                  Subcategory *
                  <FieldHelp
                    hint="The specific angle within the category. This helps readers find related articles and keeps the Research section organised."
                    example="Cultural adaptation in translation - when your piece focuses on locale, register, or audience-specific wording."
                  />
                </label>
                <select
                  id="subcategory"
                  className="wo-select"
                  value={form.subcategory}
                  disabled={subcategoryDisabled}
                  onChange={(e) => setField("subcategory", e.target.value)}
                  onBlur={() => markTouched("subcategory")}
                >
                  <option value="" disabled>
                    Select a subcategory…
                  </option>
                  {subcategoryOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {showError("subcategory") && (
                  <p className="wo-error">Please choose a subcategory.</p>
                )}
              </div>
            </div>

            <div id="section-language" className="field field--language">
              <label className="wo-label wo-label--with-help">
                Limba *
                <FieldHelp
                  hint="Limba în care este scris articolul. Apare ca etichetă în Research și pe pagina articolului."
                  example="EN pentru un articol în engleză, RO pentru română."
                />
              </label>
              <div className="language-row" role="group" aria-label="Limba articolului">
                {articleLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`lang-select${form.language === lang.code ? " is-selected" : ""}`}
                    aria-pressed={form.language === lang.code}
                    onClick={() => selectLanguage(lang.code)}
                  >
                    <span className="lang-select__code">{lang.code.toUpperCase()}</span>
                    <span className="lang-select__name">{lang.label}</span>
                  </button>
                ))}
              </div>
              {form.language && (
                <p className="language-row__preview">
                  <span className="language-row__preview-label">Selectat:</span>
                  <span className="wo-tag wo-tag--accent">
                    {getArticleLanguageLabel(form.language)}
                  </span>
                </p>
              )}
              {showLanguageError() && (
                <p className="wo-error language-row__error">
                  Selectează limba articolului (EN, FR, RO sau ES).
                </p>
              )}
            </div>

            <div className="field field--cover">
              <label className="wo-label wo-label--with-help" htmlFor="coverImage">
                Cover image
                <FieldHelp
                  hint="Upload the main photo for this article (shown on the article page and in Research listings). JPG, JPEG, PNG, GIF, WEBP, BMP, TIFF, ICO, HEIC, HEIF, AVIF, SVG and similar formats are supported (max 10 MB)."
                  example="A 1200×630 px photo or diagram that illustrates your topic-e.g. a comparison chart for NMT vs human translation."
                />
              </label>

              <div className="cover-upload">
                {cover && (
                  <div className="cover-upload__preview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cover} alt="Cover preview" />
                    <button
                      type="button"
                      className="cover-upload__remove"
                      onClick={removeCoverImage}
                      aria-label="Remove cover image"
                    >
                      Remove image
                    </button>
                  </div>
                )}
                <label className="cover-upload__zone" htmlFor="coverImage">
                  <span className="cover-upload__icon" aria-hidden="true">
                    ↑
                  </span>
                  <span className="cover-upload__title">
                    {cover ? "Replace cover image" : "Upload cover image"}
                  </span>
                  <span className="cover-upload__hint">
                    {applyingCategoryCover
                      ? "Loading category cover…"
                      : "Default cover is set from category - replace with your own file (max 10 MB)"}
                  </span>
                  <input
                    id="coverImage"
                    type="file"
                    className="image-upload__input"
                    accept={ARTICLE_IMAGE_ACCEPT}
                    onChange={onCoverImageSelected}
                  />
                </label>
              </div>

              {coverImageError && <p className="wo-error">{coverImageError}</p>}
            </div>

            <div className="field">
              <label className="wo-label">Tags</label>
              <div className="tags">
                {tags.map((tag, i) => (
                  <span className="tag" key={i}>
                    <input
                      className="tag__input"
                      placeholder="tag"
                      value={tag}
                      onChange={(e) => updateTag(i, e.target.value)}
                    />
                    <button
                      type="button"
                      className="tag__remove"
                      onClick={() => removeTag(i)}
                      aria-label="Remove tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  className="wo-btn wo-btn--ghost wo-btn--small"
                  onClick={addTag}
                >
                  + Add tag
                </button>
              </div>
            </div>
          </section>

          {/* Content editor */}
          <section id="section-content" className="card">
            <h2 className="card__heading">
              Content *
              <FieldHelp
                tipLabel="How to structure"
                hint="The full article body. Use clear H2/H3 headings, short paragraphs, and examples from language work (translation, interpreting, editing, or AI-assisted workflows)."
                example="Start with the problem → explain your approach → end with 2–3 practical takeaways. E.g. “When post-editing NMT for medical leaflets, always verify dosage units and local regulatory phrasing.”"
              />
            </h2>
            <div className="content-editor">
              <div className="content-editor__viewport" aria-label="Article content scroll area">
                <ReactQuill
                  theme="snow"
                  modules={QUILL_MODULES}
                  placeholder="Start writing…"
                  value={form.content}
                  onChange={(value: string) => setField("content", value)}
                />
              </div>
            </div>
            <CharCounter value={form.content} stripHtml />
            {showError("content") && (
              <p className="wo-error">Article content must be at least 20 characters.</p>
            )}
          </section>

          {/* SEO */}
          <section className="card">
            <h2 className="card__heading">
              SEO metadata
              <FieldHelp
                tipLabel="Why this matters"
                hint="These fields help Google and other search engines understand and display your article. If left empty, the site may fall back to the title and excerpt."
                example="A strong meta title + description can improve click-through from search when someone looks for “human vs machine translation quality”."
              />
            </h2>

            <div className="field">
              <label className="wo-label wo-label--with-help" htmlFor="metaTitle">
                Meta title
                <FieldHelp
                  hint="Title shown in browser tabs and Google results (often 50–60 characters). Can match the article title or add context/brand."
                  example="Human vs Machine Translation Quality in Technical English | Wordetica"
                />
              </label>
              <input
                id="metaTitle"
                className="wo-input"
                maxLength={255}
                value={form.metaTitle}
                onChange={(e) => setField("metaTitle", e.target.value)}
              />
              <CharCounter value={form.metaTitle} max={255} />
            </div>

            <div className="field">
              <label className="wo-label wo-label--with-help" htmlFor="metaDescription">
                Meta description
                <FieldHelp
                  hint="The grey snippet under the link in search results (~150–160 characters). Describe the value of reading the article."
                  example="We compare post-editing time and accuracy on EN→RO technical texts when using NMT versus a human translator-with a simple scoring rubric you can reuse."
                />
              </label>
              <textarea
                id="metaDescription"
                className="wo-textarea"
                rows={3}
                maxLength={320}
                value={form.metaDescription}
                onChange={(e) => setField("metaDescription", e.target.value)}
              ></textarea>
              <CharCounter value={form.metaDescription} max={320} />
            </div>

            <div className="row">
              <div className="field">
                <label className="wo-label wo-label--with-help" htmlFor="metaKeywords">
                  Meta keywords
                  <FieldHelp
                    hint="Optional comma-separated terms related to your topic. Less important for Google today, but useful for internal consistency."
                    example="neural machine translation, post-editing, EN-RO, technical translation, quality assessment"
                  />
                </label>
                <input
                  id="metaKeywords"
                  className="wo-input"
                  placeholder="ai, translation, llm"
                  value={form.metaKeywords}
                  onChange={(e) => setField("metaKeywords", e.target.value)}
                />
              </div>

              <div className="field">
                <label className="wo-label wo-label--with-help" htmlFor="slug">
                  Slug
                  <FieldHelp
                    hint="The URL-friendly version of the title (lowercase, hyphens, no spaces). Used if you add pretty URLs later."
                    example="human-vs-machine-translation-quality-technical-english"
                  />
                </label>
                <input
                  id="slug"
                  className="wo-input"
                  placeholder="how-llms-translate"
                  value={form.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label className="wo-label wo-label--with-help" htmlFor="canonical">
                Canonical URL
                <FieldHelp
                  hint="Tell search engines which URL is the “official” version if the same content exists elsewhere. Leave blank to use the article’s own URL."
                  example="https://wordetica.eu/articles/42"
                />
              </label>
              <input
                id="canonical"
                type="url"
                className="wo-input"
                placeholder="https://wordetica.eu/articles/…"
                value={form.canonicalUrl}
                onChange={(e) => setField("canonicalUrl", e.target.value)}
                onBlur={() => markTouched("canonicalUrl")}
              />
              {showError("canonicalUrl") && (
                <p className="wo-error">Please enter a valid URL.</p>
              )}
            </div>

            <fieldset className="robots">
              <legend className="wo-label wo-label--with-help">
                Robots
                <FieldHelp
                  hint="Control whether search engines index this page and follow links inside it. Usually leave both enabled for published research articles."
                  example="Published article: indexing ON, follow links ON. Draft or duplicate: turn indexing OFF until ready."
                />
              </legend>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={form.robotsIndex}
                  onChange={(e) => setField("robotsIndex", e.target.checked)}
                />{" "}
                Allow indexing (index / noindex)
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={form.robotsFollow}
                  onChange={(e) => setField("robotsFollow", e.target.checked)}
                />{" "}
                Allow following links (follow / nofollow)
              </label>
            </fieldset>
          </section>

          {/* Open Graph */}
          <section className="card">
            <h2 className="card__heading">
              Open Graph
              <FieldHelp
                tipLabel="Social sharing"
                hint="Controls how the article looks when shared on LinkedIn, Facebook, X, etc. The cover image is used for social previews. If empty, meta title/description or the excerpt may be used."
                example="A clear OG title helps your research post stand out in a professional feed."
              />
            </h2>

            <div className="field">
              <label className="wo-label wo-label--with-help" htmlFor="ogTitle">
                OG title
                <FieldHelp
                  hint="Headline on the social preview card. Can be punchier or shorter than the article title."
                  example="NMT vs human translation: what we learned from 50 technical pages"
                />
              </label>
              <input
                id="ogTitle"
                className="wo-input"
                maxLength={255}
                value={form.ogTitle}
                onChange={(e) => setField("ogTitle", e.target.value)}
              />
              <CharCounter value={form.ogTitle} max={255} />
            </div>

            <div className="field">
              <label className="wo-label wo-label--with-help" htmlFor="ogDescription">
                OG description
                <FieldHelp
                  hint="Short text under the OG title on social networks. Aim for curiosity and clarity in one or two sentences."
                  example="Field notes from comparing post-editing effort on EN→RO legal and medical texts-with a checklist for your next project."
                />
              </label>
              <textarea
                id="ogDescription"
                className="wo-textarea"
                rows={2}
                maxLength={320}
                value={form.ogDescription}
                onChange={(e) => setField("ogDescription", e.target.value)}
              ></textarea>
              <CharCounter value={form.ogDescription} max={320} />
            </div>
          </section>

          <footer className="actions">
            {serverError && <p className="wo-error">{serverError}</p>}
            {success && <p className="success">Article saved.</p>}

            <div className="actions__buttons">
              <button
                type="button"
                className="wo-btn wo-btn--ghost"
                onClick={requestReset}
                disabled={submitting}
              >
                {isEditMode ? "Revert changes" : "Reset"}
              </button>
              <button
                type="button"
                className="wo-btn wo-btn--ghost"
                onClick={saveDraft}
                disabled={submitting || formInvalid}
              >
                {submitting ? "Saving…" : "Draft"}
              </button>
              <button
                type="button"
                className="wo-btn wo-btn--ghost"
                onClick={openScheduleDialog}
                disabled={submitting || loadingArticle}
              >
                Scheduled
              </button>
              <button
                type="button"
                className="wo-btn wo-btn--primary"
                onClick={savePublish}
                disabled={submitting || loadingArticle}
              >
                {submitting ? "Saving…" : "Publish"}
              </button>
            </div>
          </footer>
        </form>
      )}

      {resetConfirmOpen && (
        <div className="dialog-backdrop" role="presentation" onClick={cancelReset}>
          <div
            className="dialog"
            role="alertdialog"
            aria-labelledby="reset-dialog-title"
            aria-describedby="reset-dialog-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="reset-dialog-title" className="dialog__title">
              Reset form?
            </h2>
            <p id="reset-dialog-desc" className="dialog__text">
              {isEditMode
                ? "Unsaved changes will be discarded and the article reloaded from the server."
                : "All fields will be cleared. This cannot be undone."}
            </p>
            <div className="dialog__actions">
              <button type="button" className="wo-btn wo-btn--ghost" onClick={cancelReset}>
                Refuse
              </button>
              <button type="button" className="wo-btn wo-btn--primary" onClick={confirmReset}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {publishChecklistOpen && (
        <div className="dialog-backdrop" role="presentation" onClick={closePublishChecklist}>
          <div
            className="dialog dialog--checklist"
            role="alertdialog"
            aria-labelledby="publish-checklist-title"
            aria-describedby="publish-checklist-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="publish-checklist-title" className="dialog__title">
              {publishIntent === "schedule"
                ? "Complete before scheduling"
                : "Complete before publishing"}
            </h2>
            <p id="publish-checklist-desc" className="dialog__text">
              The following information is missing or invalid. Select an item to jump to that
              field.
            </p>
            <ul className="publish-checklist">
              {publishBlockers.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="publish-checklist__link"
                    onClick={() => goToPublishField(item)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="dialog__actions">
              <button
                type="button"
                className="wo-btn wo-btn--primary"
                onClick={closePublishChecklist}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {scheduleDialogOpen && (
        <div className="dialog-backdrop" role="presentation" onClick={cancelSchedule}>
          <div
            className="dialog"
            role="dialog"
            aria-labelledby="schedule-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="schedule-dialog-title" className="dialog__title">
              Schedule publication
            </h2>
            <p className="dialog__text">Choose the date when this article should go live.</p>
            <label className="wo-label" htmlFor="scheduleDate">
              Publish date
            </label>
            <input
              id="scheduleDate"
              type="date"
              className="wo-input dialog__date"
              value={scheduleDate}
              min={todayValue}
              onChange={(e) => {
                setScheduleDate(e.target.value);
                setScheduleError(null);
              }}
            />
            {scheduleError && <p className="wo-error">{scheduleError}</p>}
            <div className="dialog__actions">
              <button type="button" className="wo-btn wo-btn--ghost" onClick={cancelSchedule}>
                Cancel
              </button>
              <button type="button" className="wo-btn wo-btn--primary" onClick={confirmSchedule}>
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

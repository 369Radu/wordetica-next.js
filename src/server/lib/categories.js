/** Article category taxonomy (mirrors Django apps/articles/categories.py). */

export const CATEGORY_TREE = [
  [
    "teaching-learning-age-of-ai",
    "Teaching & Learning in the Age of AI",
    [
      [
        "learning-design-pedagogy-assessment",
        "Language Learning Design, Pedagogy & Assessment",
      ],
      [
        "human-centered-edtech-genai-agentic-ai",
        "Human-centered EdTech, GenAI & Agentic AI",
      ],
      [
        "lifelong-learning-upskilling-future-ready-skills",
        "Lifelong Learning, Upskilling & Future-Ready Skills",
      ],
    ],
  ],
  [
    "academic-writing-research-age-of-ai",
    "Academic Writing & Research Communication in the Age of AI",
    [
      [
        "scholarly-writing-academic-communication",
        "Scholarly Writing & Academic Communication",
      ],
      [
        "research-methods-literature-reviews-reference-management",
        "Research Methods, Literature Reviews & Reference Management",
      ],
      [
        "ai-assisted-research-publishing-research-impact",
        "AI-Assisted Research, Publishing & Research Impact",
      ],
    ],
  ],
  [
    "neurodiversity-inclusion-age-of-ai",
    "Neurodiversity & Inclusion in the Age of AI",
    [
      ["neurodiversity-ai-enhanced-learning", "Neurodiversity & AI-Enhanced Learning"],
      [
        "inclusive-design-accessibility-communication",
        "Inclusive Design, Accessibility & Communication",
      ],
      [
        "workplace-inclusion-learning-assistive-ai",
        "Workplace Inclusion, Learning & Assistive AI",
      ],
    ],
  ],
  [
    "localization-age-of-ai",
    "Localization in the Age of AI",
    [
      ["ai-assisted-translation-localization", "AI-Assisted Translation & Localization"],
      [
        "cross-cultural-communication-global-content-strategy",
        "Cross-Cultural Communication & Global Content Strategy",
      ],
      [
        "localized-user-experience-intelligent-personalization",
        "Localized User Experience & Intelligent Personalization",
      ],
    ],
  ],
];

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORY_TREE.map(([slug, label]) => [slug, label]),
);

export const SUBCATEGORY_LABELS = Object.fromEntries(
  CATEGORY_TREE.flatMap(([, , subs]) => subs.map(([slug, label]) => [slug, label])),
);

const CATEGORY_SLUGS = new Set(CATEGORY_TREE.map(([slug]) => slug));
const SUBCATEGORY_BY_CATEGORY = Object.fromEntries(
  CATEGORY_TREE.map(([cat, , subs]) => [cat, new Set(subs.map(([s]) => s))]),
);

export function isValidCategory(value) {
  return CATEGORY_SLUGS.has(value);
}

export function isValidSubcategory(category, subcategory) {
  if (!subcategory) return true;
  if (!category) return false;
  return SUBCATEGORY_BY_CATEGORY[category]?.has(subcategory) ?? false;
}

export const ARTICLE_LANGUAGES = {
  en: "English",
  fr: "French",
  ro: "Romanian",
  es: "Spanish",
};

export const ARTICLE_STATUSES = ["draft", "scheduled", "published"];

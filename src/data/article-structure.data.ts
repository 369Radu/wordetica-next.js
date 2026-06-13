/** Academic article layout for AI generation (mirrors ai-service). */

export interface ArticleStructureSection {
  id: string;
  title: string;
  defaultWords: number;
  hint?: string;
  /** Excluded from the “Total” row (e.g. References). */
  excludeFromTotal?: boolean;
  /** Section may be omitted when target words is 0. */
  optional?: boolean;
}

export const APA_STYLE_NOTE = 'APA 7 style is recommended.';

export const ARTICLE_STRUCTURE_SECTIONS: readonly ArticleStructureSection[] = [
  {
    id: 'abstract',
    title: 'Abstract',
    defaultWords: 125,
    hint: '100–150 words',
  },
  {
    id: 'introduction',
    title: 'Introduction',
    defaultWords: 250,
    hint: '200–300 words',
  },
  {
    id: 'literature_review',
    title: 'Literature Review',
    defaultWords: 600,
    hint: '500–700 words',
  },
  {
    id: 'discussion_and_implications',
    title: 'Discussion and Implications',
    defaultWords: 600,
    hint: '500–700 words',
  },
  {
    id: 'future_trends',
    title: 'Future Trends and Recommendations',
    defaultWords: 225,
    hint: 'Optional · 150–300 words (set 0 to omit)',
    optional: true,
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    defaultWords: 125,
    hint: '100–150 words',
  },
  {
    id: 'references',
    title: 'References',
    defaultWords: 0,
    hint: 'APA 7 list · not included in word count',
    excludeFromTotal: true,
  },
] as const;

export function defaultSectionWordCounts(): Record<string, number> {
  return Object.fromEntries(
    ARTICLE_STRUCTURE_SECTIONS.map((s) => [s.id, s.defaultWords]),
  );
}

export function totalSectionWords(counts: Record<string, number>): number {
  return ARTICLE_STRUCTURE_SECTIONS.reduce(
    (sum, s) =>
      sum + (s.excludeFromTotal ? 0 : (counts[s.id] ?? 0)),
    0,
  );
}


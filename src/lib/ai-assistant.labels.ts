import { ArticleLanguage } from '@/types/article';

export interface AiGenerateLabels {
  generate: string;
  generating: string;
}

/** Generate + SEO button copy in each output language. */
export const AI_GENERATE_LABELS: Record<ArticleLanguage, AiGenerateLabels> = {
  en: {
    generate: 'Generate + SEO',
    generating: 'Generating…',
  },
  fr: {
    generate: 'Générer + SEO',
    generating: 'Génération…',
  },
  ro: {
    generate: 'Generează + SEO',
    generating: 'Se generează…',
  },
  es: {
    generate: 'Generar + SEO',
    generating: 'Generando…',
  },
};

export const AI_OPTIMISE_LABELS = {
  optimise: 'Optimise article',
  optimising: 'Optimising…',
} as const;

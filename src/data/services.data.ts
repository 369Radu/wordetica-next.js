export type ServiceCardAccent = 'mint' | 'teal' | 'pink' | 'blend' | 'cosmic';

export interface ServiceOffering {
  slug: string;
  title: string;
  positioning: string;
  languages: string[];
  description: string;
  focusAreas: string[];
  toolsApproach: string[];
  outcomes: string[];
  shortDescription: string;
  icon: string;
  accent: ServiceCardAccent;
  motto?: string;
}

/** Shown on the services grid only - no detail route yet. */
export const AGENTIC_AI_COMING_SOON: Pick<
  ServiceOffering,
  'slug' | 'title' | 'shortDescription' | 'languages' | 'icon' | 'accent' | 'motto'
> = {
  slug: 'agentic-ai',
  title: 'WORDETICA COgent',
  icon: '⬡',
  accent: 'cosmic',
  languages: ['EN', 'FR', 'RO'],
  shortDescription: 'Leverage Vibe Coding and Agentic AI to create smarter language learning tools and navigate the future of autonomous learning.',
  motto: 'your intent -> intelligent tools',
};

export const SERVICES: ReadonlyArray<ServiceOffering> = [
  {
    slug: 'human-centered-ai-training',
    title: 'Human-Centered AI Literacy Training Series',
    icon: '◈',
    accent: 'blend',
    positioning:
      'A progressive, six-level series from primary education to language technology specialisation.',
    languages: ['EN', 'FR', 'RO'],
    shortDescription:
      'A progressive, six-level series equipping learners of all ages with AI literacy, critical thinking, and ethical awareness.',
    motto: 'human values -> better futures',
    description:
      'A progressive, six-level series equipping learners from primary school to professional research with the knowledge, critical thinking, and ethical awareness to understand, evaluate, and use artificial intelligence responsibly.',
    focusAreas: [
      'L1 - Foundations for Primary Education (Ages 8-11)',
      'L2 - Foundations for Secondary Education (Ages 12-15)',
      'L3 - Foundations for High School Education (Ages 16-18)',
      'L4 - Foundations for Higher Education (Undergraduate & Postgraduate)',
      'L5 - Academic Writing & Research Communication (Researchers & Academics)',
      'L6 - Translation Technologies & Multilingual AI (Language Professionals)',
    ],
    toolsApproach: [
      'Each level available as a standalone course, delivered online',
      'Certificate of completion awarded at every level',
      'Progressive curriculum from AI fundamentals to advanced research and language technology',
    ],
    outcomes: [
      'Critical AI literacy and ethical awareness at every stage of education',
      'Practical skills for AI-supported learning, research, and professional work',
      'Certificate of completion recognising achievement at each level',
    ],
  },
  {
    slug: 'language-communication-coaching',
    title: 'Language & Communication Coaching',
    icon: '✦',
    accent: 'blend',
    positioning: 'Learn, communicate, and perform confidently - with AI support.',
    languages: ['EN', 'FR', 'RO'],
    shortDescription:
      'Learn, communicate, and perform confidently across languages - with personalised coaching and AI-supported learning strategies tailored to your goals.',
    motto: 'your voice -> your advantage',
    description:
      'Personalised coaching to develop language proficiency, professional communication skills, and AI-assisted learning strategies. Sessions integrate modern AI tools to help learners work more efficiently and confidently across languages.',
    focusAreas: [
      'Language learning for work, study, or daily life',
      'Exam preparation (Cambridge, TESOL, IELTS, DELF/DALF, etc.)',
      'Job interviews and workplace communication',
      'Presentations, meetings, and professional interactions',
      'Writing emails, reports, and structured documents',
      'AI-assisted learning, practice, and communication simulation',
    ],
    toolsApproach: [
      'One-to-one coaching tailored to your goals and context',
      'Modern AI tools integrated for practice and communication simulation',
      'Sessions built around real materials from work, study, or daily life',
    ],
    outcomes: [
      'Stronger language proficiency and professional communication skills',
      'More efficient, confident work across languages with AI-supported strategies',
      'Readiness for exams, interviews, presentations, and workplace interactions',
    ],
  },
  {
    slug: 'translation-interpreting',
    title: 'Translation & Interpreting Services',
    icon: '⇄',
    accent: 'teal',
    positioning:
      'Written and spoken language services - accurate, context-aware, and enhanced by AI with human expertise at every step.',
    languages: ['EN', 'FR', 'RO'],
    shortDescription:
      'Written translation and live interpreting - AI-enhanced workflows, human linguistic review, and consistent accuracy across every language and context.',
    motto: 'words bridged -> worlds connected',
    description:
      'A complete language service covering both written translation and live interpreting - combining CAT tools, AI technologies, and human linguistic expertise to ensure accuracy, cultural adaptation, and effective real-time communication.',
    focusAreas: [
      'Written Translation - accurate, consistent multilingual content',
      'Machine Translation Post-Editing (MTPE)',
      'Proofreading, editing, and AI-assisted content refinement',
      'Localization and cultural adaptation',
      'Subtitling, dubbing, and speech-to-text transcription',
      'Live Interpreting - business meetings and professional discussions',
      'Interviews, appointments, and everyday interactions',
      'Online, in-person, and hybrid communication support',
    ],
    toolsApproach: [
      'CAT tools and AI technologies with mandatory human linguistic review',
      'Human interpreting led by expertise, preparation, and contextual understanding',
      'Transparent workflows balancing automation with quality assurance',
    ],
    outcomes: [
      'Accurate, consistent translations adapted to context and culture',
      'Effective real-time communication with nuance and intent conveyed faithfully',
      'Refined multilingual content with human-validated quality at every stage',
    ],
  },
];

export type PrincipleIconId =
  | 'human-oversight'
  | 'human-quality'
  | 'human-precision'
  | 'human-education'
  | 'ai-workflows'
  | 'ai-ethics'
  | 'ai-integration'
  | 'shared-literacy'
  | 'shared-quality'
  | 'shared-inclusion';

export interface PrincipleCard {
  id: string;
  title: string;
  text: string;
  icon: PrincipleIconId;
}

export const HUMAN_PRINCIPLES: PrincipleCard[] = [
  {
    id: 'human-1',
    icon: 'human-oversight',
    title: 'Linguistics First',
    text: 'Linguistic knowledge is the foundation of every service - AI amplifies it, human expertise validates it.',
  },
  {
    id: 'human-2',
    icon: 'human-education',
    title: 'Educational Expertise',
    text: 'From curriculum design for young learners to advanced academic research - pedagogy is central to every training and coaching service we deliver.',
  },
];

export const AI_PRINCIPLES: PrincipleCard[] = [
  {
    id: 'ai-1',
    icon: 'ai-integration',
    title: 'Human Oversight',
    text: 'AI augments human capability in every workflow - it never replaces human judgment, review, or professional accountability.',
  },
  {
    id: 'ai-2',
    icon: 'ai-ethics',
    title: 'Ethical AI',
    text: 'AI is applied consciously, transparently, and with full awareness of its ethical, social, and cultural implications.',
  },
];

export const SHARED_PRINCIPLES: PrincipleCard[] = [
  {
    id: 'shared-1',
    icon: 'shared-literacy',
    title: 'Human-Centered AI Literacy for All',
    text: 'From age 8 to professional research and language technology - accessible, human-centered AI literacy at every stage of learning.',
  },
  {
    id: 'shared-2',
    icon: 'shared-quality',
    title: 'Precision & Quality',
    text: 'Accuracy, nuance, and cultural sensitivity are non-negotiable - in translation, interpreting, coaching, and training.',
  },
  {
    id: 'shared-3',
    icon: 'shared-inclusion',
    title: 'Multilingual & Cognitive Inclusion',
    text: 'Every learner thinks and communicates differently - we design services that are accessible across languages, ages, and cognitive profiles, including neurodivergent and non-traditional learners.',
  },
];

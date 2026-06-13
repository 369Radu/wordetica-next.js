export type SocialNetworkId =
  | 'linkedin'
  | 'researchgate'
  | 'academia'
  | 'website'
  | 'google-scholar'
  | 'orcid'
  | 'facebook'
  | 'x';

export interface SocialLink {
  id: SocialNetworkId;
  label: string;
  url: string;
}

/** Public profiles - update URLs when real accounts are available. */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/andreeaghita369',
  },
  {
    id: 'researchgate',
    label: 'ResearchGate',
    url: 'https://www.researchgate.net/profile/Andreea_Ghita2',
  },
  {
    id: 'academia',
    label: 'Academia',
    url: 'https://andreeaghita.academia.edu/',
  },
  {
    id: 'website',
    label: 'Personal website',
    url: 'https://andreeaghita.eu',
  },
  {
    id: 'google-scholar',
    label: 'Google Scholar',
    url: 'https://scholar.google.com/',
  },
  {
    id: 'orcid',
    label: 'ORCID',
    url: 'https://orcid.org/',
  },
];

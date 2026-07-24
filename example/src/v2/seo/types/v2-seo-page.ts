import type { IV2SeoFaq } from './v2-seo-faq';

export interface IV2SeoPage {
  path: string;
  title: string;
  description: string;
  keywords: string;
  section: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  searchText?: string;
  faqs?: IV2SeoFaq[];
  summary?: string;
  capabilities?: string[];
  safetyNotes?: string[];
  productionNotes?: string[];
}

import type { IV1SeoFaq } from './v1-seo-faq';

export interface IV1SeoPage {
  path: string;
  title: string;
  description: string;
  keywords: string;
  section: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  searchText?: string;
  faqs?: IV1SeoFaq[];
  summary?: string;
  capabilities?: string[];
  safetyNotes?: string[];
  productionNotes?: string[];
}

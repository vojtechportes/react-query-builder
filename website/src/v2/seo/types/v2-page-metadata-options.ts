import type { IV2SeoFaq } from './v2-seo-faq';

export interface IV2PageMetadataOptions {
  path: string;
  keywords: string;
  section: string;
  breadcrumbs: { name: string; path: string }[];
  faqs?: IV2SeoFaq[];
}

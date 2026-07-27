import type { IV1SeoFaq } from './v1-seo-faq';

export interface IV1PageMetadataOptions {
  path: string;
  keywords: string;
  section: string;
  breadcrumbs: { name: string; path: string }[];
  faqs?: IV1SeoFaq[];
}

import { v2SeoConfig } from '../constants/v2-seo-config';
import type { IV2PageMetadataOptions } from '../types/v2-page-metadata-options';
import { createV2CanonicalUrl } from './create-v2-canonical-url.util';

export const createV2StructuredData = (
  pageTitle: string,
  description: string,
  options: IV2PageMetadataOptions
): Record<string, unknown>[] => {
  const canonicalUrl = createV2CanonicalUrl(options.path);
  const siteUrl = createV2CanonicalUrl('/');
  const imageUrl = createV2CanonicalUrl('/favicon.png');
  const structuredData: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: `${v2SeoConfig.siteName} v2`,
      url: siteUrl,
      version: v2SeoConfig.packageVersion,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: `${v2SeoConfig.siteName} v2`,
      description,
      codeRepository: 'https://github.com/vojtechportes/react-query-builder',
      programmingLanguage: 'TypeScript',
      runtimePlatform: 'React',
      url: canonicalUrl,
      image: imageUrl,
      keywords: options.keywords,
      version: v2SeoConfig.packageVersion,
      sameAs: [
        'https://github.com/vojtechportes/react-query-builder',
        'https://www.npmjs.com/package/@vojtechportes/react-query-builder',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type':
        options.section === 'Home' || options.section === 'Demo'
          ? 'WebPage'
          : 'TechArticle',
      headline: pageTitle,
      name: pageTitle,
      description,
      url: canonicalUrl,
      image: imageUrl,
      about: `${v2SeoConfig.siteName} v2`,
      keywords: options.keywords,
      version: v2SeoConfig.packageVersion,
      isPartOf: {
        '@type': 'WebSite',
        name: `${v2SeoConfig.siteName} v2`,
        url: siteUrl,
      },
    },
  ];

  if (options.breadcrumbs.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: options.breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: createV2CanonicalUrl(breadcrumb.path),
      })),
    });
  }

  if (options.faqs?.length) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: options.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  return structuredData;
};

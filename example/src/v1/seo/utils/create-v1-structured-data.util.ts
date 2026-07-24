import { v1SeoConfig } from '../constants/v1-seo-config';
import type { IV1PageMetadataOptions } from '../types/v1-page-metadata-options';
import { createV1CanonicalUrl } from './create-v1-canonical-url.util';

export const createV1StructuredData = (
  pageTitle: string,
  description: string,
  options: IV1PageMetadataOptions
): Record<string, unknown>[] => {
  const canonicalUrl = createV1CanonicalUrl(options.path);
  const siteUrl = createV1CanonicalUrl('/');
  const imageUrl = createV1CanonicalUrl('/favicon.png');
  const structuredData: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: `${v1SeoConfig.siteName} v1`,
      url: siteUrl,
      version: v1SeoConfig.packageVersion,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: `${v1SeoConfig.siteName} v1`,
      description,
      codeRepository: 'https://github.com/vojtechportes/react-query-builder',
      programmingLanguage: 'TypeScript',
      runtimePlatform: 'React',
      url: canonicalUrl,
      image: imageUrl,
      keywords: options.keywords,
      version: v1SeoConfig.packageVersion,
      sameAs: [
        'https://github.com/vojtechportes/react-query-builder',
        'https://www.npmjs.com/package/@vojtechportes/react-query-builder/v/1.33.1',
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
      about: `${v1SeoConfig.siteName} v1`,
      keywords: options.keywords,
      version: v1SeoConfig.packageVersion,
      isPartOf: {
        '@type': 'WebSite',
        name: `${v1SeoConfig.siteName} v1`,
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
        item: createV1CanonicalUrl(breadcrumb.path),
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

import { createV1CanonicalUrl } from './create-v1-canonical-url.util.mjs';

export const createV1StructuredData = (page, route, seoConfig, siteUrl) => {
  const canonicalUrl = createV1CanonicalUrl(
    route.publicPath,
    siteUrl,
    seoConfig.versionPath
  );
  const versionSiteUrl = createV1CanonicalUrl(
    '/',
    siteUrl,
    seoConfig.versionPath
  );
  const imageUrl = createV1CanonicalUrl(
    '/favicon.png',
    siteUrl,
    seoConfig.versionPath
  );
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: `${seoConfig.siteName} v1`,
      url: versionSiteUrl,
      version: seoConfig.packageVersion,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${versionSiteUrl}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: `${seoConfig.siteName} v1`,
      description: page.description,
      codeRepository: 'https://github.com/vojtechportes/react-query-builder',
      programmingLanguage: 'TypeScript',
      runtimePlatform: 'React',
      url: canonicalUrl,
      image: imageUrl,
      keywords: page.keywords,
      version: seoConfig.packageVersion,
      sameAs: [
        'https://github.com/vojtechportes/react-query-builder',
        'https://www.npmjs.com/package/@vojtechportes/react-query-builder/v/1.33.1',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type':
        page.section === 'Home' || page.section === 'Demo'
          ? 'WebPage'
          : 'TechArticle',
      headline: page.title,
      name: page.title,
      description: page.description,
      url: canonicalUrl,
      image: imageUrl,
      about: `${seoConfig.siteName} v1`,
      keywords: page.keywords,
      version: seoConfig.packageVersion,
      isPartOf: {
        '@type': 'WebSite',
        name: `${seoConfig.siteName} v1`,
        url: versionSiteUrl,
      },
    },
  ];

  if (route.breadcrumbs.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: route.breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.label,
        item: createV1CanonicalUrl(
          breadcrumb.publicPath,
          siteUrl,
          seoConfig.versionPath
        ),
      })),
    });
  }

  if (page.faqs?.length) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  return structuredData;
};

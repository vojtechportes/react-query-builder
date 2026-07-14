import * as React from 'react';
import {
  GITHUB_URL,
  NPM_URL,
  SITE_IMAGE_URL,
  SITE_NAME,
  SITE_URL,
} from '../constants/site-constants';

const META_DESCRIPTION_SELECTOR = 'meta[name="description"]';
const CANONICAL_SELECTOR = 'link[rel="canonical"]';
const STRUCTURED_DATA_ID = 'structured-data-page';

export interface IPageMetadataOptions {
  path?: string;
  keywords?: string;
  section?: string;
}

const ensureDescriptionMeta = () => {
  let element = document.head.querySelector<HTMLMetaElement>(
    META_DESCRIPTION_SELECTOR
  );

  if (!element) {
    element = document.createElement('meta');
    element.name = 'description';
    document.head.appendChild(element);
  }

  return element;
};

const ensureMetaByName = (name: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`
  );

  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
};

const ensureMetaByProperty = (property: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }

  return element;
};

const ensureCanonicalLink = () => {
  let element = document.head.querySelector<HTMLLinkElement>(CANONICAL_SELECTOR);

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }

  return element;
};

const ensureStructuredDataScript = () => {
  let element = document.head.querySelector<HTMLScriptElement>(
    `script#${STRUCTURED_DATA_ID}`
  );

  if (!element) {
    element = document.createElement('script');
    element.id = STRUCTURED_DATA_ID;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  return element;
};

const createCanonicalUrl = (path = '/') => {
  const normalizedPath = path === '/' ? '' : path.replace(/^\//, '');
  return new URL(normalizedPath, SITE_URL).toString();
};

const createStructuredData = ({
  canonicalUrl,
  description,
  keywords,
  pageTitle,
  section,
}: {
  canonicalUrl: string;
  description: string;
  keywords?: string;
  pageTitle: string;
  section?: string;
}) => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: SITE_NAME,
    description,
    codeRepository: GITHUB_URL,
    programmingLanguage: 'TypeScript',
    runtimePlatform: 'React',
    url: canonicalUrl,
    image: SITE_IMAGE_URL,
    keywords,
    sameAs: [GITHUB_URL, NPM_URL],
  },
  {
    '@context': 'https://schema.org',
    '@type': section === 'Home' || section === 'Demo' ? 'WebPage' : 'TechArticle',
    headline: pageTitle,
    name: pageTitle,
    description,
    url: canonicalUrl,
    image: SITE_IMAGE_URL,
    about: SITE_NAME,
    keywords,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  },
];

export const usePageMetadata = (
  pageTitle: string,
  description: string,
  options: IPageMetadataOptions = {}
) => {
  React.useEffect(() => {
    const title = `${pageTitle} | ${SITE_NAME}`;
    const canonicalUrl = createCanonicalUrl(options.path);

    document.title = title;
    ensureDescriptionMeta().content = description;
    ensureMetaByName('keywords').content = options.keywords ?? '';
    ensureMetaByName('robots').content =
      'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
    ensureMetaByProperty('og:type').content = 'website';
    ensureMetaByProperty('og:site_name').content = SITE_NAME;
    ensureMetaByProperty('og:title').content = title;
    ensureMetaByProperty('og:description').content = description;
    ensureMetaByProperty('og:url').content = canonicalUrl;
    ensureMetaByProperty('og:image').content = SITE_IMAGE_URL;
    ensureMetaByName('twitter:card').content = 'summary';
    ensureMetaByName('twitter:title').content = title;
    ensureMetaByName('twitter:description').content = description;
    ensureMetaByName('twitter:image').content = SITE_IMAGE_URL;
    ensureCanonicalLink().href = canonicalUrl;
    ensureStructuredDataScript().textContent = JSON.stringify(
      createStructuredData({
        canonicalUrl,
        description,
        keywords: options.keywords,
        pageTitle,
        section: options.section,
      })
    );
  }, [description, options.keywords, options.path, options.section, pageTitle]);
};

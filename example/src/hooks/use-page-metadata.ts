import * as React from 'react';
import {
  SITE_IMAGE_URL,
  SITE_NAME,
} from '../constants/site-constants';

const META_DESCRIPTION_SELECTOR = 'meta[name="description"]';
const CANONICAL_SELECTOR = 'link[rel="canonical"]';

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

export const usePageMetadata = (pageTitle: string, description: string) => {
  React.useEffect(() => {
    const title = `${SITE_NAME} - ${pageTitle}`;
    const canonicalUrl = new URL(
      window.location.pathname.replace(/^\//, ''),
      window.location.origin.endsWith('/')
        ? window.location.origin
        : `${window.location.origin}/`
    ).toString();

    document.title = title;
    ensureDescriptionMeta().content = description;
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
  }, [description, pageTitle]);
};

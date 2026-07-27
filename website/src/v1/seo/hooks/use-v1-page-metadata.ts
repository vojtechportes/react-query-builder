import * as React from 'react';
import { v1SeoConfig } from '../constants/v1-seo-config';
import type { IV1PageMetadataOptions } from '../types/v1-page-metadata-options';
import { createV1CanonicalUrl } from '../utils/create-v1-canonical-url.util';
import { createV1StructuredData } from '../utils/create-v1-structured-data.util';
import { ensureV1CanonicalLink } from '../utils/ensure-v1-canonical-link.util';
import { ensureV1MetaName } from '../utils/ensure-v1-meta-name.util';
import { ensureV1MetaProperty } from '../utils/ensure-v1-meta-property.util';
import { ensureV1StructuredDataScript } from '../utils/ensure-v1-structured-data-script.util';

export const useV1PageMetadata = (
  pageTitle: string,
  description: string,
  options: IV1PageMetadataOptions
): void => {
  React.useEffect(() => {
    const title = `${pageTitle} | ${v1SeoConfig.siteName}`;
    const canonicalUrl = createV1CanonicalUrl(options.path);
    const imageUrl = createV1CanonicalUrl('/favicon.png');

    document.title = title;
    ensureV1MetaName('description').content = description;
    ensureV1MetaName('keywords').content = options.keywords;
    ensureV1MetaName('robots').content = v1SeoConfig.robotsDirective;
    ensureV1MetaProperty('og:type').content = 'website';
    ensureV1MetaProperty('og:site_name').content = `${v1SeoConfig.siteName} v1`;
    ensureV1MetaProperty('og:title').content = title;
    ensureV1MetaProperty('og:description').content = description;
    ensureV1MetaProperty('og:url').content = canonicalUrl;
    ensureV1MetaProperty('og:image').content = imageUrl;
    ensureV1MetaName('twitter:card').content = 'summary';
    ensureV1MetaName('twitter:title').content = title;
    ensureV1MetaName('twitter:description').content = description;
    ensureV1MetaName('twitter:image').content = imageUrl;
    ensureV1CanonicalLink().href = canonicalUrl;
    ensureV1StructuredDataScript().textContent = JSON.stringify(
      createV1StructuredData(pageTitle, description, options)
    );
  }, [description, options, pageTitle]);
};

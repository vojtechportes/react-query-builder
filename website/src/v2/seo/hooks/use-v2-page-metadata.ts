import * as React from 'react';
import { v2SeoConfig } from '../constants/v2-seo-config';
import type { IV2PageMetadataOptions } from '../types/v2-page-metadata-options';
import { createV2CanonicalUrl } from '../utils/create-v2-canonical-url.util';
import { createV2StructuredData } from '../utils/create-v2-structured-data.util';
import { ensureV2CanonicalLink } from '../utils/ensure-v2-canonical-link.util';
import { ensureV2MetaName } from '../utils/ensure-v2-meta-name.util';
import { ensureV2MetaProperty } from '../utils/ensure-v2-meta-property.util';
import { ensureV2StructuredDataScript } from '../utils/ensure-v2-structured-data-script.util';

export const useV2PageMetadata = (
  pageTitle: string,
  description: string,
  options: IV2PageMetadataOptions
): void => {
  React.useEffect(() => {
    const title = `${pageTitle} | ${v2SeoConfig.siteName}`;
    const canonicalUrl = createV2CanonicalUrl(options.path);
    const imageUrl = createV2CanonicalUrl('/favicon.png');

    document.title = title;
    ensureV2MetaName('description').content = description;
    ensureV2MetaName('keywords').content = options.keywords;
    ensureV2MetaName('robots').content = v2SeoConfig.robotsDirective;
    ensureV2MetaProperty('og:type').content = 'website';
    ensureV2MetaProperty('og:site_name').content = `${v2SeoConfig.siteName} v2`;
    ensureV2MetaProperty('og:title').content = title;
    ensureV2MetaProperty('og:description').content = description;
    ensureV2MetaProperty('og:url').content = canonicalUrl;
    ensureV2MetaProperty('og:image').content = imageUrl;
    ensureV2MetaName('twitter:card').content = 'summary';
    ensureV2MetaName('twitter:title').content = title;
    ensureV2MetaName('twitter:description').content = description;
    ensureV2MetaName('twitter:image').content = imageUrl;
    ensureV2CanonicalLink().href = canonicalUrl;
    ensureV2StructuredDataScript().textContent = JSON.stringify(
      createV2StructuredData(pageTitle, description, options)
    );
  }, [description, options, pageTitle]);
};

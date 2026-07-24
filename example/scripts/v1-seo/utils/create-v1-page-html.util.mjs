import { escapeHtml } from './escape-html.util.mjs';
import { setCanonical } from './set-canonical.util.mjs';
import { setMetaName } from './set-meta-name.util.mjs';
import { setMetaProperty } from './set-meta-property.util.mjs';
import { setStructuredData } from './set-structured-data.util.mjs';
import { createV1CanonicalUrl } from './create-v1-canonical-url.util.mjs';
import { createV1StructuredData } from './create-v1-structured-data.util.mjs';

export const createV1PageHtml = ({
  baseHtml,
  page,
  route,
  renderedPage,
  seoConfig,
  siteUrl,
}) => {
  const canonicalUrl = createV1CanonicalUrl(
    route.publicPath,
    siteUrl,
    seoConfig.versionPath
  );
  const imageUrl = createV1CanonicalUrl(
    '/favicon.png',
    siteUrl,
    seoConfig.versionPath
  );
  const title = `${page.title} | ${seoConfig.siteName}`;
  let html = baseHtml.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`
  );

  html = setMetaName(html, 'description', page.description);
  html = setMetaName(html, 'keywords', page.keywords);
  html = setMetaName(html, 'robots', seoConfig.robotsDirective);
  html = setMetaProperty(html, 'og:type', 'website');
  html = setMetaProperty(html, 'og:site_name', `${seoConfig.siteName} v1`);
  html = setMetaProperty(html, 'og:title', title);
  html = setMetaProperty(html, 'og:description', page.description);
  html = setMetaProperty(html, 'og:url', canonicalUrl);
  html = setMetaProperty(html, 'og:image', imageUrl);
  html = setMetaName(html, 'twitter:card', 'summary');
  html = setMetaName(html, 'twitter:title', title);
  html = setMetaName(html, 'twitter:description', page.description);
  html = setMetaName(html, 'twitter:image', imageUrl);
  html = setCanonical(html, canonicalUrl);
  html = setStructuredData(
    html,
    createV1StructuredData(page, route, seoConfig, siteUrl)
  );

  const emptyRoot = '<div id="root"></div>';

  if (!html.includes(emptyRoot)) {
    throw new Error('v1 HTML template is missing the empty root element.');
  }

  html = html.replace('</head>', `${renderedPage.styles}\n  </head>`);

  return html.replace(emptyRoot, `<div id="root">${renderedPage.html}</div>`);
};

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exampleRoot = path.resolve(__dirname, '..');
const distRoot = path.join(exampleRoot, 'dist');
const seoConfigPath = path.join(exampleRoot, 'src', 'constants', 'seo-pages.json');
const indexPath = path.join(distRoot, 'index.html');
const seoConfig = JSON.parse(fs.readFileSync(seoConfigPath, 'utf8'));
const baseHtml = fs.readFileSync(indexPath, 'utf8');

const escapeHtml = value =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const canonicalUrlForPath = pagePath => {
  const normalizedPath = pagePath === '/' ? '' : pagePath.replace(/^\//, '');
  return new URL(normalizedPath, seoConfig.siteUrl).toString();
};

const setTag = (html, matcher, replacement, insertion) => {
  if (matcher.test(html)) {
    return html.replace(matcher, replacement);
  }

  return html.replace('</head>', `${insertion}\n  </head>`);
};

const setMetaName = (html, name, content) => {
  const escapedContent = escapeHtml(content);
  const tag = `<meta name="${name}" content="${escapedContent}" />`;
  return setTag(
    html,
    new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'][^"']*["']\\s*/?>`, 'i'),
    tag,
    `    ${tag}`
  );
};

const setMetaProperty = (html, property, content) => {
  const escapedContent = escapeHtml(content);
  const tag = `<meta property="${property}" content="${escapedContent}" />`;
  return setTag(
    html,
    new RegExp(`<meta\\s+property=["']${property}["']\\s+content=["'][^"']*["']\\s*/?>`, 'i'),
    tag,
    `    ${tag}`
  );
};

const setCanonical = (html, url) => {
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`;
  return setTag(
    html,
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    tag,
    `    ${tag}`
  );
};

const createStructuredData = (page, canonicalUrl) => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: seoConfig.siteName,
    description: page.description,
    codeRepository: 'https://github.com/vojtechportes/react-query-builder',
    programmingLanguage: 'TypeScript',
    runtimePlatform: 'React',
    url: canonicalUrl,
    keywords: page.keywords,
    sameAs: [
      'https://github.com/vojtechportes/react-query-builder',
      'https://www.npmjs.com/package/@vojtechportes/react-query-builder',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': page.section === 'Home' || page.section === 'Demo' ? 'WebPage' : 'TechArticle',
    headline: page.title,
    name: page.title,
    description: page.description,
    url: canonicalUrl,
    about: seoConfig.siteName,
    keywords: page.keywords,
    isPartOf: {
      '@type': 'WebSite',
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
    },
  },
];

const setStructuredData = (html, page, canonicalUrl) => {
  const json = JSON.stringify(createStructuredData(page, canonicalUrl));
  const tag = `<script id="structured-data-page" type="application/ld+json">${json}</script>`;

  return setTag(
    html,
    /<script\s+id=["']structured-data-page["']\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
    tag,
    `    ${tag}`
  );
};

const createPageHtml = page => {
  const canonicalUrl = canonicalUrlForPath(page.path);
  const title = `${page.title} | ${seoConfig.siteName}`;
  let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  html = setMetaName(html, 'description', page.description);
  html = setMetaName(html, 'keywords', page.keywords);
  html = setMetaName(
    html,
    'robots',
    'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
  );
  html = setMetaProperty(html, 'og:type', 'website');
  html = setMetaProperty(html, 'og:site_name', seoConfig.siteName);
  html = setMetaProperty(html, 'og:title', title);
  html = setMetaProperty(html, 'og:description', page.description);
  html = setMetaProperty(html, 'og:url', canonicalUrl);
  html = setMetaName(html, 'twitter:card', 'summary');
  html = setMetaName(html, 'twitter:title', title);
  html = setMetaName(html, 'twitter:description', page.description);
  html = setCanonical(html, canonicalUrl);
  html = setStructuredData(html, page, canonicalUrl);

  return html;
};

const writeRouteHtml = page => {
  const html = createPageHtml(page);

  if (page.path === '/') {
    fs.writeFileSync(indexPath, html);
    return;
  }

  const routeDir = path.join(distRoot, page.path.replace(/^\//, ''));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), html);
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${seoConfig.pages
  .map(page => `  <url>\n    <loc>${escapeHtml(canonicalUrlForPath(page.path))}</loc>\n  </url>`)
  .join('\n')}
</urlset>
`;

for (const page of seoConfig.pages) {
  writeRouteHtml(page);
}

fs.writeFileSync(path.join(distRoot, 'sitemap.xml'), sitemap);
fs.writeFileSync(
  path.join(distRoot, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${canonicalUrlForPath('/sitemap.xml')}\n`
);

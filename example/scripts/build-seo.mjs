/* global process, URL */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exampleRoot = path.resolve(__dirname, '..');
const distRoot = path.join(exampleRoot, 'dist');
const ssgRoot = path.join(exampleRoot, '.ssg');
const serverEntryUrl = pathToFileURL(
  path.join(ssgRoot, 'entry-server.mjs')
).href;
const { renderPage } = await import(serverEntryUrl);
const seoConfigPath = path.join(
  exampleRoot,
  'src',
  'constants',
  'seo-pages.json'
);
const indexPath = path.join(distRoot, 'index.html');
const seoConfig = JSON.parse(fs.readFileSync(seoConfigPath, 'utf8'));
const configuredSiteUrl = process.env.VITE_SITE_URL || seoConfig.siteUrl;

try {
  seoConfig.siteUrl = new URL(configuredSiteUrl).toString();
} catch {
  throw new Error(
    `VITE_SITE_URL must be an absolute URL, received: ${configuredSiteUrl}`
  );
}
const baseHtml = fs.readFileSync(indexPath, 'utf8');

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const canonicalUrlForPath = (pagePath) => {
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
    new RegExp(
      `<meta\\s+name=["']${name}["']\\s+content=["'][^"']*["']\\s*/?>`,
      'i'
    ),
    tag,
    `    ${tag}`
  );
};

const setMetaProperty = (html, property, content) => {
  const escapedContent = escapeHtml(content);
  const tag = `<meta property="${property}" content="${escapedContent}" />`;
  return setTag(
    html,
    new RegExp(
      `<meta\\s+property=["']${property}["']\\s+content=["'][^"']*["']\\s*/?>`,
      'i'
    ),
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

const createStructuredData = (page, canonicalUrl) => {
  const structuredData = [
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
      '@type':
        page.section === 'Home' || page.section === 'Demo'
          ? 'WebPage'
          : 'TechArticle',
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

  if (page.section === 'Recipes') {
    const items = [
      { name: 'Home', path: '/' },
      { name: 'Recipes', path: '/recipes' },
      ...(page.path === '/recipes'
        ? []
        : [{ name: page.title, path: page.path }]),
    ];
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: canonicalUrlForPath(item.path),
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

const createPageHtml = (page) => {
  const renderedPage = renderPage(page.path);
  const canonicalUrl = canonicalUrlForPath(page.path);
  const imageUrl = canonicalUrlForPath('/favicon.png');
  const title = `${page.title} | ${seoConfig.siteName}`;
  let html = baseHtml.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`
  );

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
  html = setMetaProperty(html, 'og:image', imageUrl);
  html = setMetaName(html, 'twitter:card', 'summary');
  html = setMetaName(html, 'twitter:title', title);
  html = setMetaName(html, 'twitter:description', page.description);
  html = setMetaName(html, 'twitter:image', imageUrl);
  html = setCanonical(html, canonicalUrl);
  html = setStructuredData(html, page, canonicalUrl);

  if (
    !html.includes('property="og:image" content="' + imageUrl + '"') ||
    !html.includes('name="twitter:image" content="' + imageUrl + '"')
  ) {
    throw new Error('Generated metadata contains incorrect social image URLs.');
  }

  const emptyRoot = '<div id="root"></div>';
  if (!html.includes(emptyRoot)) {
    throw new Error('Example HTML template is missing the empty root element.');
  }

  html = html.replace('</head>', `${renderedPage.styles}\n  </head>`);
  html = html.replace(emptyRoot, `<div id="root">${renderedPage.html}</div>`);

  return html;
};

const writeRouteHtml = (page) => {
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
  .map(
    (page) =>
      `  <url>\n    <loc>${escapeHtml(canonicalUrlForPath(page.path))}</loc>\n  </url>`
  )
  .join('\n')}
</urlset>
`;

for (const page of seoConfig.pages) {
  writeRouteHtml(page);
}

for (const page of seoConfig.pages) {
  const outputPath =
    page.path === '/'
      ? indexPath
      : path.join(distRoot, page.path.replace(/^\//, ''), 'index.html');
  const html = fs.readFileSync(outputPath, 'utf8');
  const h1Matches = html.match(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi) ?? [];
  if (
    h1Matches.length !== 1 ||
    !html.includes('data-styled="true"') ||
    !html.includes('<script id="structured-data-page"') ||
    !html.includes('<div id="root">') ||
    !html.includes('<script type="module"') ||
    html.includes('data-seo-fallback')
  ) {
    throw new Error(
      `Generated HTML is missing complete SSG content for ${page.path}.`
    );
  }

  if (
    page.section === 'Recipes' &&
    page.faqs?.length &&
    !html.includes('Frequently asked questions</h2>')
  ) {
    throw new Error(
      `Generated recipe HTML is missing FAQ content for ${page.path}.`
    );
  }
}

fs.writeFileSync(path.join(distRoot, 'sitemap.xml'), sitemap);
fs.writeFileSync(
  path.join(distRoot, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${canonicalUrlForPath('/sitemap.xml')}\n`
);

fs.rmSync(ssgRoot, { recursive: true, force: true });

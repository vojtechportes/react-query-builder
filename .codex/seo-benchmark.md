# SEO Benchmark: React Query Builder Example Site

Date: 2026-07-14

## Target

Rank above or near `https://react-querybuilder.js.org/` for searches around React query builder components, TypeScript query builders, React filter builders, rule builders, adapters, SQL parsing, and query formatting.

## Benchmark Notes

The benchmark site is a mature Docusaurus documentation site. Its home page exposes crawlable content for the product name, a concise value proposition, demo/query-builder UI text, export/import support, extensibility, styling, translation, and links to docs, demo, API, GitHub, npm, and support resources.

The example site should compete by being more specific per page: each documentation and API route should have its own title, description, canonical URL, keywords, structured data, sitemap entry, and static route HTML.

## Improvements Implemented For The Example Site

- Added a single SEO registry at `example/src/constants/seo-pages.json` for all canonical public pages.
- Included every direct public route from `example/src/app/app.tsx`, including pages that were missing from the previous sitemap.
- Gave each canonical page a unique SEO title and description.
- Added keyword coverage for React Query Builder, React query builder component, React filter builder, React rule builder, TypeScript query builder, adapter names, and query conversion topics.
- Added runtime metadata support for keywords, canonical URLs, Open Graph, Twitter tags, robots directives, and JSON-LD structured data.
- Added build-time generation of route-specific static HTML files so crawlers can fetch page-specific metadata directly.
- Added generated `sitemap.xml` and `robots.txt` output during the example build.
- Added SEO validation for route coverage, sitemap coverage, unique metadata, keyword coverage, and metadata length checks.

## Remaining Ranking Risks Outside Code

- The benchmark domain has existing search history and backlinks; this site cannot match that only through metadata.
- GitHub Pages hosting is acceptable for indexing, but a custom domain could improve memorability and trust signals.
- Search Console indexing status, crawl errors, and submitted sitemap state still need to be verified after deployment.
- Ranking for broad terms like `react query builder` will also depend on npm downloads, GitHub stars, external mentions, release cadence, and backlink quality.
- Content depth should continue to grow around comparison queries, migration guides, framework adapter pages, and examples for SQL, Mongo, JsonLogic, Prisma, OData, and other supported formats.

## Follow-Up Checks After Deployment

- Submit `https://vojtechportes.github.io/react-query-builder/sitemap.xml` in Google Search Console.
- Inspect representative deployed URLs with URL Inspection.
- Run Lighthouse SEO on home, documentation, API, adapter, parsing/formatting, and demo pages.
- Search for indexed pages with `site:vojtechportes.github.io/react-query-builder react query builder` after Google recrawls the site.
- Add backlink opportunities from the npm package, GitHub repository, README, releases, examples, and related blog/tutorial content.

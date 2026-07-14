This backlog is derived from `AGENTS.md`. Keep tasks incremental and update statuses as work lands.

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[!]` Blocked or needs decision

**Task naming convention:** `T{NNN}` for task, `B{NNN}` for a bug fix

## Backlog

### T001 - Audit and improve example website SEO

**Status:** `[x]` Done

**Goal:** Ensure the example website can be crawled, indexed, and ranked for relevant React Query Builder searches at or above the visibility of `https://react-querybuilder.js.org/`.

**Scope:**

- Audit every public example route in `example/src/app/app.tsx`, including nested documentation and API pages.
- Compare indexable routes against `example/public/sitemap.xml` and add any missing canonical pages.
- Confirm `example/public/robots.txt` allows indexing and points to the production sitemap.
- Review route-level metadata produced by `example/src/hooks/use-page-metadata.ts`.
- Improve titles, descriptions, canonical URLs, Open Graph tags, Twitter tags, and robots directives where needed.
- Add structured data where useful, such as `SoftwareSourceCode`, `TechArticle`, `WebSite`, `BreadcrumbList`, or `FAQPage`.
- Improve on-page keyword coverage for terms such as `React query builder`, `React query builder component`, `React filter builder`, `React rule builder`, `TypeScript query builder`, `SQL query builder React`, and supported adapter names.
- Make sure redirects and legacy routes do not create duplicate indexable content.

**Acceptance criteria:**

- Every canonical public page is present in the sitemap exactly once.
- Every indexable page has a unique title, meta description, canonical URL, primary heading, and meaningful body copy.
- Titles are specific, include important keywords naturally, and stay within practical search result length limits.
- Meta descriptions are unique, readable, and summarize the page intent with relevant search terms.
- Canonical URLs match the deployed GitHub Pages base path.
- Redirect-only and fallback routes are excluded from the sitemap and are not presented as canonical pages.
- Documentation/API pages have enough crawlable text to explain the feature, API, adapter, or guide they target.
- The site has a benchmark report comparing metadata, page coverage, keyword coverage, structured data, and crawlability against `https://react-querybuilder.js.org/`.
- The final report identifies remaining SEO risks that cannot be fixed in code, such as domain authority, backlinks, search console indexing state, or package popularity signals.

**Implementation notes:**

- Prefer a route metadata registry so page titles, descriptions, canonical slugs, sitemap entries, search labels, and breadcrumbs come from one source of truth.
- Consider generating `sitemap.xml` from the same route registry during the example build to avoid drift.
- Keep keyword improvements editorial and useful; do not stuff keywords into titles or paragraphs.
- Use real page content and examples to support ranking, especially for adapter-specific and parsing/formatting pages.
- Add validation scripts or tests that fail when a public route is missing metadata or sitemap coverage.

**Verification:**

- Run the example build.
- Run the new SEO validation script or test suite.
- Crawl the built site locally and confirm each route returns indexable HTML or has an intentional redirect.
- Validate sitemap and robots output.
- Run Lighthouse SEO checks for representative pages: home, documentation, API, adapter page, parsing/formatting page, and demo.
- Manually compare the generated benchmark report with `https://react-querybuilder.js.org/`.

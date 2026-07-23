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

### T002 - Add SEO-focused Recipes section to example website

**Status:** `[x]` Done

**Goal:** Add a new top-level `Recipes` section as the last main navigation item on the example website, with separate, indexable pages for high-intent real-world use cases that help developers adopt React Query Builder and help the site rank for practical filter-builder searches.

**Scope:**

- Add `Recipes` as the last item in `TOP_LEVEL_NAV`, after `Demo`.
- Add a `/recipes` overview route plus one nested route per published recipe in `example/src/app/app.tsx`.
- Build a recipes page registry, similar in spirit to the documentation/API page registries, so sidebar navigation, page metadata, search text, sitemap entries, breadcrumbs, related links, and structured data can come from a single source of truth.
- Include explicit registry fields for `primaryKeyword`, `secondaryKeywords`, `searchText`, `relatedRecipePaths`, and `relatedDocPaths` so recipes can power metadata, site search, sidebars, and cross-links consistently.
- Add each canonical recipe route to `example/src/constants/seo-pages.json` and make sure `example/public/sitemap.xml` is generated or updated from the same canonical page set.
- Extend `example/scripts/validate-seo.mjs` as needed so recipe routes cannot be added without metadata, canonical inclusion, sitemap coverage, and searchable text. Account for the current validator's direct route extraction if recipes use a new or generated route pattern.
- Extend `example/scripts/build-seo.mjs` or the runtime structured-data path if recipe pages need `BreadcrumbList` or `FAQPage` JSON-LD beyond the existing generic page metadata.
- Use reusable docs primitives where possible, but create recipe-specific page components when they make real-world examples clearer.
- Every recipe page should include a runnable or copy-ready TypeScript/React example, the field configuration, the relevant import paths, expected output where applicable, and links to related documentation/API pages.
- Keep examples realistic enough to be useful, but small enough that a developer can lift the pattern into an app.

**Recommended first-pass recipe set:**

- `/recipes/prisma-filter-ui` - Build a Prisma filter UI that maps builder rules to a Prisma `where` object.
- `/recipes/mui-datagrid-advanced-filtering` - Pair the MUI adapter with MUI DataGrid-style advanced filtering.
- `/recipes/ag-grid-query-builder` - Use React Query Builder as an external advanced filter panel for AG Grid.
- `/recipes/tanstack-table-filtering` - Pair the builder with TanStack Table filtering for a common React table workflow.
- `/recipes/react-hook-form-query-builder` - Integrate query state with React Hook Form, validation, submit/reset flows, and dirty state.
- `/recipes/persist-filters-in-url` - Serialize filters to URL query params and restore them on page load.
- `/recipes/save-load-filter-presets` - Save, load, rename, and validate reusable filter presets.
- `/recipes/server-side-filtering` - Show how to send builder data to an API, validate it server-side, and return filtered results using a mocked backend response in the static demo site; server code should be illustrative or contract-focused unless a real backend is added later.
- `/recipes/sql-where-to-react-query-builder` - Convert a SQL `WHERE` clause into React Query Builder data with `parseQuery`.
- `/recipes/export-to-mongodb-query` - Export visual filters to MongoDB query syntax.
- `/recipes/export-to-prisma-where-clause` - Export builder data to a Prisma `where` clause and call out differences from the full Prisma UI recipe.
- `/recipes/dynamic-operators-by-field-type` - Show dynamic operator/value configuration for text, number, date, boolean, enum, nullable, and field-comparison rules.
- `/recipes/ai-assisted-filter-creation` - Experimental recipe that turns natural language into draft filter rules, with explicit validation and human review before applying.

**Recommended second-pass or split-out recipes:**

- `/recipes/react-sql-filter-builder` - Build a React SQL filter builder that edits visual rules and exports a SQL `WHERE` clause. Publish separately only if it is clearly about authoring/exporting SQL and does not duplicate the SQL import recipe.
- `/recipes/enterprise-filter-builder` - Combine tenant-scoped filters, locked/read-only system rules, and permission-aware field/action visibility into one strong enterprise recipe first.
- `/recipes/multi-tenant-filter-builder` - Split out later if there is enough distinct code around tenant scoping and locked system predicates.
- `/recipes/read-only-enterprise-filters` - Split out later if there is enough distinct code around locked compliance or admin-managed filters.
- `/recipes/rbac-aware-query-builder` - Split out later if there is enough distinct code around role-driven fields, operators, default rules, and actions.
- `/recipes/zod-validated-filters` - Validate incoming presets, URL filters, or AI-generated filters with Zod before rendering.
- `/recipes/date-range-filter-builder` - Handle date and datetime filtering, time zones, inclusive/exclusive ranges, and empty values.
- `/recipes/custom-components-design-system` - Replace controls to match an internal design system beyond the packaged adapters.

**De-prioritize unless a distinct example emerges:**

- A generic "React SQL Filter Builder" page and "Convert SQL WHERE -> React Query Builder" page can overlap. Keep both only if the first focuses on authoring/exporting SQL and the second focuses on parsing/importing SQL.
- "Export to Prisma Where Clause" can overlap with "Build a Prisma Filter UI". Keep both only if the Prisma UI recipe covers the full end-to-end form, while the export recipe is a concise formatter reference for developers who already have a builder.
- "Read-only enterprise filters", "multi-tenant filter builder", and "RBAC-aware query builder" are related. Start with one strong enterprise recipe unless each page has a distinct search intent and code path: locked system filters, tenant scoping, and permission-driven field/action visibility.

**Recipe page structure:**

- H1 that directly matches the search intent, such as "Build a Prisma Filter UI with React Query Builder".
- Short intro paragraph that names the problem, the target framework/data layer, and the library value proposition.
- "What this recipe builds" section with concrete capabilities and assumptions.
- "Install" or "Imports" section when the recipe needs adapter or peer dependencies.
- "Fields and initial query" section with a complete, typed configuration.
- "Builder implementation" section with the main React component.
- "Serialize, parse, or export" section when the recipe touches SQL, MongoDB, Prisma, URL state, presets, API calls, or mocked server responses.
- "Validation and safety" section for recipes involving user-generated filters, server-side execution patterns, mocked server responses, RBAC, tenant scoping, read-only filters, or AI-generated drafts.
- "Production notes" section with edge cases and links to docs/API pages.
- FAQ section with 2-4 concise questions that can become `FAQPage` structured data where useful.

**SEO requirements:**

- Each recipe must have a unique title, meta description, canonical URL, H1, intro copy, and crawlable body text.
- Titles should target practical queries naturally, for example "Prisma Filter UI", "MUI DataGrid Advanced Filtering", "AG Grid Query Builder", "TanStack Table Filtering", "React Hook Form Query Builder", "Persist React Filters in URL", and "SQL WHERE to React Query Builder".
- Meta descriptions should describe the concrete outcome and include the primary technology/library where relevant.
- Add structured data for recipe pages using `TechArticle`, `BreadcrumbList`, and `FAQPage` where the page has real FAQ content.
- Add internal links from relevant documentation/API pages to recipes, especially `formatQuery`, `parseQuery`, adapters, locking/read-only, dynamic field options, validation, and components.
- Add cross-links between related recipes without creating circular boilerplate blocks on every page.
- Avoid thin pages. If a page cannot provide a distinct working pattern, merge it into a stronger recipe or keep it off the sitemap until it is ready.
- Avoid keyword stuffing. Every repeated phrase should appear in useful explanatory copy, code labels, headings, or related links.

**Acceptance criteria:**

- `Recipes` appears as the last top-level nav item on desktop and mobile.
- `/recipes` lists all published recipes grouped by use case, with concise descriptions and links.
- Every published recipe has its own route, sidebar entry, metadata entry, sitemap entry, and site-search entry.
- Every published recipe has a copy-ready example that type-checks against current public exports.
- Copy-ready snippets that use only installed dependencies are covered by TypeScript validation, while snippets requiring host-app dependencies not present in `example/package.json` are clearly marked illustrative.
- Runnable site code does not import Prisma, AG Grid, MUI DataGrid, React Hook Form, MongoDB, AI SDKs, or other absent dependencies unless those packages are intentionally added to the example project.
- Recipes that mention MUI, AG Grid, TanStack Table, React Hook Form, Prisma, MongoDB, or AI integrations clearly distinguish library code from host-app/framework-specific code.
- Security-sensitive recipes explain server-side validation and do not imply client-side filters are sufficient for authorization, tenant isolation, SQL safety, Prisma safety, MongoDB safety, or RBAC enforcement. Since the demo website is static and has no backend, server-side recipes must clearly label backend code as mocked, illustrative, or an API-contract example.
- AI-assisted filtering is clearly marked experimental and requires schema validation plus user confirmation before applying generated rules.
- Existing documentation/API pages link into relevant recipes for `formatQuery`, `parseQuery`, adapters, locking/read-only, dynamic field options, validation, and components.
- The SEO validation script passes and catches missing recipe metadata or sitemap coverage.
- The example build succeeds.
- Representative recipe pages pass Lighthouse SEO checks.

**Implementation notes:**

- Prefer a `RecipesPage` that mirrors `DocumentationPage`/`ApiPage`, with `recipes-content.tsx`, `recipeGroups`, `recipesOverviewPage`, and `findRecipePage(pathname)`, then lazy-load `RecipesPage` in `example/src/app/app.tsx`.
- Prefer a `recipes-content.tsx` registry with a shared `IRecipePage` shape instead of hard-coding route content in the route component.
- Reuse `DocumentationSidebar` if its neutral navigation shape is sufficient; otherwise extract a generic content sidebar so documentation and recipes do not drift.
- Use existing `ContentArticle`, `CodeBlock`, `AlertBox`, and docs primitives for consistency.
- Consider adding recipe-specific helpers for repeated code snippets, such as shared commerce fields, user/account fields, and formatter examples.
- If recipes need third-party examples or backend examples whose packages/runtime are not dependencies of `example`, keep the snippets illustrative and do not import or execute them in the running site unless the package or backend is intentionally added.
- Update or extend SEO validation so new recipe routes cannot be added without metadata, canonical inclusion, and searchable text.

**Verification:**

- Run `npm run build --workspace example`.
- Run the SEO validation script for the example site.
- Manually inspect `/recipes`, at least one adapter recipe, one table/grid recipe, one export/parse recipe, one security-sensitive recipe, and the AI-assisted recipe.
- Confirm `dist/recipes/.../index.html` exists for every canonical recipe and contains a unique title, meta description, canonical link, and structured data.
- Confirm generated metadata, canonical links, structured data, and sitemap entries for all recipe routes.
- Confirm top navigation remains usable at desktop and mobile widths.

### T003 - Add interactive demos to recipe pages

**Status:** `[x]` Done

**Goal:** Make every published recipe immediately useful by rendering a working, recipe-specific demo above its code snippets so visitors can change rules and see the resulting integration behavior.

**Scope:**

- Add a live-demo slot to the recipe page model and render it after "What this recipe builds" and before the copy-ready snippets.
- Give every recipe its own lazy-loaded `demos/<recipe>.demo.tsx` component so unrelated routes do not download all demos or integration libraries.
- Keep the existing crawlable copy, snippets, FAQs, metadata, structured data, and static SEO fallback. Interactive UI is progressive enhancement and must not replace indexable content.
- Add browser-compatible integration libraries only to `example/package.json`: MUI DataGrid, AG Grid, TanStack Table, and React Hook Form. Do not add them to the root library package manifest. The workspace lockfile may change as part of installing example dependencies.
- Use actual host libraries wherever the integration can run safely in the static example site. Keep database, backend, and AI-provider execution explicitly mocked because those require trusted infrastructure or credentials.
- Keep components slim and focused. Use one component per component file and one utility per `*.util.ts` file; do not introduce a universal demo engine or a component with route-specific branches.

**Interaction and styling revision (supersedes reset/apply-gate requirements below):**

- Reuse the Demo page's isolated Builder surface so recipe-owned form styles never cascade into Builder or adapter controls. Default Builders use the same library theme boundary; adapter Builders retain their host styling.
- Start every demo with a useful non-empty query and an already filtered or generated result.
- Builder changes immediately update the integrated grid, table, mocked server response, URL, parser result, form state, or formatter output. Do not require generic Search, Send, Apply, or Reset actions.
- Remove raw payload previews when a visible integrated result communicates the behavior. Formatter syntax and a share URL remain valid primary outputs for export/persistence recipes.
- Keep actions only when they are the workflow being demonstrated: preset CRUD, React Hook Form submit/reset semantics, AI generate/review/confirm/cancel, dynamic option loading, URL copy, and Prisma wrapping.
- Server filtering debounces and aborts stale automatic requests; SQL import parses automatically and retains its last valid Builder after errors; AI output affects filtered rows only after explicit confirmation.
- Browser verification must compare default and MUI Builder styling with the Demo page, confirm prefiltered initial results, and prove query edits propagate without generic action gates.

**Demo architecture:**

- Add one recipe demo component per published recipe.
- Add a small shared `RecipeDemoFrame` for the heading, live/mock status, boundary note, reset/actions, and responsive content surface.
- Add a shared `RecipeDemoOutput` for labelled live output and accessible status/error announcements.
- Add a shared `RecipeDataTable` only for demos that need a small accessible result table.
- Keep host translations and validation logic in separate focused utilities, such as query-row evaluation, DataGrid model translation, URL decoding, preset validation, server request validation, and AI draft validation.
- Share sample rows or field definitions only when at least three demos use the identical model; otherwise colocate component-owned constants with their demo.

**Interactive recipe coverage:**

- `/recipes/prisma-filter-ui`: render a real Builder and Prisma formatter, then let the user send a mocked request and inspect the request payload and filtered response rows. Prisma serialization is real; Prisma Client execution is visibly mocked.
- `/recipes/mui-datagrid-advanced-filtering`: render the real MUI adapter and MUI DataGrid, with builder data translated into the grid filter model and immediately reflected in visible rows.
- `/recipes/ag-grid-query-builder`: render a real AG Grid with the Builder as an external filter panel, including the external-filter lifecycle and visible filtered rows.
- `/recipes/tanstack-table-filtering`: render a real TanStack Table whose global filter predicate is driven by the nested Builder query, with a visible match count.
- `/recipes/react-hook-form-query-builder`: use a real React Hook Form `Controller`, dirty state, validation, submit payload, and reset flow.
- `/recipes/persist-filters-in-url`: update and restore the real `filter` query parameter, preserve unrelated query parameters, expose a shareable URL, handle invalid payloads safely, and reset without reloading.
- `/recipes/save-load-filter-presets`: persist validated, versioned presets in a recipe-specific localStorage key and support save, load, rename, delete, and query reset without silently deleting saved presets.
- `/recipes/server-side-filtering`: execute a deterministic mocked async API request with loading, validation error, success, request preview, page limits, and returned rows. Clearly identify it as a mock API.
- `/recipes/sql-where-to-react-query-builder`: accept editable SQL, run the real parser, show inferred fields and an editable Builder, retain the last valid result after parse errors, and reset to the sample SQL.
- `/recipes/export-to-mongodb-query`: render a real Builder with live MongoDB formatter output and make clear that serialization does not execute a database query.
- `/recipes/export-to-prisma-where-clause`: render a real Builder with live Prisma output, wrapping options, and reset; keep it distinct from the end-to-end Prisma UI workflow.
- `/recipes/dynamic-operators-by-field-type`: render real type-specific operators, field comparison, validation, and imperative option state changes, including loading, success, error, refresh, and reset controls.
- `/recipes/ai-assisted-filter-creation`: provide a deterministic local natural-language simulation that produces a draft, validates the schema and allowlists, shows an editable preview, and requires explicit confirmation before applying. Never contact a provider or auto-apply a draft.

**State, reset, accessibility, and safety:**

- Every demo starts with a useful non-empty query, renders the actual Builder, and shows a recipe-specific integrated result rather than only raw builder JSON.
- Generic Reset is omitted. Workflow-specific React Hook Form reset restores form state; presets are deleted only through the explicit Delete action.
- Derived rows and formats are memoized. Parser, formatter, storage, clipboard, and mocked request errors are caught and displayed safely.
- Actions are disabled when invalid or loading. Mock timers must not update state after unmount.
- Outputs wrap or scroll safely on mobile and use labels, `aria-live` status regions, proper form labels, button types, disabled states, and accessible table captions and headers.
- Client-side filtering never claims to provide authorization, tenant isolation, SQL safety, Prisma safety, or MongoDB safety.

**Routing and SEO:**

- Do not add routes, canonicals, or sitemap entries; the existing 13 recipe routes remain canonical.
- Query-string demo state must not alter the recipe canonical URL.
- Keep existing H1s, explanatory sections, copy-ready snippets, FAQs, structured data, and generated crawlable HTML intact.
- Demo modules must avoid module-scope browser globals so the build and SEO generation remain safe.
- Verify lazy demo chunks work when loading built recipe routes directly under the GitHub Pages base path.

**Testing:**

- Add focused tests for query-row evaluation, host-model translations, URL validation and parameter preservation, preset validation, mocked server limits, and AI draft allowlisting.
- Add interaction coverage for SQL parse success/error retention, React Hook Form dirty/submit/reset, preset save/load/rename/delete, URL reset, AI confirmation, and mocked server request states where the existing test setup supports it.
- Extend recipe validation so all 13 detail pages are required to provide a unique demo loader targeting an existing module.
- Run Prettier on all modified code, recipe snippet validation, relevant TypeScript checks, the example build, SEO validation, and relevant Jest tests.
- Browser-test all 13 demos at desktop and mobile widths, exercise direct result propagation and workflow-specific actions, reload URL/preset demos, check direct route loads, and inspect console errors.
- Run the code review agent only after implementation and verification are complete.

**Acceptance criteria:**

- All 13 recipe pages render a working Builder-based demo above their code snippets.
- Every demo has a useful prefiltered initial state, recipe-specific live output, error handling, isolated Builder styling, and immediate propagation without generic apply/reset gates.
- MUI DataGrid, AG Grid, TanStack Table, and React Hook Form use real example-only dependencies and are lazy-loaded.
- Prisma and MongoDB formatting use real public exports, while database execution remains clearly mocked or absent.
- The server demo is visibly mocked and rejects invalid, disallowed, oversized, or overly complex filters.
- The AI demo is visibly experimental, validates all generated drafts, and cannot apply a draft without explicit confirmation.
- URL state survives reload and preserves unrelated parameters; presets survive reload and validate stored data; SQL parse failures retain the last valid builder state.
- Existing recipe SEO, sitemap coverage, structured data, static fallback content, and direct-route behavior remain valid.
- No catch-all demo component, multi-utility file, root-library runtime dependency, or unnecessary abstraction is introduced.
- Formatting, build, validation, focused tests, responsive checks, and final review pass.

### T004 - Add Google Analytics to the production website

**Status:** `[x]` Done

**Goal:** Add Google Tag Manager analytics to the website hosted at
`www.react-query-builder.com` without loading it on GitHub Pages or local builds.

**Scope:**

- Add the `GTM-WPZDH54F` head script and opening-body noscript fallback.
- Include the snippets only when `VITE_SITE_URL` targets
  `www.react-query-builder.com`.
- Keep the deployment-specific HTML transformation isolated from the Vite
  configuration.

**Acceptance criteria:**

- The production website build includes both Google Tag Manager snippets.
- The GitHub Pages build and local builds contain no Google Tag Manager markup.
- The example website build succeeds.

**Verification:**

- Build the example website with the production website URL and inspect the
  generated HTML.
- Build the example website with the GitHub Pages URL and confirm the generated
  HTML contains no Google Tag Manager markup.
- Run Prettier on all modified code.

### T005 - Add cookie consent for Google Analytics

**Status:** `[x]` Done

**Goal:** Require an explicit visitor choice before Google Analytics storage is
enabled on the production website.

**Scope:**

- Add a cookie consent bar using `react-cookie-consent`.
- Default Google Tag Manager consent to denied before the container loads.
- Update Google consent state when analytics cookies are accepted or declined.
- Keep the consent UI and analytics consent utilities focused and isolated.

**Acceptance criteria:**

- New visitors can accept or decline analytics cookies from an accessible consent
  bar.
- Analytics storage remains denied until consent is accepted.
- A saved choice is restored without prompting the visitor on every page load.
- Google Tag Manager remains restricted to the production website build.
- The example website build succeeds.

**Verification:**

- Run focused consent tests.
- Build the example website and inspect the production consent-mode markup.
- Run Prettier on all modified code.

### T006 - Improve MUI adapter density and isolate demo styles

**Status:** `[x]` Done

**Goal:** Make the MUI adapter use consistent 32px-high controls with 14px typography and prevent the example website's styles from affecting MUI demo components.

**Scope:**

- Use MUI's smallest native variants and enforce a 32px height with 14px typography for single-line adapter inputs, selects, and buttons; align switches within the same control row while preserving MUI's native small geometry.
- Render the NOT, AND, and OR controls as a small primary MUI toggle button group while preserving independent negation and combinator behavior.
- Remove adapter sizing overrides that enlarge native small controls.
- Use integer group-body spacing and vertically center root and nested group-header controls.
- Isolate MUI demo rendering from inherited example-site typography and control styles.
- Add focused tests for compact variants, toggle grouping, and interaction behavior.

**Acceptance criteria:**

- MUI adapter single-line form and action controls render at 32px high with 14px typography in both v7 and v9 mappings, while switches retain MUI small-size geometry.
- NOT, AND, and OR render as small primary MUI toggle buttons in one group.
- Toggling NOT does not change AND or OR, and changing AND or OR does not change NOT.
- Disabled and read-only toggle behavior remains intact.
- Root and nested MUI group headers use consistent integer vertical positioning for their controls.
- Example-site styles do not override the MUI demo's component baseline.
- No public Builder or adapter API changes are introduced.

**Verification:**

- Run focused MUI adapter tests.
- Run lint, library build, and example build.
- Run Prettier on all modified code and task files.
- Review the final diff against repository structure and testing rules.

### T007 - Add first-party locale string subpath exports

**Status:** `[x]` Done

**Goal:** Move localization ownership into `src/locales` and ship complete first-party
UI string translations for ten locales through explicit package subpaths, while preserving
the existing English `strings` export from the package root.

**Architecture and public API decisions:**

- Make `src/locales` the canonical source location for the string contract and all
  first-party translations; remove localization ownership from `src/constants/strings.ts`.
- Keep internal folders and files kebab-case, for example `src/locales/en-us`, while
  public package paths use the exact canonical locale casing.
- Give `en-US` sole ownership of the existing English translation. Re-export that translation
  as the package-root named `strings` export so this existing import remains backward
  compatible:
  `import { strings } from '@vojtechportes/react-query-builder'`.
- Expose a named `strings` export from each exact, case-sensitive subpath:
  - `@vojtechportes/react-query-builder/locale/en-US`
  - `@vojtechportes/react-query-builder/locale/fr-FR`
  - `@vojtechportes/react-query-builder/locale/it-IT`
  - `@vojtechportes/react-query-builder/locale/de-DE`
  - `@vojtechportes/react-query-builder/locale/es-ES`
  - `@vojtechportes/react-query-builder/locale/pt-PT`
  - `@vojtechportes/react-query-builder/locale/cs-CZ`
  - `@vojtechportes/react-query-builder/locale/sk-SK`
  - `@vojtechportes/react-query-builder/locale/zh-CN`
  - `@vojtechportes/react-query-builder/locale/zh-TW`
- Keep `IStrings` publicly importable from the package root and keep its properties
  optional so consumer-authored partial overrides remain backward compatible.
- Do not add locale auto-detection, an all-locales barrel or registry, pluralization,
  field/option-label translation, default exports, or wildcard package exports.

**Implementation phases:**

- [x] Move the localization model and English translation:
  - Relocate `IStrings` into a focused type file under `src/locales`.
  - Relocate the current English values into the `en-US` locale module.
  - Update all internal imports that currently reference `constants/strings`.
  - Update `src/index.tsx` to re-export the `en-US` translation under the existing
    named `strings` API and continue exporting `IStrings`.
  - Remove the old constants module after all consumers have migrated; do not keep
    two canonical English objects.
- [x] Add translation integrity tests before translating:
  - Recursively compare every shipped locale's leaf paths with `en-US` and fail on
    missing or extra keys.
  - Require every translation leaf to be a non-empty string.
  - Compare the exact placeholder multiset for corresponding messages. Word order may
    differ, but token names and occurrence counts may not.
  - Reject stray placeholder-like tokens and verify root `strings` and
    `locale/en-US` resolve from the same English source.
- [x] Add the `en-US` public entry and package plumbing:
  - Add an explicit `tsdown.config.ts` entry that emits locale-only ESM, CommonJS,
    and declaration artifacts.
  - Add explicit `types`, `import`, and `require` conditions to
    `package.json#exports`.
  - Add the public `.d.ts` target to `package.json#files`; the current declaration
    exclusion otherwise removes it from the published package.
- [x] Use a two-agent translation workflow for every non-English locale:
  - Spawn one dedicated localization sub-agent to translate one locale from the
    canonical `en-US` translation and preserve UI intent, terminology, and placeholders.
  - After that translation is complete, spawn a separate proofreading sub-agent for
    the same locale to compare it with `en-US` and check linguistic correctness,
    regional usage, consistency, UI brevity, technical terminology, and placeholders.
  - Resolve all proofreading findings before marking that locale complete, and record
    any disputed wording or remaining linguistic risk in the task notes.
  - Keep each sub-agent scoped to its assigned locale so translations and reviews are
    independently attributable and concurrent edits do not overlap.
  - `en-US` retains the existing English copy and requires compatibility and translation
    integrity review rather than translation.
- [x] Add complete Western European translations and explicit build/export/file entries:
      `fr-FR`, `it-IT`, `de-DE`, `es-ES`, and `pt-PT`.
- [x] Add complete Central European translations and explicit build/export/file entries:
      `cs-CZ` and `sk-SK`.
- [x] Add complete Chinese translations and explicit build/export/file entries:
      `zh-CN` in Simplified Chinese and `zh-TW` in Traditional Chinese.
- [x] Update README and example-site localization documentation with all ten exact
      import paths, supported locale names, and a complete
      `<Builder strings={strings} />` example. Explain that the package-root import
      remains the backward-compatible English form.
- [x] Add locale selection to the Demo website:
  - Add an accessible `Locale` select directly below `New node placement` in the
    left-hand playground configuration panel.
  - List all ten locale identifiers with clear human-readable names and default to
    `en-US`.
  - Map each option to its locale subpath's named `strings` export and pass the selected
    translation to every Builder rendering path, including the default and all adapter
    demos.
  - Change the Builder's built-in labels, actions, validation messages, and text-mode
    diagnostics immediately without resetting query data or other playground settings.
    Keep the surrounding Demo website, field labels, and option labels in English.
  - Update the generated Builder source preview to include the selected locale import
    and `strings` prop, while keeping the default `en-US` output concise and consistent
    with the documented backward-compatible import.
  - Add focused tests for option coverage, default selection, control placement,
    locale switching, state preservation, adapter rendering, and generated source.
- [x] Validate the built and packed package from consumer-style ESM, CommonJS, and
      TypeScript imports, then run the repository-required code review agent and resolve
      its findings.

**Translation requirements:**

- Every non-English translation covers the complete `en-US` shape, including
  `textMode.sql`, `validation`, deprecated operator aliases, history, locking, and
  field-comparison messages. First-party translations must not depend on English fallback
  text for missing leaves.
- Preserve interpolation placeholders exactly, including `{token}`, `{value}`,
  `{keyword}`, `{operator}`, `{field}`, `{valueField}`, `{min}`, and `{max}`.
- Translate prose and display labels, but retain literal SQL keyword spelling such as
  `AND`, `OR`, `NOT`, `IN`, `LIKE`, `IS`, `NULL`, and `BETWEEN` where diagnostics
  refer to SQL syntax.
- Use idiomatic regional terminology: European Portuguese rather than Brazilian
  Portuguese, distinct Czech and Slovak wording, Simplified Chinese for `zh-CN`, and
  Traditional Chinese for `zh-TW`.
- Preserve UTF-8 text, diacritics, and locale-appropriate punctuation.
- Require the independent proofreading sub-agent to approve each translated locale
  after its findings are resolved. Automated checks and agent proofreading can verify
  consistency and catch likely language errors, but any nuance that cannot be
  confidently certified must remain documented as a human-review risk.

**Acceptance criteria:**

- `src/locales` is the single source of truth for `IStrings` and all first-party
  translations; the old `src/constants/strings.ts` implementation no longer exists.
- The package-root named `strings` export remains source-compatible and behaviorally
  identical to the current English translation.
- All ten public subpaths resolve with exact casing on a case-sensitive filesystem and
  expose named `strings` values assignable to `IStrings`.
- The root `strings` export and `locale/en-US` are backed by the same canonical English
  module, with no duplicated translation to drift.
- Each locale has exactly the English leaf keys, all leaves are non-empty, and every
  message preserves the corresponding placeholder multiset.
- Each locale has working ESM (`.mjs`), CommonJS (`.cjs`), and TypeScript declaration
  (`.d.ts`) targets represented in `package.json#exports` and present in the published
  tarball.
- Importing a locale does not require optional UI-adapter peer dependencies and does
  not pull the main React component entry into a locale-only consumer bundle.
- README and website localization documentation list every supported locale and the
  named import form without introducing an undocumented aggregate or wildcard API.
- The Demo's left panel shows an accessible `Locale` select immediately below
  `New node placement`, includes all ten locales, and defaults to `en-US`.
- Changing the Demo locale updates built-in Builder strings across every component
  adapter without changing query data, configuration state, fields, or surrounding
  website copy.
- The Demo source preview uses the selected locale's exact public subpath and passes
  its `strings` export to Builder.
- Every non-English locale has a recorded localization pass and a separate recorded
  proofreading pass; all actionable findings are resolved before completion.
- Any linguistic nuance that the proofreading sub-agent cannot confidently certify is
  recorded explicitly as a remaining human-review risk.

**Task notes:**

- Dedicated translation and independent proofreading passes completed for all nine
  non-English locales. All actionable findings were resolved.
- Remaining human-review risk is limited to glossary preferences and language features
  the single-string API cannot express: Czech plural inflection, French collection-
  operator direction, and preferred terms for builder, modifiers, token, scalar, and
  array. No known correctness issue remains.
- Verification passed translation integrity, placeholders, root English identity,
  exact-case ESM/CommonJS/TypeScript subpaths, packed artifacts, Demo switching,
  adapters, CJK rendering, responsive layout, full Jest, library and example builds,
  SEO validation, modified-file lint, and Prettier. Repository-wide lint still reports
  pre-existing errors in untouched files.
  **Verification:**

- Run focused translation path, non-empty-value, placeholder, and English re-export tests.
- Run type-resolution checks importing all ten subpaths and confirm the existing root
  import still type-checks.
- Run the library build and assert that every locale produces `.mjs`, `.cjs`,
  `.d.mts`, `.d.cts`, and copied public `.d.ts` artifacts.
- Smoke-test every built subpath through ESM `import` and CommonJS `require`.
- Run focused Demo playground tests for the locale selector, all option mappings,
  representative Latin and CJK rendering, state preservation, every adapter path, and
  generated source output.
- Manually verify the selector appears directly below `New node placement` at desktop
  and responsive widths and that changing locale visibly updates the rendered Builder.
- Run `npm pack --dry-run --json`, or create a tarball in a temporary directory, and
  verify every exported runtime and declaration target is present. Prefer installing
  the tarball in temporary ESM and CommonJS consumers over importing `dist` directly.
- Run the full test suite, lint, Prettier check, library build, and example build.
- Review the final diff against repository naming, placement, API, and testing rules.

### T008 - Normalize FTP URLs and add static SEO fallbacks

**Status:** `[~]` In progress

**Goal:** Make every canonical example-site URL resolve consistently on the FTP-hosted
production domain and ship meaningful crawlable HTML for every canonical route before
the React application loads.

**Scope:**

- Add an Apache `.htaccess` configuration that is included only in the FTP deployment;
  it must not be copied into ordinary local builds or the GitHub Pages artifact.
- Keep the existing non-trailing-slash canonical URL convention and serve canonical
  directory routes without a redirect through HTTP.
- Redirect trailing-slash route variants directly to their HTTPS, `www`, non-trailing-
  slash canonical URL in one hop, while leaving the site root and real static files
  untouched.
- Prevent directory listing on the FTP host.
- Extend the SEO build so every canonical Home, Documentation, API, Demo, and Recipes
  route contains a route-specific static fallback with an H1, description, and useful
  navigation before React replaces the fallback.
- Preserve the richer capabilities, safety, production, and FAQ fallback content already
  generated for recipe pages.
- Extend SEO validation so future canonical routes cannot be built without crawlable
  fallback content.

**Acceptance criteria:**

- The FTP artifact contains `.htaccess`; the GitHub Pages artifact and a normal example
  build do not.
- Every sitemap URL is the directly served canonical URL on the FTP host after deployment,
  without an HTTPS-to-HTTP redirect.
- A trailing-slash page URL redirects once to the corresponding HTTPS `www` canonical URL.
- `robots.txt`, `sitemap.xml`, assets, and the root URL remain directly accessible.
- All canonical generated HTML files contain a unique H1, the page description, and a
  `data-seo-fallback` marker.
- Recipe pages retain their existing detailed static fallback sections and FAQ content.
- The generated fallback navigation uses deployment-aware canonical URLs for both the
  custom production domain and the GitHub Pages base path.
- SEO validation, recipe validation, the example production build, and the GitHub Pages
  build pass.

**Verification:**

- Run `npm run seo:validate --workspace example` before and after building.
- Build with `VITE_SITE_URL=https://www.react-query-builder.com/` and verify all canonical
  route HTML files, sitemap entries, robots output, and static fallbacks.
- Copy the FTP-only hosting configuration as the workflow does and verify the resulting
  artifact contains `.htaccess`.
- Build with the GitHub Pages base path/site URL and verify `.htaccess` is absent and all
  generated links use the repository base path.
- After deployment, crawl all sitemap URLs without following redirects and verify they
  return `200`; verify representative trailing-slash variants redirect directly to HTTPS
  canonical URLs.

### T009 - Pre-render static example pages with client-only interactive islands

**Status:** `[x]` Done

**Goal:** Generate complete, route-specific HTML for every canonical example-site page at
build time while preserving Builder, data-grid, editor, and other browser-only experiences
as interactive client-side islands.

**Architecture decisions:**

- Treat this as static-site generation rather than request-time SSR. Both FTP and GitHub
  Pages must continue to receive ordinary static files and require no Node.js server.
- Keep `example/src/constants/seo-pages.json` as the canonical list of pages to generate.
  A route cannot become canonical without producing a corresponding HTML document.
- Extract the route element tree from the current `BrowserRouter` wrapper so the client
  entry and the build-time renderer use the same routes and page components.
- Add a build-only server entry that renders one canonical route at a time with a static
  router and React's server-rendering APIs.
- Hydrate the generated document with `hydrateRoot`; do not use `createRoot` to discard
  correctly pre-rendered page content.
- Introduce a reusable `ClientOnly`/island boundary. The server and the browser's first
  hydration render must emit the same accessible placeholder. Browser-only modules load
  only after hydration and then replace that placeholder.
- Keep Builder, Monaco, data grids, drag-and-drop demos, cookie consent, analytics, and any
  module that reads browser globals behind client-only boundaries. Do not evaluate those
  modules in the SSG process.
- Render all meaningful surrounding content statically: page headings, explanations,
  navigation, code examples, expected output, safety notes, FAQs, and links.
- Collect styled-components server styles and inject them into each generated document so
  the pre-rendered page does not flash unstyled or change structure during hydration.
- Preserve the current canonical URL, structured-data, sitemap, robots, FTP `.htaccess`,
  analytics, and deployment-specific base-path behavior. Remove the generic SEO fallback
  only after full SSG output is verified to provide equal or better crawlable content.

**Implementation phases:**

- [x] Audit server-rendering compatibility:
  - Identify page modules and shared components that read `window`, `document`, storage,
    media queries, observers, or layout measurements during module evaluation or render.
  - Identify browser-only third-party packages that must not enter the server bundle.
  - Classify each component as fully static, hydration-safe interactive UI, or client-only
    island, and record intentional placeholders.
- [x] Share routing between browser and build-time rendering:
  - Move canonical route declarations into a reusable route component or route-object
    registry without changing public URLs or redirects.
  - Keep `BrowserRouter` and deployment basename handling in the client entry.
  - Use the corresponding static router in the SSG entry and verify nested direct routes.
- [x] Add client-only island infrastructure:
  - Render the same stable placeholder on the server and during the first client render.
  - Activate the real component after an effect confirms that hydration has completed.
  - Dynamically import heavy browser-only modules so their top-level code is never
    evaluated by the SSG bundle.
  - Provide accessible loading labels, fixed or minimum dimensions where practical, and
    reduced-motion behavior to limit layout shift.
- [x] Make page content server-renderable:
  - Pre-render Home, Documentation, API, Demo, and Recipes page structure and prose.
  - Keep interactive Builder and recipe demos as islands while rendering their titles,
    instructions, source examples, and expected results statically.
  - Replace browser-derived initial values with deterministic server/client defaults and
    apply persisted preferences only after hydration.
- [x] Add the SSG build pipeline:
  - Produce a Vite SSR/build-time bundle separate from the browser bundle.
  - Iterate over every canonical SEO page, render it at its deployment-aware pathname,
    collect server styles, and write the result to the route's `index.html`.
  - Inject route-specific metadata and JSON-LD from the existing SEO registry without
    duplicating metadata ownership.
  - Ensure temporary server-rendering artifacts are excluded from deployable output.
- [x] Switch the client entry to hydration:
  - Hydrate pre-rendered pages with output identical to the server's initial tree.
  - Preserve client-side navigation after the first direct page load.
  - Detect and fail tests on hydration mismatch warnings or duplicate React roots.
- [x] Integrate deployment variants:
  - Generate correct assets, internal links, canonicals, and router basenames for the FTP
    custom domain and the GitHub Pages repository base path.
  - Preserve FTP-only `.htaccess` copying and confirm the SSG step does not add it to the
    GitHub Pages artifact.
  - Preserve direct-route, redirect-only, 404, robots, sitemap, analytics, and consent
    behavior.
- [x] Remove obsolete fallback generation after parity is proven:
  - Retain island-level loading placeholders.
  - Remove generic page-level SEO fallback markup and styles only when every canonical
    route contains complete SSG HTML and all no-JavaScript checks pass.
  - Keep validation that prevents empty root documents from returning in future changes.

**Acceptance criteria:**

- Every canonical route produces a standalone HTML file containing its real page-specific
  H1 and meaningful body content before JavaScript executes.
- Documentation, API, Home, and Recipes pages remain readable and navigable with JavaScript
  disabled; interactive areas clearly degrade to useful placeholders and static guidance.
- Builder, Monaco, data-grid, table, form, and recipe-demo islands activate after hydration
  and behave the same as in the current client-rendered application.
- Server output and the initial browser render match without hydration warnings, replaced
  document trees, duplicated content, or duplicate styled-components rules.
- Browser-only dependencies are absent from server execution paths and cannot make the SSG
  build fail because DOM globals are unavailable.
- Each generated page retains its unique title, description, canonical URL, robots policy,
  Open Graph/Twitter metadata, structured data, and exactly one primary heading.
- The sitemap contains every canonical generated route exactly once and excludes redirect-
  only and fallback routes.
- FTP and GitHub Pages artifacts use their correct site URL, asset base, internal links,
  router basename, robots file, and sitemap; only the FTP artifact contains `.htaccess`.
- Direct navigation, reload, back/forward navigation, and client-side navigation work on
  representative top-level and deeply nested routes.
- SSG output is deterministic: two clean builds from the same commit produce equivalent
  route HTML apart from explicitly allowed hashed asset filenames.
- The initial page has no raw-content flash; static styles and island dimensions prevent
  avoidable layout shifts while keeping crawlable content genuinely visible.

**Verification:**

- Add automated coverage comparing the canonical SEO registry with generated route files
  and fail on missing, extra, empty, or duplicate outputs.
- Parse every generated HTML file and assert a unique title, description, canonical URL,
  one H1, structured data, page-specific body text, server styles, and hydration entry.
- Run the SSG build in a DOM-free Node.js process so accidental browser-global access fails
  during CI.
- Serve both production-domain and GitHub Pages builds locally and test representative
  Home, Documentation, nested Documentation, API, nested API, Demo, Recipes, and recipe
  detail routes.
- Repeat the representative route checks with JavaScript disabled and confirm meaningful
  content and navigation remain available.
- Capture browser console errors during hydration and fail on mismatch, uncaught exception,
  missing chunk, or duplicate-root warnings.
- Exercise each client-only island category after hydration: Builder, Monaco, DataGrid,
  AG Grid, TanStack Table, React Hook Form, and lightweight recipe demos.
- Verify direct loads and client navigation under `/` and `/react-query-builder/` base
  paths, including asset loading and canonical URL generation.
- Run SEO validation, recipe validation, focused SSG/island tests, the full example build,
  FTP artifact checks, GitHub Pages artifact checks, formatting, lint, and Lighthouse SEO
  checks on representative pages.
- After deployment, crawl all sitemap URLs as raw HTML and use Search Console URL Inspection
  on representative pages to confirm Google receives the pre-rendered content.

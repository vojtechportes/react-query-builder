# T010: v1/v2 example-site architecture decision

- Status: Accepted
- Date: 2026-07-23
- Decision: Build v1 and v2 as isolated Vite applications

## Context

The example site must preserve the published v1 experience while v2 changes its public
package, styling, documentation, demos, and generated artifacts. The current example is a
single application with one route tree, one search/content model, one SEO registry, one
SSG entry, and one Vite package-resolution table. Extending that runtime with version
conditions would make it easy for a change intended for one version to affect the other.

T010 compared:

1. Two isolated Vite builds with independently owned application trees.
2. One runtime application that imports v1 and v2 through two npm aliases.

The architecture must isolate package and type resolution, React, CSS, client bundles,
SSR evaluation, pages, routes, navigation, search, and SEO/SSG output. It may share only
non-content infrastructure.

## Decision drivers

- v1 must resolve the exact published `1.33.1` package.
- v2 must resolve the local future-2.0 package during development and the published 2.0
  package after release.
- A target must never import the other version's runtime or CSS.
- Each target must have one React and one React DOM runtime.
- Pages, copy, navigation, search, routes, and SEO/SSG code and data must evolve
  independently, even where their initial contents match.
- The static FTP and GitHub Pages deployments must keep working without a Node server.
- Version builds must not overwrite or mutate one another's output.
- Shared code must have a narrow, mechanically enforceable ownership boundary.

## Decision

Use two isolated Vite applications and assemble their completed static artifacts only
after both builds succeed.

Each version owns its client entry, server entry, router, route manifest, page components,
copy, navigation data, search data/indexing, metadata, canonical registry, structured
data, sitemap, robots policy, SSG orchestration, and version-specific validation.

The builds may share shell chrome without navigation content, low-level UI primitives,
analytics and consent plumbing, mechanical URL/version utilities, artifact assembly,
non-content fixtures, and test infrastructure. Shared code must not import either
version-owned tree or either query-builder package alias.

### Folder ownership

T011 and T012 should establish this target shape incrementally:

```text
example/
  src/
    shared/
      analytics/
      components/
      test/
      utils/
    v1/
      app/
      components/
      constants/
      pages/
      entry-client.tsx
      entry-server.tsx
    v2/
      app/
      components/
      constants/
      pages/
      entry-client.tsx
      entry-server.tsx
  scripts/
    versioned-site/
  .versioned-dist/
    v1/
    v2/
  dist/
    v1/
    v2/
```

The exact slice-local folders may grow as content is migrated, but ownership must remain
the same. The `shared` tree is for approved non-content infrastructure only. In
particular, it must not contain page components, copy, navigation items, route
definitions, search records, canonical page registries, SEO metadata, structured data,
sitemap/robots data, or SSG page selection.

`.versioned-dist/v1` and `.versioned-dist/v2` are clean staging outputs. Artifact assembly
copies them into `dist/v1` and `dist/v2`; it does not transform, merge, or deduplicate
their JS, CSS, HTML, or SEO assets. Root and unversioned URLs will redirect to the
same-path v2 URL, while `/v1/*` and `/v2/*` remain independently generated static pages.
T013 owns the URL mechanics and T030 owns deployment assembly and redirects.

### Commands

T012 should expose one command per independently runnable target:

```text
npm run dev:v1 --workspace example
npm run dev:v2 --workspace example
npm run build:v1 --workspace example
npm run build:v2 --workspace example
npm run build:versions --workspace example
```

`dev:v1` and `dev:v2` select one application root and one package binding. They may run
on separate ports when used together, but neither development server loads the other
application graph.

`build:v1` and `build:v2` each run their own client build, DOM-free server build, SSG,
SEO validation, and hydration checks into their version staging directory.
`build:versions` runs both targets and then invokes shared artifact assembly. A failed
target prevents assembly.

### Package and runtime resolution

T011 must bind two unambiguous package identities:

- v1: an exact npm alias to
  `@vojtechportes/react-query-builder@1.33.1`.
- v2: the local package build/source during development and CI; the published
  `@vojtechportes/react-query-builder@2.0.0` package after release.

The binding must cover the root export and every supported subpath, including locales,
`parseQuery`, `formatQuery`, adapters, and Monaco. Client builds, SSR builds, tests, and
snippet type-checking must all use the same target-specific binding.

Each Vite target owns its package alias, `resolve.dedupe`, SSR externalization, TypeScript
paths, and test aliases. React and React DOM are singleton dependencies inside a target.
They are not shared as a runtime or emitted chunk between the two staged applications.
v1 retains its styled-components runtime. v2 owns its explicit stylesheet. Assembly
must not hoist, concatenate, or reorder version CSS.

## Candidate comparison

| Concern           | Isolated Vite builds                                             | Single runtime with npm aliases                                                      |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Package identity  | One version binding per graph; mechanically inspectable          | Both identities coexist in every graph                                               |
| TypeScript        | One public type surface per target                               | Both declaration surfaces enter one program and can become structurally incompatible |
| React             | One singleton per target                                         | One singleton is possible, but both libraries share its runtime state                |
| CSS               | Separate entry graphs and output directories guarantee ownership | v1 runtime styles and v2 CSS share a document; isolation and order are not proven    |
| Client bundles    | Version code is emitted only for its target                      | The minimal eager spike combined both implementations in one chunk                   |
| SSR               | Each target controls its own bundling/externalization policy     | Both packages and styling policies must coexist in one server graph                  |
| Content ownership | Separate route and content roots are the default                 | Requires pervasive conditional imports and boundary enforcement                      |
| SEO/SSG           | Separate registries and render passes produce separate artifacts | One runtime encourages shared routes, registries, and renderer state                 |
| Development       | Two explicit target commands                                     | One server is superficially simpler                                                  |
| Deployment        | Mechanical copy of opaque version artifacts                      | Requires separating assets produced by a combined graph                              |

The isolated approach has slightly more build configuration, but that configuration is
the isolation boundary the release requires. It also matches the dependency-driven
T011-T030 task sequence.

## Spike and verification evidence

A disposable spike was run on 2026-07-23 with Vite 6.4.3, TypeScript 5.6.3, and React
18.3.1. It used:

- `rqb-v1` as the exact npm alias
  `npm:@vojtechportes/react-query-builder@1.33.1`.
- `rqb-v2` as a local file package produced from the current working package artifact.
  The fixture still reports 1.33.1 because the future 2.0 artifact does not exist yet;
  the local-v2 resolution path, not future v2 behavior, was under test.
- Root and `formatQuery` imports in both isolated client entries, plus an `en-US` locale
  import in each version-specific client entry.
- Root and `parseQuery` imports in both isolated DOM-free SSR entries.
- Both aliases together in equivalent single-runtime client and SSR entries.

Commands and results:

| Check                              | Result                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------- |
| Alias type-check                   | Passed for both public type identities                                    |
| Isolated v1 client build           | Passed; 50 modules, 374.88 kB / 117.98 kB gzip                            |
| Isolated local-v2 client build     | Passed; 50 modules, 374.88 kB / 117.98 kB gzip                            |
| Single-runtime client build        | Passed; 76 modules, 605.83 kB / 189.57 kB gzip, with a chunk-size warning |
| Isolated v1 SSR build/render       | Passed; 10 modules, 468.58 kB, rendered without DOM globals               |
| Isolated local-v2 SSR build/render | Passed; 10 modules, 468.58 kB, rendered without DOM globals               |
| Single-runtime SSR build/render    | Passed; 19 modules, 942.20 kB                                             |
| Dependency tree                    | Exact v1 alias, local v2 path, one React 18.3.1 and one React DOM 18.3.1  |

The published v1 package needed to be included in the SSR bundle together with
styled-components, matching the current site's `ssr.noExternal` approach. In a single
runtime that policy must coexist with the future v2 package's different CSS/runtime
policy.

The render emitted existing v1 warnings for `hasDragHandle` and `isSelected` DOM props.
Those warnings were identical for the local fixture and are unrelated to the architecture
decision.

The single-runtime spike proves that aliases can compile and render a minimal current
surface. It does not prove the required isolation:

- both implementations were present in the same client and server graphs;
- future v2 types and stylesheet behavior do not exist yet and therefore cannot be
  validated inside the shared graph;
- both versions would share document-level CSS ordering and runtime state;
- the spike did not establish independent page, navigation, search, route, or SEO/SSG
  ownership in one application.

Because T010 says to prefer isolated builds unless every package, type, React, CSS, SSR,
and bundle boundary is proven, the single-runtime candidate does not meet the decision
gate.

## Rejected alternative

Reject a single application with `rqb-v1` and `rqb-v2` npm aliases.

Aliases solve package naming but not application ownership. Making the alternative safe
would require version-aware lazy boundaries, separate route and SEO registries, CSS
ordering rules, SSR externalization rules, dependency-graph assertions, and artifact
partitioning inside one runtime. That is more machinery than selecting one isolated
application root per build, and a missed boundary could silently change or ship the wrong
version.

## Consequences

- T011 adds exact target-specific package bindings; it must not add a shared runtime
  facade that chooses a version dynamically.
- T012 creates independent Vite, TypeScript, test, client, SSR, and staging targets plus
  import-boundary checks.
- T013 adds only mechanical prefix/basename helpers. Route availability remains supplied
  by each version.
- T014-T029 copy or create version-owned pages and content. Initially identical content
  is duplicated intentionally so later edits cannot cross versions.
- T030 assembles opaque staged artifacts and owns redirects. It must not deduplicate
  version assets.
- Boundary tests must reject imports from `v1` to `v2`, from `v2` to `v1`, and from
  `shared` to either version-owned tree or package binding.
- CI must inspect both dependency graphs and built artifacts for the opposite version's
  runtime or CSS.

No downstream versioned-site implementation is part of T010. This record is the contract
for that work.

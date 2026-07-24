# T032 pre-infrastructure package baseline

This report records the package state before T032 changed dependencies, source imports, or build configuration. Values are deterministic byte counts from a clean `npm run build`; JavaScript minification used esbuild 0.25.12 with target `es2020`, and gzip used level 9.

## Public package entries

| Entry                         | Raw bytes | Minified bytes | Minified gzip bytes |
| ----------------------------- | --------: | -------------: | ------------------: |
| `dist/index.mjs`              |   194,087 |         80,206 |              23,319 |
| `dist/index.cjs`              |   199,248 |         83,826 |              23,550 |
| `dist/parseQuery.mjs`         |       188 |             92 |                 107 |
| `dist/parseQuery.cjs`         |       293 |            157 |                 156 |
| `dist/formatQuery.mjs`        |       215 |             97 |                 112 |
| `dist/formatQuery.cjs`        |       318 |            165 |                 160 |
| `dist/locale/en-US/index.mjs` |     5,399 |          4,786 |               1,679 |
| `dist/locale/en-US/index.cjs` |     5,479 |          4,850 |               1,722 |

The clean build emitted 16 shared JavaScript chunks across ESM and CJS. JavaScript splitting was enabled and no CSS asset was emitted.

## Consumer bundles

The version-owned package-binding fixtures were rebuilt before the T032 source/configuration changes. Vite output is already minified.

| Consumer        | Minified bytes | Gzip bytes |
| --------------- | -------------: | ---------: |
| V1 client       |      1,389,983 |    314,653 |
| Local V2 client |      1,417,499 |    318,759 |
| V1 SSR          |      2,237,680 |    404,283 |
| Local V2 SSR    |      2,270,557 |    408,104 |

Both V1 and local V2 client builds passed. Both SSR builds passed. The package-binding matrix exercised the root ESM surface through Vite; direct CommonJS root loading and direct ESM parser loading also passed. Direct native-Node loading of the pre-T032 ESM root failed in the existing styled-components output because `styled.div` was not callable. T032 does not change that existing runtime interop behavior.

## Installed production dependencies

The pre-T032 package declared five runtime dependencies:

- `@dnd-kit/core@6.3.1`
- `@dnd-kit/sortable@10.0.0`
- `prismjs@1.30.0`
- `styled-components@6.4.2`
- `tslib@2.8.1`

The resolved non-extraneous production tree contained 21 unique name/version pairs. `clsx` was not a direct or reachable package dependency before T032.

## Packed artifact

`npm pack --dry-run --json --cache .npm-cache` reported:

| Metric          |        Baseline |
| --------------- | --------------: |
| Tarball size    |   262,530 bytes |
| Unpacked size   | 1,526,692 bytes |
| File count      |             142 |
| Package version |          1.33.1 |

The baseline tarball contained ESM, CJS, and public declaration outputs. It contained no stylesheet and exposed no stylesheet subpath.

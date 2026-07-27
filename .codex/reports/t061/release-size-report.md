# T061 release size report

Measurements use esbuild 0.25.12 with target `es2020`, gzip level 9, and npm
pack JSON output, matching the T032 baseline method where applicable.

## Artifact comparison

| Artifact / metric | T032 baseline | T061 result | Change | Budget |
| --- | ---: | ---: | ---: | ---: |
| `dist/index.mjs` minified | 80,206 B | 82,465 B | +2.82% | 85,000 B |
| `dist/index.mjs` min+gzip | 23,319 B | 23,659 B | +1.46% | 25,000 B |
| `dist/index.cjs` minified | 83,826 B | 106,750 B | +27.35% | 110,000 B |
| `dist/index.cjs` min+gzip | 23,550 B | 26,021 B | +10.49% | 27,000 B |
| `dist/styles.css` minified | Not emitted | 39,475 B | New v2 asset | 41,000 B |
| `dist/styles.css` min+gzip | Not emitted | 6,510 B | New v2 asset | 7,000 B |
| Production dependency pairs | 21 | 12 | -42.86% | 14 |
| Tarball | 262,530 B | 264,001 B | +0.56% | 285,000 B |
| Unpacked package | 1,526,692 B | 1,559,076 B | +2.12% | 1,650,000 B |
| Package files | 142 | 143 | +0.70% | 145 |

The production dependency tree is 9 packages smaller after removing the
published `styled-components` dependency. The package now includes one explicit
stylesheet and the 2.0 migration notes. JavaScript and archive changes are
recorded rather than treated as assumed improvements, and every metric remains
inside the checked-in regression budget.

## Release boundary

The checked-in release baseline remains 1.33.1. The release workflow derives
the candidate from the release tag and passes it to the packed-artifact audit;
the intended first v2 tag is `v2.0.0`.

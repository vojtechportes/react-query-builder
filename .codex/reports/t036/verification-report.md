# T036 verification report

## Result

T036 adds the legacy ThemeProvider-to-CSS-variable compatibility bridge for one
deprecation cycle. ThemeProvider remains DOMless, accepts deep partial color
overrides, preserves nearest-provider replacement semantics, and serializes only
explicit color leaves. Builder style remains the final inline override, while
standalone DropZone roots receive the nearest provider compatibility variables.
Existing standalone styled controls continue to resolve partial provider values
through the legacy theme path.

The public `colors` and `IColors` contracts remain intact. `IThemeProps`,
`IThemeProviderProps`, and `ThemeColorOverrides` are exported, and ThemeProvider
color theming is marked deprecated in declarations and v2 documentation.

## Verification

- Focused theme, Builder precedence, standalone Button, and DropZone suites: 34 passed.
- V2 theming documentation and API content suites: 28 passed.
- Task-scoped ESLint: passed.
- Modified code Prettier check: passed.
- Root package build and generated declarations: passed.
- V2 site TypeScript check: passed.
- CSS infrastructure, public stylesheet, packed client, and packed SSR checks: passed.
- Full root Jest run: 102 suites and all 524 executed tests passed; the sole failing
  suite is the previously recorded example alias fixture that cannot resolve the
  local `@vojtechportes/react-query-builder` workspace package.
- Required code-review agent: initial standalone CSS-module bridge gap fixed;
  re-review approved with no findings.

## Residual risk

CSS cascade behavior is covered through inline variable assertions and packed
consumer builds rather than a real-browser computed-style visual test. Browser
visual parity remains part of the later migration verification tasks.

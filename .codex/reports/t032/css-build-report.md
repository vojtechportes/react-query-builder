# T032 CSS build inspection

The final T032 build uses `@tsdown/css@0.21.10` with the experimental options validated against tsdown 0.21.10.

## Configuration contract

- CSS splitting is disabled while JavaScript splitting remains enabled.
- CSS injection is disabled.
- The single asset name is fixed to `dist/styles.css`.
- CSS Module local names use the private `rqb_[hash]` pattern.
- CSS Module exports use `camelCaseOnly` and local scope.
- T035 remains responsible for adding a public `./styles.css` export and token API.

## Output inspection

Two consecutive clean builds produced identical 140-file path/size manifests and the same stylesheet SHA-256:

`C973BD2D306F3FE7766EC1A8D2E0BAF800252297B37EA5625E72DA9631CECB74`

The stylesheet contains one private class (`.rqb_25XGoa`) and the `react-query-builder` layer declaration. It does not change any component styling. The contract class only proves CSS Module scoping and extraction before T033 migrates the first component.

Automated inspection confirmed:

- Exactly one CSS asset exists and it is `dist/styles.css`.
- No emitted ESM or CJS file imports CSS or inserts a style element.
- Direct ESM parser and CommonJS root loading pass in Node. The CSS-bearing ESM root passes the supported Vite client/SSR consumer matrix; native Node ESM root loading retains the pre-existing styled-components interop limitation recorded in the baseline.
- Parser, formatter, and all ten locale dependency graphs in both formats contain neither CSS nor `clsx`.
- Sixteen shared JavaScript chunks remain enabled across ESM and CJS.
- The packed artifact contains 143 files, is 262,770 bytes compressed, and is 1,527,248 bytes unpacked.

## Class composition rules

T032 locks the following rules for later migrations:

- Use `clsx` for state and incoming class composition.
- Preserve incoming `className` values.
- Keep CSS Module hashes private.
- Prefer low-specificity local selectors.
- Model visual state with classes or semantic data attributes.
- Do not forward transient presentation props to DOM elements.

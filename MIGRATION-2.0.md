# Migrating from 1.33.1 to 2.0.0

React Query Builder 2.0 replaces the library's runtime `styled-components`
implementation with an explicit package stylesheet and CSS custom properties.
The component APIs and query data formats remain compatible unless noted below.

## Import the stylesheet

Import the package stylesheet once in the client entry for every application
that renders the built-in components:

```tsx
import '@vojtechportes/react-query-builder/styles.css';
```

The package does not inject styles at runtime. Server-rendered applications
should include the same import in the client and server build graph so the
bundler emits one shared CSS asset.

Adapter styles remain owned by their host packages. Load host styles before the
React Query Builder stylesheet when the adapter documentation requires them.

## Customize CSS tokens

Version 2 exposes inherited `--query-builder-*` custom properties. Set them on
an application wrapper for a shared theme or on one `Builder` for a local
override:

```css
.customer-filter {
  --query-builder-color-primary-default: #3157d5;
  --query-builder-group-padding: 0.75rem;
  --query-builder-radius-md: 0.5rem;
  --query-builder-shadow-group: 0 0.25rem 1rem rgb(0 0 0 / 12%);
}
```

Token precedence is:

1. defaults generated into `styles.css`;
2. inherited CSS custom properties;
3. legacy `ThemeProvider` color values;
4. explicit custom properties in the `Builder` `style` prop.

CSS Module class names are private implementation details. Use the documented
root classes, data attributes, component overrides, and custom properties
instead of generated hashes.

## ThemeProvider is legacy

`ThemeProvider`, `colors`, and their public color types remain available for
the 2.0 compatibility cycle. New integrations should use CSS custom properties.
Existing `ThemeProvider` integrations can migrate incrementally without an
immediate API change.

Only supplied legacy color overrides become inline custom properties. Omitted
values continue to inherit from CSS or fall back to the generated stylesheet
defaults.

## OptionContainer remains polymorphic

The public `OptionContainer` keeps its `as` prop. It supports intrinsic and
custom React elements while forwarding compatible props and refs to the chosen
element. No migration is required for existing polymorphic usages.

## Versioned documentation

- [Version 2 documentation](https://www.react-query-builder.com/v2/documentation)
- [Version 2 API reference](https://www.react-query-builder.com/v2/api)
- [Version 1 documentation](https://www.react-query-builder.com/v1/documentation)
- [Version 1 API reference](https://www.react-query-builder.com/v1/api)

Use the v1 pages when maintaining a 1.33.1 application. All new installations
and migrations should follow the v2 pages.

import { describe, expect, it } from 'vitest';
import { bootstrapCreateComponentsSnippet } from './pages/adapters-bootstrap-documentation-page/constants/bootstrap-create-components-snippet';
import { bootstrapSnippet } from './pages/adapters-bootstrap-documentation-page/constants/bootstrap-snippet';
import { mantineCreateComponentsSnippet } from './pages/adapters-mantine-documentation-page/constants/mantine-create-components-snippet';
import { mantineSnippet } from './pages/adapters-mantine-documentation-page/constants/mantine-snippet';
import { radixCreateComponentsSnippet } from './pages/adapters-radix-documentation-page/constants/radix-create-components-snippet';
import { radixSnippet } from './pages/adapters-radix-documentation-page/constants/radix-snippet';

const stylesheetImport =
  "import '@vojtechportes/react-query-builder/styles.css';";

const snippetModules = import.meta.glob('./pages/**/constants/*snippet.ts', {
  eager: true,
}) as Record<string, Record<string, unknown>>;

const copyReadyBuilderSnippets = Object.entries(snippetModules).flatMap(
  ([path, module]) =>
    Object.entries(module)
      .filter(
        (entry): entry is [string, string] =>
          typeof entry[1] === 'string' && /<Builder(?:\s|\/)/.test(entry[1])
      )
      .map(([name, snippet]) => [`${path}:${name}`, snippet] as const)
);

const hostStylesheetCases = [
  ['Bootstrap', bootstrapSnippet, 'bootstrap-icons/font/bootstrap-icons.css'],
  [
    'Bootstrap merge helper',
    bootstrapCreateComponentsSnippet,
    'bootstrap-icons/font/bootstrap-icons.css',
  ],
  ['Mantine', mantineSnippet, '@mantine/core/styles.css'],
  [
    'Mantine merge helper',
    mantineCreateComponentsSnippet,
    '@mantine/core/styles.css',
  ],
  ['Radix', radixSnippet, '@radix-ui/themes/styles.css'],
  [
    'Radix merge helper',
    radixCreateComponentsSnippet,
    '@radix-ui/themes/styles.css',
  ],
] as const;

describe('v2 documentation stylesheet imports', () => {
  it('discovers Builder examples across v2 documentation snippets', () => {
    expect(copyReadyBuilderSnippets.length).toBeGreaterThan(30);
  });

  it.each(copyReadyBuilderSnippets)(
    'imports the package stylesheet exactly once in %s',
    (_name, snippet) => {
      expect(snippet.split(stylesheetImport)).toHaveLength(2);
    }
  );

  it.each(hostStylesheetCases)(
    'loads the host stylesheet before the package stylesheet in the %s example',
    (_name, snippet, hostStylesheet) => {
      expect(snippet.indexOf(hostStylesheet)).toBeLessThan(
        snippet.indexOf(stylesheetImport)
      );
    }
  );
});

import { describe, expect, it } from 'vitest';
import { bootstrapAdapterSnippet } from './constants/bootstrap-adapter-snippet';
import { bootstrapCreateComponentsSnippet } from './constants/bootstrap-create-components-snippet';
import { mantineAdapterSnippet } from './constants/mantine-adapter-snippet';
import { mantineCreateComponentsSnippet } from './constants/mantine-create-components-snippet';
import { radixAdapterSnippet } from './constants/radix-adapter-snippet';
import { radixCreateComponentsSnippet } from './constants/radix-create-components-snippet';

const stylesheetImport =
  "import '@vojtechportes/react-query-builder/styles.css';";

const snippetModules = import.meta.glob('./constants/*snippet.ts', {
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
  [
    'Bootstrap',
    bootstrapAdapterSnippet,
    'bootstrap-icons/font/bootstrap-icons.css',
  ],
  [
    'Bootstrap merge helper',
    bootstrapCreateComponentsSnippet,
    'bootstrap-icons/font/bootstrap-icons.css',
  ],
  ['Mantine', mantineAdapterSnippet, '@mantine/core/styles.css'],
  [
    'Mantine merge helper',
    mantineCreateComponentsSnippet,
    '@mantine/core/styles.css',
  ],
  ['Radix', radixAdapterSnippet, '@radix-ui/themes/styles.css'],
  [
    'Radix merge helper',
    radixCreateComponentsSnippet,
    '@radix-ui/themes/styles.css',
  ],
] as const;

describe('v2 API stylesheet imports', () => {
  it('discovers Builder examples across v2 API snippets', () => {
    expect(copyReadyBuilderSnippets.length).toBeGreaterThan(10);
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

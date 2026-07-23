import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import { InlineCode } from '../../../../components/docs-primitives';
import type { IDocumentationPage } from '../types/documentation-page';

const installationSnippet = `npm install @vojtechportes/react-query-builder`;

export const installationDocumentationPage: IDocumentationPage = {
  path: '/documentation/installation',
  title: 'Installation',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Package installation details for React Query Builder and React version requirements.',
  searchText:
    'Installation npm install React Query Builder react 18 peer dependencies package import library',
  content: (
    <>
      <p>
        Install the package and use it with React <InlineCode>18+</InlineCode>.
      </p>
      <CodeBlock code={installationSnippet} language="bash" label="npm" />
      <AlertBox title="Peer dependencies" variant="info">
        The package expects compatible <InlineCode>react</InlineCode> and{' '}
        <InlineCode>react-dom</InlineCode> versions in the consuming app. In
        monorepos, it is worth checking that your app and the library resolve to
        the same React instance.
      </AlertBox>
    </>
  ),
};

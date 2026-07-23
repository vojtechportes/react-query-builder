import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import { InlineCode } from '../../../../../../components/docs-primitives';
import { installationSnippet } from '../constants/installation-snippet';

export const InstallationDocumentationContent: React.FC = () => (
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
);

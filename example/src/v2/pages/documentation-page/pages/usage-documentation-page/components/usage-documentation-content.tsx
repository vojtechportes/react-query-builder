import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import {
  InlineCode,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { basicUsageSnippet } from '../constants/basic-usage-snippet';

export const UsageDocumentationContent: React.FC = () => (
  <>
    <p>Basic controlled usage.</p>
    <CodeBlock code={basicUsageSnippet} language="tsx" label="Basic setup" />
    <p>
      The example includes a single rule with{' '}
      <InlineCode>readOnly: true</InlineCode> to show that locking can live
      directly in the query data without changing the rest of the builder
      configuration.
    </p>
    <AlertBox title="Related guide" variant="info">
      Need a rule to compare against another field instead of a literal value?
      Visit{' '}
      <TextLink to="/documentation/field-comparisons">
        Field Comparisons
      </TextLink>
      .
    </AlertBox>
    <AlertBox title="Next step" variant="tip">
      Continue with{' '}
      <TextLink to="/documentation/builder-ref">Builder Ref</TextLink> for
      imperative control,{' '}
      <TextLink to="/documentation/field-comparisons">
        Field Comparisons
      </TextLink>{' '}
      for cross-field rules,{' '}
      <TextLink to="/documentation/builder-behavior">Builder Behavior</TextLink>{' '}
      or <TextLink to="/documentation/text-mode">Text Mode</TextLink> or{' '}
      <TextLink to="/documentation/history">Undo and Redo</TextLink> for editing
      workflows, or{' '}
      <TextLink to="/documentation/dynamic-field-options">
        Dynamic Field Options
      </TextLink>{' '}
      for async select data, or{' '}
      <TextLink to="/documentation/locking-and-read-only">
        Locking and Read-only
      </TextLink>{' '}
      for partial locking.
    </AlertBox>
  </>
);

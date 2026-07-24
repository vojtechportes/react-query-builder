import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import { TextLink } from '../../../../components/docs-primitives';
import { builderSignature } from '../constants/builder-signature';
import { historyConfigSignature } from '../constants/history-config-signature';
import { BuilderPropsApiSection } from './builder-props-api-section';
import { BuilderFieldComparisonsApiSection } from './builder-field-comparisons-api-section';
import { BuilderTextModeApiSection } from './builder-text-mode-api-section';
import { BuilderHistoryApiSection } from './builder-history-api-section';

export const BuilderApiContent: React.FC = () => (
  <>
    <CodeBlock code={builderSignature} language="ts" label="IBuilderProps" />
    <CodeBlock
      code={historyConfigSignature}
      language="ts"
      label="IBuilderHistoryConfig"
    />
    <BuilderPropsApiSection />
    <BuilderFieldComparisonsApiSection />
    <BuilderTextModeApiSection />
    <BuilderHistoryApiSection />
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/usage">Usage</TextLink> and{' '}
      <TextLink to="/documentation/text-mode">Text Mode</TextLink>, and{' '}
      <TextLink to="/documentation/history">Undo and Redo</TextLink>, and{' '}
      <TextLink to="/documentation/builder-ref">Builder Ref</TextLink>.
    </AlertBox>
  </>
);

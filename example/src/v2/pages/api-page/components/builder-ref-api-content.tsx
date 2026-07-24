import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import { TextLink } from '../../../../components/docs-primitives';
import { builderRefSignature } from '../constants/builder-ref-signature';
import { builderRuleDependenciesHookSignature } from '../constants/builder-rule-dependencies-hook-signature';
import { builderRuleOptionsBindingSignature } from '../constants/builder-rule-options-binding-signature';
import { BuilderRefAttachmentApiSection } from './builder-ref-attachment-api-section';
import { BuilderRefReadMethodsApiSection } from './builder-ref-read-methods-api-section';
import { BuilderRefMutationMethodsApiSection } from './builder-ref-mutation-methods-api-section';
import { BuilderRefFieldOptionMethodsApiSection } from './builder-ref-field-option-methods-api-section';
import { BuilderRefRuleOptionMethodsApiSection } from './builder-ref-rule-option-methods-api-section';
import { BuilderRefLockHistoryMethodsApiSection } from './builder-ref-lock-history-methods-api-section';

export const BuilderRefApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={builderRefSignature}
      language="ts"
      label="Builder ref API"
    />
    <CodeBlock
      code={builderRuleDependenciesHookSignature}
      language="ts"
      label="Rule dependencies hook"
    />
    <CodeBlock
      code={builderRuleOptionsBindingSignature}
      language="ts"
      label="Rule options binding"
    />
    <BuilderRefAttachmentApiSection />
    <BuilderRefReadMethodsApiSection />
    <BuilderRefMutationMethodsApiSection />
    <BuilderRefFieldOptionMethodsApiSection />
    <BuilderRefRuleOptionMethodsApiSection />
    <BuilderRefLockHistoryMethodsApiSection />
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/builder-ref">Builder Ref</TextLink>,{' '}
      <TextLink to="/documentation/dynamic-field-options">
        Dynamic Field Options
      </TextLink>
      , <TextLink to="/documentation/history">Undo and Redo</TextLink>, and{' '}
      <TextLink to="/api/builder">Builder</TextLink>.
    </AlertBox>
  </>
);

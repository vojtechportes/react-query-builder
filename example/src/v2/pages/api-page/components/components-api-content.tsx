import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import { TextLink } from '../../../../components/docs-primitives';
import { componentsSignature } from '../constants/components-signature';
import { textModeEditorSignature } from '../constants/text-mode-editor-signature';
import { historyControlsSignature } from '../constants/history-controls-signature';
import { lockToggleSignature } from '../constants/lock-toggle-signature';
import { cloneButtonSignature } from '../constants/clone-button-signature';
import { ComponentOverridesApiSection } from './component-overrides-api-section';
import { ComponentPropContractsApiSection } from './component-prop-contracts-api-section';
import { MonacoSubpackageApiSection } from './monaco-subpackage-api-section';

export const ComponentsApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={componentsSignature}
      language="ts"
      label="Component overrides"
    />
    <CodeBlock
      code={textModeEditorSignature}
      language="ts"
      label="Text mode editor props"
    />
    <CodeBlock
      code={cloneButtonSignature}
      language="ts"
      label="CloneButton props"
    />
    <CodeBlock
      code={lockToggleSignature}
      language="ts"
      label="LockToggle props"
    />
    <CodeBlock
      code={historyControlsSignature}
      language="ts"
      label="HistoryControls props"
    />
    <ComponentOverridesApiSection />
    <ComponentPropContractsApiSection />
    <MonacoSubpackageApiSection />
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/components">Components</TextLink>,{' '}
      <TextLink to="/documentation/text-mode">Text Mode</TextLink>, and{' '}
      <TextLink to="/documentation/adapters">Adapters</TextLink>.
    </AlertBox>
  </>
);

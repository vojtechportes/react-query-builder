import { components as antdComponents } from '@vojtechportes/react-query-builder/antd/v6';
import { components as bootstrapComponents } from '@vojtechportes/react-query-builder/bootstrap/v5';
import { components as fluentUiComponents } from '@vojtechportes/react-query-builder/fluentui/v8';
import { components as mantineComponents } from '@vojtechportes/react-query-builder/mantine/v9';
import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';
import { components as muiComponents } from '@vojtechportes/react-query-builder/mui/v9';
import { components as radixComponents } from '@vojtechportes/react-query-builder/radix/v1';
import type { CustomizationMode } from '../types/customization-mode';

export const getBuilderComponents = (
  customizationMode: CustomizationMode,
  useMonacoTextEditor: boolean
) => {
  let baseComponents;

  if (customizationMode === 'mui') {
    baseComponents = muiComponents;
  } else if (customizationMode === 'antd') {
    baseComponents = antdComponents;
  } else if (customizationMode === 'mantine') {
    baseComponents = mantineComponents;
  } else if (customizationMode === 'fluentui') {
    baseComponents = fluentUiComponents;
  } else if (customizationMode === 'bootstrap') {
    baseComponents = bootstrapComponents;
  } else if (customizationMode === 'radix') {
    baseComponents = radixComponents;
  }

  return useMonacoTextEditor
    ? createMonacoComponents(baseComponents || {})
    : baseComponents;
};

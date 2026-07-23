import * as React from 'react';
import {
  type DenormalizedQuery,
  type IColors,
} from '@vojtechportes/react-query-builder';
import { defaultDemoPlaygroundSettings } from '../constants/default-demo-playground-settings';
import { defaultTheme } from '../constants/default-theme';
import type { CustomizationMode } from '../types/customization-mode';
import type { IDemoPlaygroundSettings } from '../types/demo-playground-settings';
import type { OutputFormat } from '../types/output-format';

export const useDemoPlaygroundState = (initialData: DenormalizedQuery) => {
  const [data, setData] = React.useState<DenormalizedQuery>(initialData);
  const [outputFormat, setOutputFormat] =
    React.useState<OutputFormat>('Native');
  const [settings, setSettings] = React.useState<IDemoPlaygroundSettings>(
    defaultDemoPlaygroundSettings
  );
  const [customizationMode, setCustomizationMode] =
    React.useState<CustomizationMode>('default');
  const [themeColors, setThemeColors] = React.useState<IColors>(
    defaultTheme.colors
  );
  const [showSourceCode, setShowSourceCode] = React.useState(false);

  const updateSetting = React.useCallback(
    <K extends keyof IDemoPlaygroundSettings>(
      key: K,
      value: IDemoPlaygroundSettings[K]
    ) => {
      setSettings((currentSettings) => ({
        ...currentSettings,
        [key]: value,
      }));
    },
    []
  );

  React.useEffect(() => {
    if (!settings.singleRootGroup && settings.textMode) {
      updateSetting('textMode', false);
    }
  }, [settings.singleRootGroup, settings.textMode, updateSetting]);

  return {
    customizationMode,
    data,
    outputFormat,
    settings,
    showSourceCode,
    themeColors,
    setCustomizationMode,
    setData,
    setOutputFormat,
    setShowSourceCode,
    setThemeColors,
    updateSetting,
  };
};

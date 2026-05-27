import { IBuilderTextModeConfig } from '../types/builder-text-mode-config';
import { DEFAULT_TEXT_MODE_FORMAT } from '../constants/default-text-mode-format';

export const resolveBuilderTextModeConfig = (
  textMode: boolean | IBuilderTextModeConfig | undefined
): IBuilderTextModeConfig | null => {
  if (!textMode) {
    return null;
  }

  if (textMode === true) {
    return {
      defaultMode: 'builder',
      format: DEFAULT_TEXT_MODE_FORMAT,
    };
  }

  return {
    defaultMode: textMode.defaultMode ?? 'builder',
    format: textMode.format ?? DEFAULT_TEXT_MODE_FORMAT,
  };
};

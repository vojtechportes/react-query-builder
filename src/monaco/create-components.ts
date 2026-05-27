import { IBuilderComponentsProps } from '../builder';
import { MonacoTextModeEditor } from './components/monaco-text-mode-editor';

export const createMonacoComponents = (
  base: IBuilderComponentsProps,
  overrides?: IBuilderComponentsProps
): IBuilderComponentsProps => ({
  ...base,
  TextModeEditor: MonacoTextModeEditor,
  ...overrides,
  form: {
    ...base.form,
    ...overrides?.form,
  },
});

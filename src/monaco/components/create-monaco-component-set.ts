import { IBuilderComponentsProps } from '../../builder';
import { MonacoTextModeEditor } from './monaco-text-mode-editor';

export const createMonacoComponentSet = (): IBuilderComponentsProps => ({
  TextModeEditor: MonacoTextModeEditor,
});

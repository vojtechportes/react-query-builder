import type * as Monaco from 'monaco-editor';
import { ITextModeDiagnostic } from '../../builder/text-mode/types/text-mode-diagnostic';
import { createMonacoRangeFromOffsets } from './create-monaco-range-from-offsets';

export const createMonacoDiagnosticDecoration = (
  monaco: typeof Monaco,
  model: Monaco.editor.ITextModel,
  diagnostic: ITextModeDiagnostic
): Monaco.editor.IModelDeltaDecoration => ({
  range: createMonacoRangeFromOffsets(
    monaco,
    model,
    diagnostic.end > diagnostic.start
      ? diagnostic.start
      : Math.max(0, diagnostic.start - 1),
    diagnostic.end > diagnostic.start
      ? Math.max(diagnostic.start, diagnostic.end)
      : Math.max(diagnostic.start, 1)
  ),
  options:
    diagnostic.end > diagnostic.start
      ? {
          inlineClassName: 'rqb-monaco-text-mode-diagnostic',
        }
      : {
          inlineClassName: 'rqb-monaco-text-mode-marker-anchor',
        },
});

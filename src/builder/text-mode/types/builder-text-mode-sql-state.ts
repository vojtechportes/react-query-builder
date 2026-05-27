import { ITextModeProtectedRange } from './text-mode-protected-range';

export interface IBuilderTextModeSqlState {
  value: string;
  protectedRanges: ITextModeProtectedRange[];
}

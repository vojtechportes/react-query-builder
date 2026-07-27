export const textModeConfigSignature = `export interface IBuilderTextModeConfig {
  format?: 'SQL';
  defaultMode?: BuilderDefaultMode;
}

export type BuilderDefaultMode = 'builder' | 'text';`;

import { vi } from 'vitest';

const runtimeWarningPattern =
  /hydration|hydrated|did not match|server html|classname|runtime style|styled-components/i;

export const captureRuntimeWarnings = (): string[] => {
  const warnings: string[] = [];
  const captureWarning = (...messages: unknown[]) => {
    const warning = messages.map(String).join(' ');

    if (runtimeWarningPattern.test(warning)) {
      warnings.push(warning);
    }
  };

  vi.spyOn(console, 'error').mockImplementation(captureWarning);
  vi.spyOn(console, 'warn').mockImplementation(captureWarning);

  return warnings;
};

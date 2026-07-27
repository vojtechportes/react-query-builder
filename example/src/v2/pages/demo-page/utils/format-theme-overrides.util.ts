import type { IBuilderStyle } from '@vojtechportes/react-query-builder';

export const formatThemeOverrides = (themeOverrides: IBuilderStyle): string => {
  const lines = Object.entries(themeOverrides).map(
    ([name, value]) => `  ${JSON.stringify(name)}: ${JSON.stringify(value)},`
  );

  return ['{', ...lines, '}'].join('\n');
};

import type { IColors } from '@vojtechportes/react-query-builder';

export const formatThemeOverrides = (
  themeOverrides: Partial<IColors>
): string => {
  const lines = Object.entries(themeOverrides).flatMap(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedLines = Object.entries(value).map(
        ([nestedKey, nestedValue]) =>
          `      ${nestedKey}: ${JSON.stringify(nestedValue)},`
      );

      return [
        `    ${key}: {`,
        `      ...colors.${key},`,
        ...nestedLines,
        '    },',
      ];
    }

    return [`    ${key}: ${JSON.stringify(value)},`];
  });

  return ['{', '    ...colors,', ...lines, '  }'].join('\n');
};

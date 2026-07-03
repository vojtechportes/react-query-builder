import type { IColors } from '../../../../../src/constants/colors';

export const formatThemeOverrides = (themeOverrides: Partial<IColors>): string => {
  const lines = Object.entries(themeOverrides).flatMap(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedLines = Object.entries(value).map(
        ([nestedKey, nestedValue]) => `      ${nestedKey}: ${JSON.stringify(nestedValue)},`
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


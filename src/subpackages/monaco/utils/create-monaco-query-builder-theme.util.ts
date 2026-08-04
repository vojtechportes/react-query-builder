import type { editor } from 'monaco-editor';
import { colors } from '../../../builder/theme/styles/colors';
import { darkColors } from '../../../builder/theme/styles/dark-colors';

export const createMonacoQueryBuilderTheme = (
  colorScheme: 'light' | 'dark'
): { data: editor.IStandaloneThemeData; name: string } => {
  const palette = colorScheme === 'dark' ? darkColors : colors;
  const data: editor.IStandaloneThemeData = {
    base: colorScheme === 'dark' ? 'vs-dark' : 'vs',
    inherit: true,
    rules: [
      { token: '', foreground: palette.grey[800].slice(1) },
      {
        token: 'keyword',
        foreground: palette.info.primary.slice(1),
        fontStyle: 'bold',
      },
      {
        token: 'operator',
        foreground: palette.grey[700].slice(1),
        fontStyle: 'bold',
      },
      { token: 'delimiter', foreground: palette.grey[700].slice(1) },
      {
        token: 'delimiter.parenthesis',
        foreground: palette.grey[700].slice(1),
      },
      { token: 'string', foreground: palette.success.primary.slice(1) },
      { token: 'number', foreground: palette.warning.primary.slice(1) },
      {
        token: 'predefined',
        foreground: palette.primary.default.slice(1),
        fontStyle: 'bold',
      },
      {
        token: 'identifier',
        foreground: palette.grey[900].slice(1),
        fontStyle: 'bold',
      },
      {
        token: 'keyword.sql',
        foreground: palette.info.primary.slice(1),
        fontStyle: 'bold',
      },
      {
        token: 'operator.sql',
        foreground: palette.grey[700].slice(1),
        fontStyle: 'bold',
      },
      { token: 'delimiter.sql', foreground: palette.grey[700].slice(1) },
      {
        token: 'delimiter.parenthesis.sql',
        foreground: palette.grey[700].slice(1),
      },
      { token: 'string.sql', foreground: palette.success.primary.slice(1) },
      { token: 'number.sql', foreground: palette.warning.primary.slice(1) },
      {
        token: 'predefined.sql',
        foreground: palette.primary.default.slice(1),
        fontStyle: 'bold',
      },
      {
        token: 'identifier.sql',
        foreground: palette.grey[900].slice(1),
        fontStyle: 'bold',
      },
    ],
    colors: {
      'editor.background': palette.white,
      'editor.foreground': palette.grey[800],
      'editorBracketHighlight.foreground1': palette.grey[700],
      'editorBracketHighlight.foreground2': palette.grey[700],
      'editorBracketHighlight.foreground3': palette.grey[700],
      'editorBracketHighlight.foreground4': palette.grey[700],
      'editorBracketHighlight.foreground5': palette.grey[700],
      'editorBracketHighlight.foreground6': palette.grey[700],
      'editorBracketHighlight.unexpectedBracketForeground':
        palette.error.primary,
    },
  };

  return {
    data,
    name: `rqb-query-builder-${colorScheme}`,
  };
};

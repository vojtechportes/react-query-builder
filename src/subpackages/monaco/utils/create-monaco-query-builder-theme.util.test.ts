import { colors } from '../../../builder/theme/styles/colors';
import { darkColors } from '../../../builder/theme/styles/dark-colors';
import { createMonacoQueryBuilderTheme } from './create-monaco-query-builder-theme.util';

describe('#utils/createMonacoQueryBuilderTheme', () => {
  it.each([
    ['light', colors, 'vs'],
    ['dark', darkColors, 'vs-dark'],
  ] as const)(
    'maps the %s Monaco SQL theme to the built-in palette roles',
    (colorScheme, palette, base) => {
      const theme = createMonacoQueryBuilderTheme(colorScheme);
      const rules = Object.fromEntries(
        theme.data.rules.map((rule) => [rule.token, rule])
      );

      expect(theme.name).toBe(`rqb-query-builder-${colorScheme}`);
      expect(theme.data.base).toBe(base);
      expect(theme.data.inherit).toBe(true);
      expect(theme.data.colors).toMatchObject({
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
      });
      expect(rules['']).toMatchObject({
        foreground: palette.grey[800].slice(1),
      });
      expect(rules.keyword).toMatchObject({
        foreground: palette.info.primary.slice(1),
        fontStyle: 'bold',
      });
      expect(rules.operator).toMatchObject({
        foreground: palette.grey[700].slice(1),
        fontStyle: 'bold',
      });
      expect(rules.delimiter).toMatchObject({
        foreground: palette.grey[700].slice(1),
      });
      expect(rules['delimiter.parenthesis']).toEqual({
        ...rules.delimiter,
        token: 'delimiter.parenthesis',
      });
      expect(rules.string).toMatchObject({
        foreground: palette.success.primary.slice(1),
      });
      expect(rules.number).toMatchObject({
        foreground: palette.warning.primary.slice(1),
      });
      expect(rules.predefined).toMatchObject({
        foreground: palette.primary.default.slice(1),
        fontStyle: 'bold',
      });
      expect(rules.identifier).toMatchObject({
        foreground: palette.grey[900].slice(1),
        fontStyle: 'bold',
      });
      expect(rules['keyword.sql']).toEqual({
        ...rules.keyword,
        token: 'keyword.sql',
      });
      expect(rules['operator.sql']).toEqual({
        ...rules.operator,
        token: 'operator.sql',
      });
      expect(rules['delimiter.sql']).toEqual({
        ...rules.delimiter,
        token: 'delimiter.sql',
      });
      expect(rules['delimiter.parenthesis.sql']).toEqual({
        ...rules.delimiter,
        token: 'delimiter.parenthesis.sql',
      });
      expect(rules['string.sql']).toEqual({
        ...rules.string,
        token: 'string.sql',
      });
      expect(rules['number.sql']).toEqual({
        ...rules.number,
        token: 'number.sql',
      });
      expect(rules['predefined.sql']).toEqual({
        ...rules.predefined,
        token: 'predefined.sql',
      });
      expect(rules['identifier.sql']).toEqual({
        ...rules.identifier,
        token: 'identifier.sql',
      });
    }
  );
});

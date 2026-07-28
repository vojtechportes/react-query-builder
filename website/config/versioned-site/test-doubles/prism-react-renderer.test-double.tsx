import type {
  CSSProperties,
  HighlightProps,
  PrismTheme,
  RenderProps,
  Token,
} from 'prism-react-renderer';
import type { ReactElement } from 'react';
import {
  Prism,
  normalizeTokens,
} from 'versioned-test-prism-react-renderer-runtime';

export const Highlight = ({
  children,
  code,
  language: rawLanguage,
  theme = { plain: {}, styles: [] },
}: HighlightProps): ReactElement => {
  const language = rawLanguage.toLowerCase();
  const themeDictionary = theme.styles.reduce<Record<string, CSSProperties>>(
    (dictionary, entry) => {
      if (entry.languages && !entry.languages.includes(language)) {
        return dictionary;
      }

      for (const type of entry.types) {
        dictionary[type] = { ...dictionary[type], ...entry.style };
      }

      return dictionary;
    },
    {}
  );
  themeDictionary.root = theme.plain;
  themeDictionary.plain = { ...theme.plain, backgroundColor: undefined };

  const grammar = Prism.languages[language];
  const prismConfig = { code, grammar, language, tokens: [] as unknown[] };

  if (grammar) {
    Prism.hooks.run('before-tokenize', prismConfig);
    prismConfig.tokens = Prism.tokenize(code, grammar);
    Prism.hooks.run('after-tokenize', prismConfig);
  }

  const tokens = normalizeTokens(grammar ? prismConfig.tokens : [code]);

  return children({
    tokens,
    className: `prism-code language-${language}`,
    style: themeDictionary.root,
    getLineProps: ({ className, style, line: _line, ...rest }) => ({
      ...rest,
      className: ['token-line', className].filter(Boolean).join(' '),
      style: { ...themeDictionary.plain, ...style },
    }),
    getTokenProps: ({ className, style, token, ...rest }) => {
      const tokenStyle =
        token.types.length === 1 && token.types[0] === 'plain'
          ? token.empty
            ? { display: 'inline-block' }
            : undefined
          : Object.assign(
              token.empty ? { display: 'inline-block' } : {},
              ...token.types.map((type: string) => themeDictionary[type])
            );

      return {
        ...rest,
        className: ['token', ...token.types, className]
          .filter(Boolean)
          .join(' '),
        children: token.content,
        style: { ...tokenStyle, ...style },
      };
    },
  } satisfies RenderProps);
};

export type { PrismTheme };

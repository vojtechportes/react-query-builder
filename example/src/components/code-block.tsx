import * as React from 'react';
import { Highlight, type PrismTheme } from 'prism-react-renderer';
import styled from 'styled-components';
import { siteTheme } from '../constants/site-theme';

const theme: PrismTheme = {
  plain: {
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
  },
  styles: [
    { types: ['comment'], style: { color: '#94a3b8' } },
    { types: ['string'], style: { color: '#86efac' } },
    { types: ['keyword', 'operator'], style: { color: siteTheme.primaryLight } },
    { types: ['number', 'boolean'], style: { color: '#fca5a5' } },
    {
      types: ['function', 'function-variable', 'class-name', 'maybe-class-name'],
      style: { color: '#fcd34d' },
    },
    { types: ['tag'], style: { color: '#f9a8d4' } },
    { types: ['attr-name'], style: { color: '#7dd3fc' } },
    { types: ['imports'], style: { color: '#c4b5fd' } },
    { types: ['script', 'script-punctuation'], style: { color: '#cbd5e1' } },
    { types: ['punctuation'], style: { color: '#cbd5e1' } },
  ],
};

const Wrapper = styled.div`
  min-width: 0;
  max-width: 100%;
  margin-bottom: 1rem;
  overflow: hidden;
  border: 1px solid #1e293b;
  border-radius: 16px;
  background: #0f172a;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.18);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  color: #cbd5e1;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Pre = styled.pre`
  max-width: 100%;
  margin: 0;
  padding: 1rem;
  overflow: auto;
  font-size: 0.86rem;
  line-height: 1.75;
`;

export interface ICodeBlockProps {
  code: string;
  language?: string;
  label?: string;
}

export const CodeBlock: React.FC<ICodeBlockProps> = ({
  code,
  language = 'tsx',
  label,
}) => (
  <Wrapper>
    <Header>
      <span>{label ?? language}</span>
    </Header>
    <Highlight theme={theme} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          {tokens.map((line, index) => (
            <div key={index} {...getLineProps({ line })}>
              {line.map((token, tokenIndex) => (
                <span
                  key={tokenIndex}
                  {...getTokenProps({ token })}
                />
              ))}
            </div>
          ))}
        </Pre>
      )}
    </Highlight>
  </Wrapper>
);

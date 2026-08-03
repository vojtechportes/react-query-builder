import * as React from 'react';
import styled from 'styled-components';
import { Button } from '../../../../components/button';
import { Typography } from '../../../../components/typography/typography';

export interface IHomeShowcaseProps {
  actionLabel: string;
  children: React.ReactNode;
  description: string;
  reverse?: boolean;
  title: string;
  to: string;
  tone?: 'dark' | 'light';
}

const Root = styled.article<{
  $reverse: boolean;
  $tone: 'dark' | 'light';
}>`
  display: grid;
  grid-template-columns: ${({ $reverse }) =>
    $reverse
      ? 'minmax(0, 1.25fr) minmax(0, 0.75fr)'
      : 'minmax(0, 0.75fr) minmax(0, 1.25fr)'};
  gap: 2rem;
  align-items: start;
  padding: 2rem;
  overflow: hidden;
  border: 1px solid ${({ $tone }) => ($tone === 'dark' ? '#0f172a' : '#dbe4f0')};
  border-radius: 16px;
  background: ${({ $tone }) => ($tone === 'dark' ? '#0f172a' : '#fff')};

  .home-showcase-copy {
    order: ${({ $reverse }) => ($reverse ? 2 : 1)};
  }

  .home-showcase-preview {
    min-width: 0;
    order: ${({ $reverse }) => ($reverse ? 1 : 2)};
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;

    .home-showcase-copy,
    .home-showcase-preview {
      order: initial;
    }
  }
`;

const ShowcaseTitle = styled(Typography)`
  font-size: clamp(1.8rem, 3vw, 2.1rem);
  letter-spacing: -0.03em;
`;

const ShowcaseDescription = styled(Typography)<{ $tone: 'dark' | 'light' }>`
  color: ${({ $tone }) => ($tone === 'dark' ? '#cbd5e1' : '#475569')};
`;

export const HomeShowcase: React.FC<IHomeShowcaseProps> = ({
  actionLabel,
  children,
  description,
  reverse = false,
  title,
  to,
  tone = 'light',
}) => (
  <Root $reverse={reverse} $tone={tone}>
    <div className="home-showcase-copy">
      <ShowcaseTitle
        color={tone === 'dark' ? 'light' : 'dark'}
        variant="h3"
        mb={0.8}
      >
        {title}
      </ShowcaseTitle>
      <ShowcaseDescription $tone={tone} mb={1}>
        {description}
      </ShowcaseDescription>
      <Button
        color={tone === 'dark' ? 'white' : 'primary'}
        component="a"
        size="small"
        to={to}
        variant="outlined"
      >
        {actionLabel}
      </Button>
    </div>
    <div className="home-showcase-preview">{children}</div>
  </Root>
);

import * as React from 'react';
import styled from 'styled-components';
import { Button } from '../../../../components/button';
import { Typography } from '../../../../components/typography/typography';
import { siteTheme } from '../../../../constants/site-theme';

const Root = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(17rem, 0.9fr);
  gap: 2rem;
  padding: 3rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background:
    radial-gradient(
      circle at top right,
      ${siteTheme.heroGlow},
      transparent 32%
    ),
    linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.08);

  .home-hero-content {
    display: grid;
    gap: 1.5rem;
  }

  .home-hero-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.85rem;
  }

  aside {
    min-width: 0;
    align-self: start;
    padding: 1.25rem;
    border: 1px solid #dbe4f0;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.88);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }

  pre {
    min-width: 0;
    margin: 0;
    padding: 1rem 1.1rem;
    overflow-x: auto;
    border: 1px solid #dbe4f0;
    border-radius: 16px;
    background: #f8fafc;
    color: #0f172a;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  code {
    font-family:
      'Fira Code', 'Roboto Mono', 'SFMono-Regular', Consolas, 'Liberation Mono',
      Menlo, monospace;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 860px) {
    padding: 2rem;
  }

  @media (max-width: 540px) {
    padding: 1.25rem;
  }
`;

const HomepageTitle = styled(Typography)`
  max-width: 12ch;
  margin: 0;
  font-size: clamp(2.6rem, 5vw, 4.6rem);
  line-height: 1;
  letter-spacing: -0.05em;
`;

const HeroLead = styled(Typography)`
  max-width: 64ch;
`;

export const HomeHero: React.FC = () => (
  <Root>
    <div className="home-hero-content">
      <HomepageTitle variant="h1">React Query Builder</HomepageTitle>
      <HeroLead variant="body1" color="muted">
        An open source React component for building user friendly queries and
        filters. Let users edit rules visually or in SQL text mode, validate
        input, and convert queries to SQL, MongoDB, Prisma, and other supported
        formats.
      </HeroLead>
      <div className="home-hero-actions">
        <Button component="a" to="/demo">
          Try the live demo
        </Button>
        <Button component="a" to="/documentation/usage" variant="outlined">
          Get started
        </Button>
      </div>
    </div>
    <aside aria-labelledby="home-install-title">
      <Typography
        id="home-install-title"
        variant="h2"
        as="body2"
        fontWeight={700}
        mb={0.75}
      >
        Install
      </Typography>
      <Typography color="muted" mb={1}>
        Add the package and continue with the setup guide in the documentation.
      </Typography>
      <pre>
        <code>npm install @vojtechportes/react-query-builder</code>
      </pre>
    </aside>
  </Root>
);

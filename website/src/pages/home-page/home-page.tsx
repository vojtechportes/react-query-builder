import * as React from 'react';
import styled from 'styled-components';
import { Button } from '../../components/button';
import { Typography } from '../../components/typography/typography';
import { siteTheme } from '../../constants/site-theme';
import { findSeoPage } from '../../constants/seo-pages';
import { usePageMetadata } from '../../hooks/use-page-metadata';

const Hero = styled.section`
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

  @media (max-width: 860px) {
    padding: 2rem;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 540px) {
    padding: 1.25rem;
  }
`;

const HeroContent = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const HomepageTitle = styled(Typography)`
  max-width: 12ch;
  margin: 0;
  font-size: clamp(2.6rem, 5vw, 4.6rem);
  line-height: 1;
  letter-spacing: -0.05em;
`;

const Lead = styled(Typography)`
  max-width: 62ch;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
`;

const InstallPanel = styled.aside`
  min-width: 0;
  align-self: start;
  padding: 1.25rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
`;

const InstallCode = styled.pre`
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
`;

const Code = styled.code`
  font-family:
    'Fira Code', 'Roboto Mono', 'SFMono-Regular', Consolas, 'Liberation Mono',
    Menlo, monospace;
`;

const seoPage = findSeoPage('/');

export const HomePage: React.FC = () => {
  usePageMetadata(seoPage.title, seoPage.description, seoPage);

  return (
    <Hero>
      <HeroContent>
        <HomepageTitle variant="h1">React Query Builder</HomepageTitle>
        <Lead variant="body1" color="muted">
          Highly configurable TypeScript library for visual and text-based query
          editing, built-in validation, theming, full UI customization, and
          parsing and formatting across supported query syntaxes.
        </Lead>
        <Actions>
          <Button component="a" to="/documentation">
            Documentation
          </Button>
          <Button component="a" to="/demo" variant="outlined">
            Demo
          </Button>
        </Actions>
      </HeroContent>
      <InstallPanel>
        <Typography variant="h2" as="body2" fontWeight={700} mb={0.75}>
          Install
        </Typography>
        <Typography color="muted" mb={1}>
          Add the package and continue with the setup guide in the
          documentation.
        </Typography>
        <InstallCode>
          <Code>npm install @vojtechportes/react-query-builder</Code>
        </InstallCode>
      </InstallPanel>
    </Hero>
  );
};

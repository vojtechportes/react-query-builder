import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { siteTheme } from '../../../constants/site-theme';
import { findSeoPage } from '../../../constants/seo-pages';
import { usePageMetadata } from '../../../hooks/use-page-metadata';
import { createV2PageMetadataOptions } from '../../app/utils/create-v2-page-metadata-options.util';
import { findV2RouteRecord } from '../../app/utils/find-v2-route-record.util';

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

const Heading = styled.h1`
  margin: 0;
  max-width: 10ch;
  font-size: clamp(2.6rem, 5vw, 4.6rem);
  line-height: 1;
  letter-spacing: -0.05em;
`;

const Lead = styled.p`
  max-width: 62ch;
  margin: 0;
  color: #334155;
  font-size: 1.08rem;
  line-height: 1.8;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
`;

const ActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.3rem;
  padding: 0.95rem 1.2rem;
  border-radius: 16px;
  font-weight: 700;
  line-height: 1;
`;

const PrimaryLink = styled(ActionLink)`
  background: ${siteTheme.primary};
  color: #fff;
`;

const SecondaryLink = styled(ActionLink)`
  border: 1px solid #dbe4f0;
  background: #fff;
  color: #0f172a;
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

const InstallTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #0f172a;
`;

const InstallCopy = styled.p`
  margin: 0 0 1rem;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.6;
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
const route = findV2RouteRecord('/');

export const HomePage: React.FC = () => {
  usePageMetadata(
    seoPage.title,
    seoPage.description,
    createV2PageMetadataOptions(seoPage, route)
  );

  return (
    <Hero>
      <HeroContent>
        <Heading>React Query Builder</Heading>
        <Lead>
          Highly configurable TypeScript library for visual and text-based query
          editing, built-in validation, theming, full UI customization, and
          parsing and formatting across supported query syntaxes.
        </Lead>
        <Actions>
          <PrimaryLink to="/documentation">Documentation</PrimaryLink>
          <SecondaryLink to="/demo">Demo</SecondaryLink>
        </Actions>
      </HeroContent>
      <InstallPanel>
        <InstallTitle>Install</InstallTitle>
        <InstallCopy>
          Add the package and continue with the setup guide in the
          documentation.
        </InstallCopy>
        <InstallCode>
          <Code>npm install @vojtechportes/react-query-builder</Code>
        </InstallCode>
      </InstallPanel>
    </Hero>
  );
};

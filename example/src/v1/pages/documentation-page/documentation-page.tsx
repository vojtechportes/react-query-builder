import * as React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ClientOnly } from '../../../components/client-only';
import { ContentArticle } from '../../../components/content-article';
import { DocumentationSidebar } from '../../../components/documentation-sidebar';
import { RelatedRecipes } from '../../../components/related-recipes';
import { findSeoPage } from '../../../constants/seo-pages';
import { usePageMetadata } from '../../../hooks/use-page-metadata';
import { documentationGroups } from './constants/documentation-groups';
import { documentationPages } from './constants/documentation-pages';
import { relatedRecipesByPath } from './constants/related-recipes-by-path';
import { findDocumentationPage } from './utils/find-documentation-page.util';
import { loadParsingSandbox } from './utils/load-parsing-sandbox.util';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 1.5rem;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const SectionLabel = styled.span`
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
`;

const Title = styled.h1`
  margin: 0;
  margin-bottom: 1rem;
  font-size: clamp(2rem, 4vw, 3rem);
`;

const Summary = styled.p`
  font-size: 1.05rem;
  margin-top: 0.55rem;
`;

export const DocumentationPage: React.FC = () => {
  const location = useLocation();
  const page = findDocumentationPage(location.pathname);
  const seoPage = findSeoPage(page.path);

  usePageMetadata(seoPage.title, seoPage.description, seoPage);

  return (
    <Layout>
      <DocumentationSidebar
        title="Documentation"
        overviewPage={documentationPages[0]}
        groups={documentationGroups}
      />
      <ContentArticle>
        <SectionLabel>{page.sectionTitle}</SectionLabel>
        <Title>{page.title}</Title>
        {page.summary ? <Summary>{page.summary}</Summary> : null}
        {page.content}
        <RelatedRecipes links={relatedRecipesByPath[page.path]} />
        {page.path === '/documentation/parsing-and-formatting' ? (
          <ClientOnly
            loader={loadParsingSandbox}
            label="Loading the interactive parsing sandbox..."
            minHeight="20rem"
          />
        ) : null}
      </ContentArticle>
    </Layout>
  );
};

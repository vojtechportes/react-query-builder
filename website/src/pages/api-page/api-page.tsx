import * as React from 'react';
import styled from 'styled-components';
import { Typography } from '../../components/typography/typography';
import { useLocation } from 'react-router';
import { ContentArticle } from '../../components/content-article';
import { DocumentationSidebar } from '../../components/documentation-sidebar';
import { RelatedRecipes } from '../../components/related-recipes';
import { relatedRecipesByPath } from '../../constants/related-recipes-by-path';
import { findSeoPage } from '../../constants/seo-pages';
import { usePageMetadata } from '../../hooks/use-page-metadata';
import { apiGroups, apiOverviewPage, findApiPage } from './pages/api-content';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 1.5rem;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const SectionLabel = styled(Typography)`
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
`;

export const ApiPage: React.FC = () => {
  const location = useLocation();
  const page = findApiPage(location.pathname);
  const seoPage = findSeoPage(page.path);
  usePageMetadata(seoPage.title, seoPage.description, seoPage);

  return (
    <Layout>
      <DocumentationSidebar
        title="API"
        overviewPage={apiOverviewPage}
        groups={apiGroups}
      />
      <ContentArticle>
        <SectionLabel component="span" color="muted">
          {page.sectionTitle}
        </SectionLabel>
        <Typography variant="h1" fontSize="clamp(2rem, 4vw, 3rem)" mb={1}>
          {page.title}
        </Typography>
        {page.summary ? (
          <Typography variant="body1" color="muted" mt={0.55}>
            {page.summary}
          </Typography>
        ) : null}
        {page.content}
        <RelatedRecipes links={relatedRecipesByPath[page.path]} />
      </ContentArticle>
    </Layout>
  );
};

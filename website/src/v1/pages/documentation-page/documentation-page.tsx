import * as React from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { Typography } from '../../../components/typography/typography';
import { ClientOnly } from '../../../components/client-only';
import { ContentArticle } from '../../../components/content-article';
import { DocumentationSidebar } from '../../../components/documentation-sidebar';
import { RelatedRecipes } from '../../../components/related-recipes';
import { useV1PageMetadata } from '../../seo/hooks/use-v1-page-metadata';
import { createV1PageMetadataOptions } from '../../seo/utils/create-v1-page-metadata-options.util';
import { findV1SeoPage } from '../../seo/utils/find-v1-seo-page.util';
import { findV1RouteRecord } from '../../app/utils/find-v1-route-record.util';
import { v1DocumentationSidebar } from '../../navigation/constants/v1-documentation-sidebar';
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

const SectionLabel = styled(Typography)`
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
`;

export const DocumentationPage: React.FC = () => {
  const location = useLocation();
  const page = findDocumentationPage(location.pathname);
  const route = findV1RouteRecord(page.path);
  const seoPage = findV1SeoPage(page.path);

  useV1PageMetadata(
    seoPage.title,
    seoPage.description,
    createV1PageMetadataOptions(seoPage, route)
  );

  return (
    <Layout>
      <DocumentationSidebar {...v1DocumentationSidebar} />
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
        <RelatedRecipes links={route.relatedLinks} />
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

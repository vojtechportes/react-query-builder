import * as React from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { Typography } from '../../../components/typography/typography';
import { ContentArticle } from '../../../components/content-article';
import { DocumentationSidebar } from '../../../components/documentation-sidebar';
import { RelatedRecipes } from '../../../components/related-recipes';
import { useV2PageMetadata } from '../../seo/hooks/use-v2-page-metadata';
import { createV2PageMetadataOptions } from '../../seo/utils/create-v2-page-metadata-options.util';
import { findV2SeoPage } from '../../seo/utils/find-v2-seo-page.util';
import { findV2RouteRecord } from '../../app/utils/find-v2-route-record.util';
import { v2ApiSidebar } from '../../navigation/constants/v2-api-sidebar';
import { findApiPage } from './utils/find-api-page.util';

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
  const route = findV2RouteRecord(page.path);
  const seoPage = findV2SeoPage(page.path);

  useV2PageMetadata(
    seoPage.title,
    seoPage.description,
    createV2PageMetadataOptions(seoPage, route)
  );

  return (
    <Layout>
      <DocumentationSidebar {...v2ApiSidebar} />
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
      </ContentArticle>
    </Layout>
  );
};

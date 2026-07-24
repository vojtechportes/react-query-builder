import * as React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ContentArticle } from '../../../components/content-article';
import { DocumentationSidebar } from '../../../components/documentation-sidebar';
import { RelatedRecipes } from '../../../components/related-recipes';
import { findSeoPage } from '../../../constants/seo-pages';
import { usePageMetadata } from '../../../hooks/use-page-metadata';
import { createV1PageMetadataOptions } from '../../app/utils/create-v1-page-metadata-options.util';
import { findV1RouteRecord } from '../../app/utils/find-v1-route-record.util';
import { v1ApiSidebar } from '../../navigation/constants/v1-api-sidebar';
import { findApiPage } from './utils/find-api-page.util';

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

export const ApiPage: React.FC = () => {
  const location = useLocation();
  const page = findApiPage(location.pathname);
  const route = findV1RouteRecord(page.path);
  const seoPage = findSeoPage(page.path);

  usePageMetadata(
    seoPage.title,
    seoPage.description,
    createV1PageMetadataOptions(seoPage, route)
  );

  return (
    <Layout>
      <DocumentationSidebar {...v1ApiSidebar} />
      <ContentArticle>
        <SectionLabel>{page.sectionTitle}</SectionLabel>
        <Title>{page.title}</Title>
        {page.summary ? <Summary>{page.summary}</Summary> : null}
        {page.content}
        <RelatedRecipes links={route.relatedLinks} />
      </ContentArticle>
    </Layout>
  );
};

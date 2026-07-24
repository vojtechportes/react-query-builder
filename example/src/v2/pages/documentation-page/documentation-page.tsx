import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { ClientOnly } from '../../../components/client-only';
import { DocumentationLayout } from './components/documentation-layout';
import { DocumentationSectionLabel } from './components/documentation-section-label';
import { DocumentationSummary } from './components/documentation-summary';
import { DocumentationTitle } from './components/documentation-title';
import { ContentArticle } from '../../../components/content-article';
import { DocumentationSidebar } from '../../../components/documentation-sidebar';
import { RelatedRecipes } from '../../../components/related-recipes';
import { useV2PageMetadata } from '../../seo/hooks/use-v2-page-metadata';
import { createV2PageMetadataOptions } from '../../seo/utils/create-v2-page-metadata-options.util';
import { findV2SeoPage } from '../../seo/utils/find-v2-seo-page.util';
import { findV2RouteRecord } from '../../app/utils/find-v2-route-record.util';
import { v2DocumentationSidebar } from '../../navigation/constants/v2-documentation-sidebar';
import { findDocumentationPage } from './utils/find-documentation-page.util';
import { loadParsingSandbox } from './utils/load-parsing-sandbox.util';

export const DocumentationPage: React.FC = () => {
  const location = useLocation();
  const page = findDocumentationPage(location.pathname);
  const route = findV2RouteRecord(page.path);
  const seoPage = findV2SeoPage(page.path);

  useV2PageMetadata(
    seoPage.title,
    seoPage.description,
    createV2PageMetadataOptions(seoPage, route)
  );

  return (
    <DocumentationLayout>
      <DocumentationSidebar {...v2DocumentationSidebar} />
      <ContentArticle>
        <DocumentationSectionLabel>
          {page.sectionTitle}
        </DocumentationSectionLabel>
        <DocumentationTitle>{page.title}</DocumentationTitle>
        {page.summary ? (
          <DocumentationSummary>{page.summary}</DocumentationSummary>
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
    </DocumentationLayout>
  );
};

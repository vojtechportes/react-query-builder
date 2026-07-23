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
import { findSeoPage } from '../../../constants/seo-pages';
import { usePageMetadata } from '../../../hooks/use-page-metadata';
import { documentationGroups } from './constants/documentation-groups';
import { documentationPages } from './constants/documentation-pages';
import { relatedRecipesByPath } from './constants/related-recipes-by-path';
import { findDocumentationPage } from './utils/find-documentation-page.util';
import { loadParsingSandbox } from './utils/load-parsing-sandbox.util';

export const DocumentationPage: React.FC = () => {
  const location = useLocation();
  const page = findDocumentationPage(location.pathname);
  const seoPage = findSeoPage(page.path);

  usePageMetadata(seoPage.title, seoPage.description, seoPage);

  return (
    <DocumentationLayout>
      <DocumentationSidebar
        title="Documentation"
        overviewPage={documentationPages[0]}
        groups={documentationGroups}
      />
      <ContentArticle>
        <DocumentationSectionLabel>
          {page.sectionTitle}
        </DocumentationSectionLabel>
        <DocumentationTitle>{page.title}</DocumentationTitle>
        {page.summary ? (
          <DocumentationSummary>{page.summary}</DocumentationSummary>
        ) : null}
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
    </DocumentationLayout>
  );
};

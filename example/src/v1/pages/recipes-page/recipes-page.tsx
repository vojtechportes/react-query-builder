import * as React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ContentArticle } from '../../../components/content-article';
import { DocumentationSidebar } from '../../../components/documentation-sidebar';
import { useV1PageMetadata } from '../../seo/hooks/use-v1-page-metadata';
import { createV1PageMetadataOptions } from '../../seo/utils/create-v1-page-metadata-options.util';
import { findV1SeoPage } from '../../seo/utils/find-v1-seo-page.util';
import { findV1RouteRecord } from '../../app/utils/find-v1-route-record.util';
import { v1RecipesSidebar } from '../../navigation/constants/v1-recipes-sidebar';
import { RecipeArticle } from './components/recipe-article';
import { RecipesOverview } from './components/recipes-overview';
import { findRecipePage } from './utils/find-recipe-page.util';

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
  margin: 0 0 1rem;
  font-size: clamp(2rem, 4vw, 3rem);
`;

const Summary = styled.p`
  font-size: 1.05rem;
  margin-top: 0.55rem;
`;

export const RecipesPage: React.FC = () => {
  const { pathname } = useLocation();
  const page = findRecipePage(pathname);
  const route = findV1RouteRecord(page?.path ?? '/recipes');
  const seoPage = findV1SeoPage(route.path);

  useV1PageMetadata(seoPage.title, seoPage.description, {
    ...createV1PageMetadataOptions(seoPage, route),
    faqs: page?.faqs,
  });

  return (
    <Layout>
      <DocumentationSidebar {...v1RecipesSidebar} />
      <ContentArticle>
        <SectionLabel>Recipes</SectionLabel>
        <Title>{page?.title ?? 'React Query Builder Recipes'}</Title>
        <Summary>
          {page?.summary ??
            'Practical patterns for tables, forms, URLs, APIs, query imports and exports, dynamic fields, and reviewing AI-generated filters.'}
        </Summary>
        {page ? (
          <RecipeArticle
            key={page.path}
            page={page}
            relatedLinks={route.relatedLinks}
          />
        ) : (
          <RecipesOverview groups={v1RecipesSidebar.groups} />
        )}
      </ContentArticle>
    </Layout>
  );
};

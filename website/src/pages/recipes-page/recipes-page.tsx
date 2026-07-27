import * as React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ContentArticle } from '../../components/content-article';
import { DocumentationSidebar } from '../../components/documentation-sidebar';
import { findSeoPage } from '../../constants/seo-pages';
import { usePageMetadata } from '../../hooks/use-page-metadata';
import { RecipeArticle } from './components/recipe-article';
import { RecipesOverview } from './components/recipes-overview';
import { recipeGroups } from './constants/recipe-groups';
import { recipesOverviewPage } from './constants/recipes-overview-page';
import { recipes } from './pages/recipes-content';
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

const pagesByPath = new Map(recipes.map((page) => [page.path, page]));

export const RecipesPage: React.FC = () => {
  const { pathname } = useLocation();
  const page = findRecipePage(pathname);
  const seoPage = findSeoPage(page?.path ?? '/recipes');
  usePageMetadata(seoPage.title, seoPage.description, {
    ...seoPage,
    breadcrumbs: page
      ? [
          { name: 'Home', path: '/' },
          { name: 'Recipes', path: '/recipes' },
          { name: page.title, path: page.path },
        ]
      : [
          { name: 'Home', path: '/' },
          { name: 'Recipes', path: '/recipes' },
        ],
    faqs: page?.faqs,
  });

  return (
    <Layout>
      <DocumentationSidebar
        title="Recipes"
        overviewPage={recipesOverviewPage}
        groups={recipeGroups}
      />
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
            pagesByPath={pagesByPath}
          />
        ) : (
          <RecipesOverview groups={recipeGroups} />
        )}
      </ContentArticle>
    </Layout>
  );
};

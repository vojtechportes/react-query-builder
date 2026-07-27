import { describe, expect, it } from 'vitest';
import { recipeGroups } from './constants/recipe-groups';
import { recipesOverviewPage } from './constants/recipes-overview-page';
import { recipes } from './pages/recipes-content';
import { findRecipePage } from './utils/find-recipe-page.util';
import { hashRecipeContent } from './utils/hash-recipe-content.util';
import { serializeRecipeContent } from './utils/serialize-recipe-content.util';

describe('v2 recipe content', () => {
  it('preserves the complete ordered route, title, and content registry', async () => {
    const baseline = await Promise.all(
      recipes.map(async (recipe) => ({
        path: recipe.path,
        title: recipe.title,
        contentHash: await hashRecipeContent(serializeRecipeContent(recipe)),
      }))
    );

    expect(baseline).toMatchInlineSnapshot(`
      [
        {
          "contentHash": "e190eda8bac80801d73f616f98b13bb6dc7d950b6928960360bb037e1302044b",
          "path": "/recipes/prisma-filter-ui",
          "title": "Build a Prisma Filter UI with React Query Builder",
        },
        {
          "contentHash": "d8d2cdf6fc72b3bb8e630910a84ff9b8905a99d21824fa310c1f302623b666f0",
          "path": "/recipes/mui-datagrid-advanced-filtering",
          "title": "MUI DataGrid Advanced Filtering with React Query Builder",
        },
        {
          "contentHash": "0d544fd055507e33b7502adee80238435b143b1027209ac7f822fd6da72580ed",
          "path": "/recipes/ag-grid-query-builder",
          "title": "Build an AG Grid Query Builder Filter Panel",
        },
        {
          "contentHash": "812490e45cdb3b2a162917a288634f407fae1046eaf05c74789acd6deb5188ae",
          "path": "/recipes/tanstack-table-filtering",
          "title": "TanStack Table Filtering with React Query Builder",
        },
        {
          "contentHash": "a57dabdaa031d07363cd90c1086e75b4461ce6fd27aceafbd09d17dc4eeb7cd3",
          "path": "/recipes/react-hook-form-query-builder",
          "title": "React Hook Form Query Builder Integration",
        },
        {
          "contentHash": "269e0f7dce47927bc74cdf5e206dfb799257b174a4df7be0c7a0be45eb8b30b2",
          "path": "/recipes/persist-filters-in-url",
          "title": "Persist React Filters in URL Query Parameters",
        },
        {
          "contentHash": "e77e3311d4c4977fc170cff22e3d75d6c9dddeb2f309df63282a7a2e1ab963d6",
          "path": "/recipes/save-load-filter-presets",
          "title": "Save and Load React Filter Presets",
        },
        {
          "contentHash": "643b39d0767ccac673d9dc90cb09bb7e177bc4737fcfde5d133d357575c4163d",
          "path": "/recipes/server-side-filtering",
          "title": "Server-side Filtering with React Query Builder",
        },
        {
          "contentHash": "bc42fbe21d30f4b89ba78ec8829122a48ccddb45abbaccbc99a7e7852d923072",
          "path": "/recipes/sql-where-to-react-query-builder",
          "title": "Convert SQL WHERE to React Query Builder Data",
        },
        {
          "contentHash": "510636321aa8a5c5b4d03e7efa91e739400b66a7fa8e6a12d22591460e9a78de",
          "path": "/recipes/export-to-mongodb-query",
          "title": "Export React Filters to a MongoDB Query",
        },
        {
          "contentHash": "3fbca97dd39f0fa0df493c5b12d87daad2c362a2f545f7b9dbc440995e04ecbb",
          "path": "/recipes/export-to-prisma-where-clause",
          "title": "Export to a Prisma Where Clause",
        },
        {
          "contentHash": "670742123969bdb7d78c6143b5a973d5a91967e8317464d76b0696f6df9faf98",
          "path": "/recipes/dynamic-operators-by-field-type",
          "title": "Dynamic Query Operators by Field Type",
        },
        {
          "contentHash": "930948de128c502d32be8b18094d8aa8fb175bda0c4a49f65702934981117605",
          "path": "/recipes/ai-assisted-filter-creation",
          "title": "Experimental AI-assisted Filter Creation",
        },
      ]
    `);
  });

  it('preserves the recipe overview and sidebar groups', () => {
    expect(recipesOverviewPage).toEqual({
      path: '/recipes',
      title: 'Recipes overview',
    });
    expect(
      recipeGroups.map(({ key, title, pages }) => ({
        key,
        title,
        paths: pages.map(({ path }) => path),
      }))
    ).toMatchInlineSnapshot(`
      [
        {
          "key": "integrations",
          "paths": [
            "/recipes/prisma-filter-ui",
            "/recipes/mui-datagrid-advanced-filtering",
            "/recipes/ag-grid-query-builder",
            "/recipes/tanstack-table-filtering",
            "/recipes/react-hook-form-query-builder",
          ],
          "title": "Framework and data integrations",
        },
        {
          "key": "state-backend",
          "paths": [
            "/recipes/persist-filters-in-url",
            "/recipes/save-load-filter-presets",
            "/recipes/server-side-filtering",
          ],
          "title": "State and backend workflows",
        },
        {
          "key": "parsing-export",
          "paths": [
            "/recipes/sql-where-to-react-query-builder",
            "/recipes/export-to-mongodb-query",
            "/recipes/export-to-prisma-where-clause",
          ],
          "title": "Parsing and export",
        },
        {
          "key": "advanced",
          "paths": [
            "/recipes/dynamic-operators-by-field-type",
            "/recipes/ai-assisted-filter-creation",
          ],
          "title": "Advanced patterns",
        },
      ]
    `);
  });

  it('normalizes trailing slashes without falling back to another recipe', () => {
    expect(findRecipePage('/recipes/prisma-filter-ui///')?.path).toBe(
      '/recipes/prisma-filter-ui'
    );
    expect(findRecipePage('/recipes/unknown')).toBeUndefined();
  });

  it('keeps snippets and runtime demos independent from the v2 package', () => {
    for (const recipe of recipes) {
      expect(recipe.builderCode).not.toContain('rqb-v1');
      expect(recipe.demoLoader.toString()).not.toContain('rqb-v1');
    }
  });
});

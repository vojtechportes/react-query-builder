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
          "contentHash": "b21b699a0b0982e837a02aad72bd1ac01eb9171df62cd096126a4c49aa30e1b1",
          "path": "/recipes/prisma-filter-ui",
          "title": "Build a Prisma Filter UI with React Query Builder",
        },
        {
          "contentHash": "d96f68003955af83837d12a03ac77d2e1acab40c5a22acf3b230d70d2e59fa24",
          "path": "/recipes/mui-datagrid-advanced-filtering",
          "title": "MUI DataGrid Advanced Filtering with React Query Builder",
        },
        {
          "contentHash": "c1d97acfb780144e59192bc7a9beddb6d1680dde075503f83cf70e9e105adfb7",
          "path": "/recipes/ag-grid-query-builder",
          "title": "Build an AG Grid Query Builder Filter Panel",
        },
        {
          "contentHash": "55a4192da7d38d6fafc879e9c63be18a7f56d5f6aa51f86f978969db48423d56",
          "path": "/recipes/tanstack-table-filtering",
          "title": "TanStack Table Filtering with React Query Builder",
        },
        {
          "contentHash": "d3f42467723ddbb48ca7015e5137a59884f3d251b7d5688123b7860e22afcf97",
          "path": "/recipes/react-hook-form-query-builder",
          "title": "React Hook Form Query Builder Integration",
        },
        {
          "contentHash": "7612570efd9f707164e584be69003bdba8db0f7e0028437376a77a22343d5516",
          "path": "/recipes/persist-filters-in-url",
          "title": "Persist React Filters in URL Query Parameters",
        },
        {
          "contentHash": "27b853a443b2e86054c6b8760f69e887f0858a73fd7b177a22d21566f5aa7a98",
          "path": "/recipes/save-load-filter-presets",
          "title": "Save and Load React Filter Presets",
        },
        {
          "contentHash": "c550510f1c832cd82c7ded698e3ca14057832f8b65538734b9b5d59db39cbd22",
          "path": "/recipes/server-side-filtering",
          "title": "Server-side Filtering with React Query Builder",
        },
        {
          "contentHash": "411208925d030762e6ca3c1f8cf864e0be042714c19550af438c2cecfa404b7e",
          "path": "/recipes/sql-where-to-react-query-builder",
          "title": "Convert SQL WHERE to React Query Builder Data",
        },
        {
          "contentHash": "ba2741081d41fa61ea166d00b8dd912b08bba73f6af8e6d287e4f1883b5db67e",
          "path": "/recipes/export-to-mongodb-query",
          "title": "Export React Filters to a MongoDB Query",
        },
        {
          "contentHash": "b4c2bc23f86b64c68f46b89f8a414f653f26392120f621508dc85873001a40b0",
          "path": "/recipes/export-to-prisma-where-clause",
          "title": "Export to a Prisma Where Clause",
        },
        {
          "contentHash": "dea80d63c38e695ac925da0d7960fbf8df0e55bce35a8d40398740bd32305664",
          "path": "/recipes/dynamic-operators-by-field-type",
          "title": "Dynamic Query Operators by Field Type",
        },
        {
          "contentHash": "8d246f0467f89c29003eb8e0dad16f72a9d7759dc7f8dc3a6a7f6f0e0b327567",
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
      expect(recipe.installCode).not.toContain('import ');
      expect(recipe.builderCode).toContain(
        "import '@vojtechportes/react-query-builder/styles.css';"
      );
      expect(recipe.builderCode).not.toContain('rqb-v1');
      expect(recipe.demoLoader.toString()).not.toContain('rqb-v1');
    }
  });
});

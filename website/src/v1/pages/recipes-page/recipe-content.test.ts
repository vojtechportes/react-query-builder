import { describe, expect, it } from 'vitest';
import { recipeGroups } from './constants/recipe-groups';
import { recipesOverviewPage } from './constants/recipes-overview-page';
import { recipes } from './pages/recipes-content';
import { findRecipePage } from './utils/find-recipe-page.util';
import { hashRecipeContent } from './utils/hash-recipe-content.util';
import { serializeRecipeContent } from './utils/serialize-recipe-content.util';

describe('v1 recipe content', () => {
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
          "contentHash": "df43eaafb7973359e1fcb1b4fef5d7f750d7a312d1d6246be30b5703a2c988cb",
          "path": "/recipes/prisma-filter-ui",
          "title": "Build a Prisma Filter UI with React Query Builder",
        },
        {
          "contentHash": "e67fa9f6f73973d919f3ded618fe82528832b9cfc1f0e81c22e3b361773098d9",
          "path": "/recipes/mui-datagrid-advanced-filtering",
          "title": "MUI DataGrid Advanced Filtering with React Query Builder",
        },
        {
          "contentHash": "a8416e25a7951628f9c31baccbd0a48313607664bbab6fe5401f9e632d2c76a0",
          "path": "/recipes/ag-grid-query-builder",
          "title": "Build an AG Grid Query Builder Filter Panel",
        },
        {
          "contentHash": "fe0980de931436ad18d30c896f0dcbb6e9813a4d7f3fc8b51494cfe32ce1fc6c",
          "path": "/recipes/tanstack-table-filtering",
          "title": "TanStack Table Filtering with React Query Builder",
        },
        {
          "contentHash": "6460a8be231b44a57684c4f249b80852ba5bf6d937bb02f64a7b7b2bcc224570",
          "path": "/recipes/react-hook-form-query-builder",
          "title": "React Hook Form Query Builder Integration",
        },
        {
          "contentHash": "55871c2ab3891c48bef5af18b80d1508510ef2c3ea49e6e958d275ade4bcb55d",
          "path": "/recipes/persist-filters-in-url",
          "title": "Persist React Filters in URL Query Parameters",
        },
        {
          "contentHash": "f7333675a6e7b52edb8c5a194bd014450a77193594d154cee7c2f5d8b9bed912",
          "path": "/recipes/save-load-filter-presets",
          "title": "Save and Load React Filter Presets",
        },
        {
          "contentHash": "a69fa12ee062ee14ef8ea7d01d6c25ab846db5d5bcc3136ac62425cc84a76288",
          "path": "/recipes/server-side-filtering",
          "title": "Server-side Filtering with React Query Builder",
        },
        {
          "contentHash": "98d161ce0b3c927bc915b6bfe835d56f9a260fe95ba6cf72f80d71103fe6d5ef",
          "path": "/recipes/sql-where-to-react-query-builder",
          "title": "Convert SQL WHERE to React Query Builder Data",
        },
        {
          "contentHash": "fafd1078f7a673e625ef3a8ffd37f0d756b8bebe735139cb20efc4c3da7b58db",
          "path": "/recipes/export-to-mongodb-query",
          "title": "Export React Filters to a MongoDB Query",
        },
        {
          "contentHash": "84e2d8576c16f0468babf8ee3253ea64fe90fb6d9fed07a82ae29c1f3644e701",
          "path": "/recipes/export-to-prisma-where-clause",
          "title": "Export to a Prisma Where Clause",
        },
        {
          "contentHash": "b088c78030a0b3744fb0a26a51acd52e0247e884cff86d178910a5a9a8552470",
          "path": "/recipes/dynamic-operators-by-field-type",
          "title": "Dynamic Query Operators by Field Type",
        },
        {
          "contentHash": "f24dac6fac75c3c031778878dc6f637b6a1dc14093e1cff0f06a345d5dcabc7e",
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
      expect(recipe.builderCode).not.toContain('rqb-v2');
      expect(recipe.demoLoader.toString()).not.toContain('rqb-v2');
    }
  });
});

import { agGridQueryBuilderRecipe } from './ag-grid-query-builder.recipe';
import { aiAssistedFilterCreationRecipe } from './ai-assisted-filter-creation.recipe';
import { dynamicOperatorsByFieldTypeRecipe } from './dynamic-operators-by-field-type.recipe';
import { exportToMongodbQueryRecipe } from './export-to-mongodb-query.recipe';
import { exportToPrismaWhereClauseRecipe } from './export-to-prisma-where-clause.recipe';
import { muiDataGridAdvancedFilteringRecipe } from './mui-datagrid-advanced-filtering.recipe';
import { persistFiltersInUrlRecipe } from './persist-filters-in-url.recipe';
import { prismaFilterUiRecipe } from './prisma-filter-ui.recipe';
import { reactHookFormQueryBuilderRecipe } from './react-hook-form-query-builder.recipe';
import { saveLoadFilterPresetsRecipe } from './save-load-filter-presets.recipe';
import { serverSideFilteringRecipe } from './server-side-filtering.recipe';
import { sqlWhereToReactQueryBuilderRecipe } from './sql-where-to-react-query-builder.recipe';
import { tanstackTableFilteringRecipe } from './tanstack-table-filtering.recipe';

export const recipes = [
  prismaFilterUiRecipe,
  muiDataGridAdvancedFilteringRecipe,
  agGridQueryBuilderRecipe,
  tanstackTableFilteringRecipe,
  reactHookFormQueryBuilderRecipe,
  persistFiltersInUrlRecipe,
  saveLoadFilterPresetsRecipe,
  serverSideFilteringRecipe,
  sqlWhereToReactQueryBuilderRecipe,
  exportToMongodbQueryRecipe,
  exportToPrismaWhereClauseRecipe,
  dynamicOperatorsByFieldTypeRecipe,
  aiAssistedFilterCreationRecipe,
];

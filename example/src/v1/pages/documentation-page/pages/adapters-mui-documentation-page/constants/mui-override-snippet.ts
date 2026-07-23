export const muiOverrideSnippet = `import {
  components as muiComponents,
  MuiSelect,
} from '@vojtechportes/react-query-builder/mui/v7';

const components = {
  ...muiComponents,
  form: {
    ...muiComponents.form,
    Select: MuiSelect,
  },
};`;

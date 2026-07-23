export const monacoWithMuiSnippet = `import { Builder } from '@vojtechportes/react-query-builder';
import { components as muiComponents } from '@vojtechportes/react-query-builder/mui/v9';
import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';

const components = createMonacoComponents(muiComponents);

<Builder
  fields={fields}
  data={data}
  textMode
  components={components}
  onChange={setData}
/>;

// The same pattern works with @vojtechportes/react-query-builder/antd/v6.`;

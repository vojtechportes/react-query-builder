export const monacoComponentsSnippet = `import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';
import { components as muiComponents } from '@vojtechportes/react-query-builder/mui/v9';

const components = createMonacoComponents(muiComponents);

<Builder
  fields={fields}
  data={data}
  textMode
  components={components}
  onChange={setData}
/>;`;

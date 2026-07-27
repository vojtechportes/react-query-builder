export const monacoComponentsSnippet = `import '@vojtechportes/react-query-builder/styles.css';
import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';
import { components as muiComponents } from '@vojtechportes/react-query-builder/mui/v9';

const components = createMonacoComponents(muiComponents);

<Builder
  fields={fields}
  data={data}
  textMode
  components={components}
  onChange={setData}
/>;`;

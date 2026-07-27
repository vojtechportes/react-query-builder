export const monacoWithAntdSnippet = `import { Builder } from '@vojtechportes/react-query-builder';
import { components as antdComponents } from '@vojtechportes/react-query-builder/antd/v6';
import { createMonacoComponents } from '@vojtechportes/react-query-builder/monaco';

const components = createMonacoComponents(antdComponents);

<Builder
  fields={fields}
  data={data}
  textMode
  components={components}
  onChange={setData}
/>;`;

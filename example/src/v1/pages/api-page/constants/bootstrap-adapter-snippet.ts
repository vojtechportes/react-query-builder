export const bootstrapAdapterSnippet = `import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { components } from '@vojtechportes/react-query-builder/bootstrap/v5';

<Builder
  fields={fields}
  data={data}
  components={components}
  onChange={setData}
/>;`;

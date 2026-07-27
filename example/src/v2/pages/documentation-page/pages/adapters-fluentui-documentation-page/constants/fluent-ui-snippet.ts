export const fluentUiSnippet = `import '@vojtechportes/react-query-builder/styles.css';
import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import { components } from '@vojtechportes/react-query-builder/fluentui/v8';

export const MyFluentUiBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      data={data}
      fields={fields}
      components={components}
      onChange={setData}
    />
  );
};`;

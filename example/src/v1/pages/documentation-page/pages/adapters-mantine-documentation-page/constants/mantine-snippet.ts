export const mantineSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { components } from '@vojtechportes/react-query-builder/mantine/v9';

export const MyMantineBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <MantineProvider>
      <Builder
        data={data}
        fields={fields}
        components={components}
        onChange={setData}
      />
    </MantineProvider>
  );
};`;

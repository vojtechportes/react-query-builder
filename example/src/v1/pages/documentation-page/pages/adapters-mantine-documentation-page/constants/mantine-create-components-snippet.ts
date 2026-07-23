export const mantineCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import {
  createMantineComponents,
  components as mantineComponents,
} from '@vojtechportes/react-query-builder/mantine/v9';

const components = createMantineComponents(mantineComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

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

export const radixCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import {
  createRadixComponents,
  components as radixComponents,
} from '@vojtechportes/react-query-builder/radix/v1';

const components = createRadixComponents(radixComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

export const MyRadixBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Theme>
      <Builder
        fields={fields}
        data={data}
        components={components}
        onChange={setData}
      />
    </Theme>
  );
};`;

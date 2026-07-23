export const radixSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { components } from '@vojtechportes/react-query-builder/radix/v1';

export const MyRadixBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Theme>
      <Builder
        data={data}
        fields={fields}
        components={components}
        onChange={setData}
      />
    </Theme>
  );
};`;

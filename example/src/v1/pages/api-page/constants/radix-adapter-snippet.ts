export const radixAdapterSnippet = `import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { components } from '@vojtechportes/react-query-builder/radix/v1';

<Theme>
  <Builder
    fields={fields}
    data={data}
    components={components}
    onChange={setData}
  />
</Theme>;`;

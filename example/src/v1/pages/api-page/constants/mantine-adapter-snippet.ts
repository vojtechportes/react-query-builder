export const mantineAdapterSnippet = `import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { components } from '@vojtechportes/react-query-builder/mantine/v9';

<MantineProvider>
  <Builder
    fields={fields}
    data={data}
    components={components}
    onChange={setData}
  />
</MantineProvider>;`;

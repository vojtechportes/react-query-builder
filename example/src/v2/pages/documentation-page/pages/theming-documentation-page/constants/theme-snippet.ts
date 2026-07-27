export const themeSnippet = `import '@vojtechportes/react-query-builder/styles.css';
import {
  Builder,
  ThemeProvider,
} from '@vojtechportes/react-query-builder';

<ThemeProvider colors={{ primary: { default: '#3f51b5' } }}>
  <Builder data={data} fields={fields} onChange={setData} />
</ThemeProvider>;`;

export const themeSnippet = `import { ThemeProvider } from '@vojtechportes/react-query-builder/theme-provider';
import { colors } from '@vojtechportes/react-query-builder';

<ThemeProvider
  colors={{
    ...colors,
    primary: {
      ...colors.primary,
      default: '#3f51b5',
    },
  }}
>
  <Builder data={data} fields={fields} onChange={setData} />
</ThemeProvider>;`;

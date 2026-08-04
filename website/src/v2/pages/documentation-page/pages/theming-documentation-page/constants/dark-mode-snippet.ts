export const darkModeSnippet = `import '@vojtechportes/react-query-builder/styles.css';
import '@vojtechportes/react-query-builder/dark-mode.variables.css';

const [darkMode, setDarkMode] = useState(false);

<Builder
  fields={fields}
  data={data}
  colorScheme={darkMode ? 'dark' : 'light'}
  onChange={setData}
/>;`;

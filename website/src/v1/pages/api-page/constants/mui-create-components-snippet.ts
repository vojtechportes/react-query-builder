export const muiCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import {
  createMuiComponents,
  components as muiComponents,
} from '@vojtechportes/react-query-builder/mui/v9';

const components = createMuiComponents(muiComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

export const MyMuiBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      fields={fields}
      data={data}
      components={components}
      onChange={setData}
    />
  );
};`;

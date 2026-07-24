export const bootstrapCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  createBootstrapComponents,
  components as bootstrapComponents,
} from '@vojtechportes/react-query-builder/bootstrap/v5';

const components = createBootstrapComponents(bootstrapComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

export const MyBootstrapBuilder = () => {
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

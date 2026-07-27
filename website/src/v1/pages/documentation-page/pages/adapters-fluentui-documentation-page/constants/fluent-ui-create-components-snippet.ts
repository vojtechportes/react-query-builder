export const fluentUiCreateComponentsSnippet = `import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import {
  createFluentUiComponents,
  components as fluentUiComponents,
} from '@vojtechportes/react-query-builder/fluentui/v8';

const components = createFluentUiComponents(fluentUiComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

export const MyFluentUiBuilder = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);

  return (
    <Builder
      data={data}
      fields={fields}
      components={components}
      onChange={setData}
    />
  );
};`;

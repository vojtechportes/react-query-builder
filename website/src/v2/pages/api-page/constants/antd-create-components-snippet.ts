export const antdCreateComponentsSnippet = `import '@vojtechportes/react-query-builder/styles.css';
import {
  Builder,
  type DenormalizedQuery,
} from '@vojtechportes/react-query-builder';
import {
  createAntdComponents,
  components as antdComponents,
} from '@vojtechportes/react-query-builder/antd/v6';

const components = createAntdComponents(antdComponents, {
  form: {
    Input: MyInput,
  },
  Add: MyAddButton,
});

export const MyAntdBuilder = () => {
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

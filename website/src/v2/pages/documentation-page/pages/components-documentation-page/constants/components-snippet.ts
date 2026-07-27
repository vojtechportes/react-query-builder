export const componentsSnippet = `import '@vojtechportes/react-query-builder/styles.css';
const components = {
  Add: MyAddButton,
  Remove: MyRemoveButton,
  form: {
    Input: MyInput,
    Select: MySelect,
  },
};

<Builder
  data={data}
  fields={fields}
  components={components}
  onChange={setData}
/>;`;

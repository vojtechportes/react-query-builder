export const dynamicFieldOptionsReloadSnippet = `import '@vojtechportes/react-query-builder/styles.css';
const builderRef = useBuilderRef();

<Builder
  ref={builderRef}
  fields={fields}
  data={data}
  onFieldOptionsReload={(field) => {
    if (field === 'CITY') {
      loadSharedCities('CZ');
    }
  }}
  onChange={setData}
/>;

builderRef.current?.reloadFieldOptions('CITY');`;

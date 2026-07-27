export const textModeConfigSnippet = `import '@vojtechportes/react-query-builder/styles.css';
<Builder
  fields={fields}
  data={data}
  textMode={{
    format: 'SQL',
    defaultMode: 'builder',
  }}
  defaultMode="text"
  onChange={setData}
/>;

// textMode can be either:
// - true
// - { format?: 'SQL'; defaultMode?: 'builder' | 'text' }
//
// If both are provided, the top-level defaultMode prop wins.`;

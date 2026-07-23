export const stringsSnippet = `import { strings } from '@vojtechportes/react-query-builder';

<Builder
  fields={fields}
  data={data}
  strings={{
    ...strings,
    group: {
      ...strings.group,
      addRule: 'Add filter',
      addGroup: 'Add condition group',
    },
    operators: {
      ...strings.operators,
      EQUAL: 'Is exactly',
      NOT_EQUAL: 'Is not',
    },
    validation: {
      ...strings.validation,
      required: 'Please provide a value',
    },
  }}
  onChange={setData}
/>;

// You can override only the keys you need.
// Unspecified labels fall back to the built-in defaults.`;

export const textModeStringsSnippet = `import { strings } from '@vojtechportes/react-query-builder';

<Builder
  fields={fields}
  data={data}
  textMode
  strings={{
    ...strings,
    textMode: {
      ...strings.textMode,
      toggleToText: 'Switch to SQL mode',
      toggleToBuilder: 'Switch to visual builder',
      syntaxError: 'SQL syntax error',
      locksUnsupported: 'Locked rules and groups are not supported in this text editor mode.',
      lockedRangesHover: 'This SQL fragment is locked and cannot be edited.',
    },
  }}
  onChange={setData}
/>;`;

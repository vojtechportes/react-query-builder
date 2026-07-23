export const cloneButtonSnippet = `const components = {
  CloneButton: MyCloneButton,
};

<Builder
  fields={fields}
  data={data}
  cloneable
  components={components}
  onChange={setData}
/>;

// CloneButton receives:
// nodeType: 'rule' | 'group'
// disabled?: boolean
// onClick?: () => void`;

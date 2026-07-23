export const lockToggleSnippet = `const components = {
  LockToggle: MyLockToggle,
};

<Builder
  fields={fields}
  data={data}
  lockable
  components={components}
  onChange={setData}
/>;

// LockToggle receives:
// state: 'unlocked' | 'self' | 'all'
// nodeType: 'rule' | 'group'
// disabled?: boolean
// onChange?: (nextState) => void`;

export const lockingGuiSnippet = `<Builder
  fields={fields}
  data={data}
  lockable
  onChange={setData}
/>;

// Rules cycle through:
// unlocked -> locked
//
// Groups cycle through:
// unlocked -> locked group only -> locked group and descendants
//
// The emitted query stores those states in readOnly:
// rule: readOnly: true
// group: readOnly: true
// group + descendants: readOnly: { enabled: true, inheritToChildren: true }
//
// If a node already uses readOnly.targets, the lock toggle preserves those
// targets and only changes enabled/inheritToChildren.`;

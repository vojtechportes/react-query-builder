export const builderBehaviorSnippet = `<Builder
  fields={fields}
  data={data}
  lockable
  readOnlyProtectsDelete
  cloneable
  draggable
  allowGroupNegation={false}
  newNodePlacement="prepend"
  singleRootGroup={false}
  groupTypes="both"
  onChange={setData}
/>;

// lockable:
// Renders built-in lock controls for rules and groups and writes the resulting
// lock state back into the emitted query via rule/group readOnly values.
//
// readOnlyProtectsDelete:
// Prevents deleting parent groups when that delete would indirectly remove
// read-only protected descendants. Defaults to true.
//
// cloneable:
// Renders built-in clone controls for rules and groups and inserts the cloned
// node directly below the original node.
//
// draggable:
// Enables drag-and-drop for editable rules and groups.
//
// allowGroupNegation={false}:
// Hides the group-level NOT toggle and rejects NOT (...) groups in text mode
// while still allowing operator-level negation such as NOT IN or IS NOT NULL.
//
// newNodePlacement="prepend":
// Inserts newly added rules and groups at the beginning of their parent instead
// of appending them to the end. The default is "append".
//
// singleRootGroup={false}:
// Allows multiple root-level nodes instead of wrapping everything into one root group.
//
// groupTypes="both":
// Lets users choose between groups with AND/OR/NOT controls and groups without modifiers.`;

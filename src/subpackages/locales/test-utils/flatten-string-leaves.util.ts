export const flattenStringLeaves = (
  value: unknown,
  parentPath = ''
): Map<string, string> => {
  const leaves = new Map<string, string>();

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return leaves;
  }

  for (const [key, child] of Object.entries(value)) {
    const path = parentPath ? parentPath + '.' + key : key;

    if (typeof child === 'string') {
      leaves.set(path, child);
      continue;
    }

    for (const [childPath, leaf] of flattenStringLeaves(child, path)) {
      leaves.set(childPath, leaf);
    }
  }

  return leaves;
};

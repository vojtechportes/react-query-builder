import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';

export interface IRecipeQueryValidationOptions {
  allowedFields?: readonly string[];
  allowedOperators?: readonly string[];
  maxDepth?: number;
  maxRules?: number;
  maxValueLength?: number;
}

export const isRecipeQuery = (
  value: unknown,
  options: IRecipeQueryValidationOptions = {}
): value is DenormalizedQuery => {
  if (!Array.isArray(value)) return false;

  const stack: Array<{ node: unknown; depth: number }> = value.map((node) => ({
    node,
    depth: 1,
  }));
  const visited = new Set<object>();
  const maxRules = options.maxRules ?? 30;
  let nodeCount = 0;
  let ruleCount = 0;

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current.node !== 'object' || current.node === null) {
      return false;
    }
    if (visited.has(current.node)) return false;
    visited.add(current.node);
    nodeCount += 1;
    if (nodeCount > maxRules * 2 + 1) return false;

    const node = current.node as Record<string, unknown>;
    if (node.type === 'GROUP') {
      if (
        !Array.isArray(node.children) ||
        current.depth > (options.maxDepth ?? 6) ||
        (node.value !== undefined &&
          node.value !== 'AND' &&
          node.value !== 'OR') ||
        (node.isNegated !== undefined && typeof node.isNegated !== 'boolean')
      ) {
        return false;
      }
      stack.push(
        ...node.children.map((child) => ({
          node: child,
          depth: current.depth + 1,
        }))
      );
      continue;
    }

    ruleCount += 1;
    const ruleValues = Array.isArray(node.value) ? node.value : [node.value];
    const hasInvalidValue =
      ruleValues.length > 20 ||
      ruleValues.some(
        (ruleValue) =>
          ruleValue !== undefined &&
          (typeof ruleValue === 'object' ||
            (typeof ruleValue === 'number' && !Number.isFinite(ruleValue)) ||
            (typeof ruleValue === 'string' &&
              ruleValue.length > (options.maxValueLength ?? 500)))
      );
    if (
      ruleCount > maxRules ||
      typeof node.field !== 'string' ||
      typeof node.operator !== 'string' ||
      hasInvalidValue ||
      (options.allowedFields && !options.allowedFields.includes(node.field)) ||
      (options.allowedOperators &&
        !options.allowedOperators.includes(node.operator)) ||
      (node.valueSource !== undefined &&
        node.valueSource !== 'value' &&
        node.valueSource !== 'field') ||
      (node.valueSource === 'field' &&
        (typeof node.valueField !== 'string' ||
          Boolean(
            options.allowedFields &&
            !options.allowedFields.includes(node.valueField)
          )))
    ) {
      return false;
    }
  }

  return true;
};

import { IBuilderRuleDependencyEntry } from '../../../builder/types/field-option';

export const areBuilderRuleDependencyEntriesEqual = (
  previousEntries: IBuilderRuleDependencyEntry[],
  nextEntries: IBuilderRuleDependencyEntry[]
): boolean => {
  if (previousEntries.length !== nextEntries.length) {
    return false;
  }

  return previousEntries.every((previousEntry, index) => {
    const nextEntry = nextEntries[index];

    if (!nextEntry || previousEntry.ruleId !== nextEntry.ruleId) {
      return false;
    }

    const previousDependencyFields = Object.keys(previousEntry.dependencies);
    const nextDependencyFields = Object.keys(nextEntry.dependencies);

    if (previousDependencyFields.length !== nextDependencyFields.length) {
      return false;
    }

    return previousDependencyFields.every((dependencyField) => {
      const previousDependency = previousEntry.dependencies[dependencyField];
      const nextDependency = nextEntry.dependencies[dependencyField];

      if (!previousDependency || !nextDependency) {
        return previousDependency === nextDependency;
      }

      return (
        previousDependency.nodeId === nextDependency.nodeId &&
        previousDependency.field === nextDependency.field &&
        previousDependency.operator === nextDependency.operator &&
        JSON.stringify(previousDependency.value) ===
          JSON.stringify(nextDependency.value)
      );
    });
  });
};

import React from 'react';
import { BuilderRef, BuilderRuleDependenciesListener } from '../use-builder-ref/types';
import { IBuilderRuleDependencyEntry } from '../../builder/types/field-option';

export const useBuilderRuleDependencies = (
  builderRef: BuilderRef,
  field: string,
  dependencyFields: string[]
): IBuilderRuleDependencyEntry[] => {
  const [entries, setEntries] = React.useState<IBuilderRuleDependencyEntry[]>([]);
  const dependencyFieldsKey = dependencyFields.join('|');

  React.useEffect(() => {
    const listener: BuilderRuleDependenciesListener = (nextEntries) => {
      setEntries(nextEntries);
    };

    return builderRef.subscribeToRuleDependencies(
      field,
      dependencyFields,
      listener
    );
  }, [builderRef, dependencyFieldsKey, field]);

  return entries;
};

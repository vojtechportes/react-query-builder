import React from 'react';
import {
  BuilderRef,
  BuilderRuleDependenciesListener,
} from '../use-builder-ref/types';
import { IBuilderRuleDependencyEntry } from '../../types/field-option';

export const useBuilderRuleDependencies = (
  builderRef: BuilderRef,
  field: string,
  dependencyFields: string[]
): IBuilderRuleDependencyEntry[] => {
  const [entries, setEntries] = React.useState<IBuilderRuleDependencyEntry[]>(
    []
  );
  const dependencyFieldsKey = JSON.stringify(dependencyFields);

  React.useEffect(() => {
    const listener: BuilderRuleDependenciesListener = (nextEntries) => {
      setEntries(nextEntries);
    };

    return builderRef.subscribeToRuleDependencies(
      field,
      dependencyFields,
      listener
    );
    // dependencyFieldsKey tracks array contents without resubscribing for identity-only changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builderRef, dependencyFieldsKey, field]);

  return entries;
};

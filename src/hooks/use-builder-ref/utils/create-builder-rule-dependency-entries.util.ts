import { IBuilderRuleDependencyEntry } from '../../../builder/types/field-option';
import { IBuilderRef } from '../types';

export const createBuilderRuleDependencyEntries = (
  builder: IBuilderRef,
  field: string,
  dependencyFields: string[]
): IBuilderRuleDependencyEntry[] =>
  builder
    .getNodes()
    .filter((node) => 'field' in node && node.field === field)
    .map((node) => ({
      ruleId: node.id,
      dependencies: dependencyFields.reduce<Record<string, ReturnType<IBuilderRef['getNearestField']>>>(
        (result, dependencyField) => ({
          ...result,
          [dependencyField]: builder.getNearestField(node.id, dependencyField),
        }),
        {}
      ),
    }));

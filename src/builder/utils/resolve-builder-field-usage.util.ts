import {
  BuilderFieldUsageLimitScope,
  IBuilderFieldProps,
} from '../types';
import { NormalizedQuery } from '../../utils/query-tree';

interface IBuilderFieldUsageBucketKeyArgs {
  field: IBuilderFieldProps;
  parentId?: string;
}

interface IBuilderFieldUsageCountArgs extends IBuilderFieldUsageBucketKeyArgs {
  data: NormalizedQuery;
  fields: IBuilderFieldProps[];
  excludeRuleId?: string;
}

interface IBuilderFieldUsageAvailabilityArgs extends IBuilderFieldUsageCountArgs {}

const ROOT_SCOPE_KEY = '__root__';

export const resolveBuilderFieldUsageLimitScope = (
  field: IBuilderFieldProps
): BuilderFieldUsageLimitScope => field.usageLimit?.scope || 'global';

export const resolveBuilderFieldUsageLimitKey = (
  field: IBuilderFieldProps
): string => field.usageLimit?.key || field.field;

export const hasBuilderFieldUsageLimit = (field: IBuilderFieldProps): boolean =>
  Boolean(field.usageLimit && field.usageLimit.max >= 0);

const createBuilderFieldUsageBucketKey = ({
  field,
  parentId,
}: IBuilderFieldUsageBucketKeyArgs): string => {
  const scope = resolveBuilderFieldUsageLimitScope(field);
  const key = resolveBuilderFieldUsageLimitKey(field);

  return `${scope}:${key}:${scope === 'parent' ? parentId || ROOT_SCOPE_KEY : 'all'}`;
};

export const getBuilderFieldUsageCount = ({
  data,
  fields,
  field,
  parentId,
  excludeRuleId,
}: IBuilderFieldUsageCountArgs): number => {
  const bucketKey = createBuilderFieldUsageBucketKey({ field, parentId });

  return data.reduce((count, node) => {
    if (!('field' in node) || !node.field || node.id === excludeRuleId) {
      return count;
    }

    const matchingField = fields.find((fieldItem) => fieldItem.field === node.field);

    if (!matchingField) {
      return count;
    }

    return createBuilderFieldUsageBucketKey({
      field: matchingField,
      parentId: node.parent,
    }) === bucketKey
      ? count + 1
      : count;
  }, 0);
};

export const isBuilderFieldUsageExhausted = ({
  data,
  fields,
  field,
  parentId,
  excludeRuleId,
}: IBuilderFieldUsageAvailabilityArgs): boolean => {
  if (!field.usageLimit) {
    return false;
  }

  return (
    getBuilderFieldUsageCount({
      data,
      fields,
      field,
      parentId,
      excludeRuleId,
    }) >= field.usageLimit.max
  );
};

export const canAddRuleForParent = (
  data: NormalizedQuery,
  fields: IBuilderFieldProps[],
  parentId?: string
): boolean =>
  fields.some(
    (field) =>
      !isBuilderFieldUsageExhausted({
        data,
        fields,
        field,
        parentId,
      })
  );

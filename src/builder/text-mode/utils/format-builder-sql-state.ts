import { IBuilderFieldProps } from '../../types';
import {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
  IDenormalizedRuleNode,
  QueryGroupValue,
} from '../../../utils/query-tree';
import {
  getGroupReadOnlyTargets,
  isGroupFullyReadOnly,
  resolveGroupReadOnly,
} from '../../../utils/resolve-group-read-only.util';
import { isGroupNode } from '../../../query-formats/sql/shared';
import { IBuilderTextModeSqlState } from '../types/builder-text-mode-sql-state';
import {
  createRuleReadOnlyProtectedRanges,
  ILocalProtectedRange,
} from './create-rule-read-only-protected-ranges.util';

interface IFragmentResult {
  text: string;
  protectedRanges: ILocalProtectedRange[];
}

const shiftRanges = (
  ranges: ILocalProtectedRange[],
  offset: number
): ILocalProtectedRange[] =>
  ranges.map(range => ({
    start: range.start + offset,
    end: range.end + offset,
  }));

const formatRuleFragment = (
  rule: IDenormalizedRuleNode,
  fields: IBuilderFieldProps[]
): IFragmentResult => createRuleReadOnlyProtectedRanges(rule, fields);

const formatGroupFragment = (
  group: DenormalizedGroupNode,
  fields: IBuilderFieldProps[],
  isRoot: boolean
): IFragmentResult => {
  const combinator =
    'value' in group && group.value ? group.value : ('AND' as QueryGroupValue);
  const childFragments = group.children
    .map(child => formatNodeFragment(child, fields, false))
    .filter(fragment => fragment.text.trim().length > 0);
  const groupReadOnly = resolveGroupReadOnly(group.readOnly);
  const groupReadOnlyTargets = getGroupReadOnlyTargets(group.readOnly);

  if (childFragments.length === 0) {
    return {
      text: '',
      protectedRanges: [],
    };
  }

  let innerText = '';
  let innerRanges: ILocalProtectedRange[] = [];
  const combinatorRanges: ILocalProtectedRange[] = [];

  if (childFragments.length === 1) {
    innerText = childFragments[0].text;
    innerRanges = childFragments[0].protectedRanges;
  } else {
    innerText = '(';

    childFragments.forEach((fragment, index) => {
      if (index > 0) {
        const separator = ` ${combinator} `;
        const separatorStart = innerText.length;
        const combinatorStart = separatorStart + 1;

        innerText += separator;
        combinatorRanges.push({
          start: combinatorStart,
          end: combinatorStart + combinator.length,
        });
      }

      innerRanges.push(...shiftRanges(fragment.protectedRanges, innerText.length));
      innerText += fragment.text;
    });

    innerText += ')';
  }

  const needsWrapping = !(innerText.startsWith('(') && innerText.endsWith(')'));
  const wrappedInner = needsWrapping ? `(${innerText})` : innerText;
  const wrappingOffset = needsWrapping ? 1 : 0;
  let text = wrappedInner;
  let protectedRanges = shiftRanges(innerRanges, wrappingOffset);

  if (
    groupReadOnlyTargets.includes('combinator') &&
    !groupReadOnly.inheritToChildren
  ) {
    protectedRanges.push(...shiftRanges(combinatorRanges, wrappingOffset));
  }

  if ('isNegated' in group && group.isNegated) {
    text = `NOT ${wrappedInner}`;
    protectedRanges = shiftRanges(protectedRanges, 4);

    if (
      groupReadOnlyTargets.includes('negation') &&
      !groupReadOnly.inheritToChildren
    ) {
      protectedRanges.push({
        start: 0,
        end: 4,
      });
    }
  }

  if (groupReadOnly.inheritToChildren && isGroupFullyReadOnly(group.readOnly)) {
    protectedRanges = [
      {
        start: 0,
        end: text.length,
      },
    ];
  }

  if (isRoot) {
    return {
      text,
      protectedRanges,
    };
  }

  return {
    text,
    protectedRanges,
  };
};

const formatNodeFragment = (
  node: DenormalizedNode,
  fields: IBuilderFieldProps[],
  isRoot: boolean
): IFragmentResult =>
  isGroupNode(node)
    ? formatGroupFragment(node, fields, isRoot)
    : formatRuleFragment(node, fields);

export const formatBuilderSqlState = (
  data: DenormalizedQuery,
  fields: IBuilderFieldProps[]
): IBuilderTextModeSqlState => {
  const fragments = data
    .map(node => formatNodeFragment(node, fields, true))
    .filter(fragment => fragment.text.trim().length > 0);

  if (fragments.length === 0) {
    return {
      value: '',
      protectedRanges: [],
    };
  }

  let value = '';
  const protectedRanges: ILocalProtectedRange[] = [];

  fragments.forEach((fragment, index) => {
    if (index > 0) {
      value += ' AND ';
    }

    protectedRanges.push(...shiftRanges(fragment.protectedRanges, value.length));
    value += fragment.text;
  });

  return {
    value,
    protectedRanges,
  };
};

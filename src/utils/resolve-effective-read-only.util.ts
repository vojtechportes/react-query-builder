import {
  GroupReadOnly,
  GroupReadOnlyTarget,
  RuleReadOnly,
  RuleReadOnlyTarget,
} from './query-tree';
import {
  getGroupReadOnlyTargets,
  isGroupFullyReadOnly,
  resolveGroupReadOnly,
} from './resolve-group-read-only.util';
import {
  getRuleReadOnlyTargets,
  isRuleFullyReadOnly,
} from './resolve-rule-read-only.util';

export interface IInheritedReadOnlyState {
  full: boolean;
  groupTargets: GroupReadOnlyTarget[];
}

export interface IEffectiveGroupReadOnlyState {
  full: boolean;
  targets: GroupReadOnlyTarget[];
  inherited: IInheritedReadOnlyState;
}

export interface IEffectiveRuleReadOnlyState {
  full: boolean;
  targets: RuleReadOnlyTarget[];
}

const mergeUniqueTargets = <TTarget extends string>(
  currentTargets: TTarget[],
  nextTargets: TTarget[]
): TTarget[] => Array.from(new Set([...currentTargets, ...nextTargets]));

export const resolveEffectiveGroupReadOnly = (
  value: GroupReadOnly | undefined,
  inheritedReadOnly: IInheritedReadOnlyState
): IEffectiveGroupReadOnlyState => {
  const resolvedReadOnly = resolveGroupReadOnly(value);
  const ownFullReadOnly = isGroupFullyReadOnly(value);
  const ownTargets = getGroupReadOnlyTargets(value);
  const fullReadOnly = inheritedReadOnly.full || ownFullReadOnly;
  const targets: GroupReadOnlyTarget[] = fullReadOnly
    ? ['negation', 'combinator']
    : mergeUniqueTargets(inheritedReadOnly.groupTargets, ownTargets);
  const nextInheritedFull =
    inheritedReadOnly.full ||
    (resolvedReadOnly.inheritToChildren && ownFullReadOnly);
  const inherited = nextInheritedFull
    ? {
        full: true,
        groupTargets: ['negation', 'combinator'] as GroupReadOnlyTarget[],
      }
    : {
        full: false,
        groupTargets: mergeUniqueTargets(
          inheritedReadOnly.groupTargets,
          resolvedReadOnly.inheritToChildren ? ownTargets : []
        ),
      };

  return {
    full: fullReadOnly,
    targets,
    inherited,
  };
};

export const resolveEffectiveRuleReadOnly = (
  value: RuleReadOnly | undefined,
  inheritedReadOnly: IInheritedReadOnlyState
): IEffectiveRuleReadOnlyState => {
  const ownFullReadOnly = isRuleFullyReadOnly(value);
  const fullReadOnly = inheritedReadOnly.full || ownFullReadOnly;

  return {
    full: fullReadOnly,
    targets: fullReadOnly ? ['field', 'operator', 'value'] : getRuleReadOnlyTargets(value),
  };
};

export const createInheritedReadOnlyState = (): IInheritedReadOnlyState => ({
  full: false,
  groupTargets: [],
});

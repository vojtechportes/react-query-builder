import {
  RuleReadOnly,
  RuleReadOnlyTarget,
} from '../../../shared/query/model/types/query-tree';
import { getRuleReadOnlyTargets } from './resolve-rule-read-only.util';

export const isRuleReadOnlyTarget = (
  value: RuleReadOnly | undefined,
  target: RuleReadOnlyTarget
): boolean => getRuleReadOnlyTargets(value).includes(target);

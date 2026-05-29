import {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
  GroupReadOnlyTarget,
  IDenormalizedRuleNode,
  RuleReadOnlyTarget,
} from '../../../utils/query-tree';
import { clone } from '../../../utils/clone.util';
import { QueryOperator } from '../../../utils/query-operators';
import { resolveGroupReadOnly } from '../../../utils/resolve-group-read-only.util';
import {
  getRuleReadOnlyTargets,
  isRuleFullyReadOnly,
} from '../../../utils/resolve-rule-read-only.util';

interface ILockedNodeDescriptor {
  kind: 'rule' | 'group-all' | 'group-self';
  fingerprint: string;
  relaxedFingerprint?: string;
  readOnly: DenormalizedNode['readOnly'];
}

interface INodeCandidate {
  fingerprint: string;
  node: DenormalizedNode;
}

const normalizeLockFingerprintOperator = (
  operator: QueryOperator | undefined
): QueryOperator | undefined => {
  switch (operator) {
    case 'ALL_IN':
    case 'ANY_IN':
    case 'IN':
      return 'IN';
    case 'LIKE':
    case 'CONTAINS':
      return 'CONTAINS';
    case 'NOT_LIKE':
    case 'NOT_CONTAINS':
      return 'NOT_CONTAINS';
    default:
      return operator;
  }
};

const createExactFingerprint = (node: DenormalizedNode): string => {
  if ('type' in node && node.type === 'GROUP') {
    return JSON.stringify({
      type: 'GROUP',
      value: node.value,
      isNegated: node.isNegated,
      children: node.children.map(createExactFingerprint),
    });
  }

  return JSON.stringify({
    field: ('field' in node ? node.field : ''),
    operator:
      'operator' in node
        ? normalizeLockFingerprintOperator(node.operator)
        : undefined,
    value: 'value' in node ? node.value : undefined,
  });
};

const createGroupShellFingerprint = (group: DenormalizedGroupNode): string =>
  JSON.stringify({
    type: 'GROUP',
    value: group.value,
    isNegated: group.isNegated,
    childCount: group.children.length,
  });

const createRuleReadOnlyFingerprint = (
  node: DenormalizedNode,
  targets: RuleReadOnlyTarget[]
): string =>
  JSON.stringify({
    field: 'field' in node && targets.includes('field') ? node.field : undefined,
    operator:
      'operator' in node && targets.includes('operator')
        ? normalizeLockFingerprintOperator(node.operator)
        : undefined,
    value: 'value' in node && targets.includes('value') ? node.value : undefined,
  });

const createGroupReadOnlyFingerprint = (
  group: DenormalizedGroupNode,
  targets: GroupReadOnlyTarget[]
): string =>
  JSON.stringify({
    type: 'GROUP',
    value: targets.includes('combinator') ? group.value : undefined,
    isNegated: targets.includes('negation') ? group.isNegated : undefined,
  });

const getRuleCandidateRelaxedFingerprint = (
  node: DenormalizedNode,
  readOnly: DenormalizedNode['readOnly']
): string =>
  createRuleReadOnlyFingerprint(
    node,
    getRuleReadOnlyTargets(readOnly as never)
  );

const getGroupCandidateRelaxedFingerprint = (
  node: DenormalizedGroupNode,
  readOnly: DenormalizedNode['readOnly']
): string =>
  createGroupReadOnlyFingerprint(
    node,
    resolveGroupReadOnly(readOnly as never).targets || []
  );

const collectLockedNodeDescriptors = (
  query: DenormalizedQuery,
  target: ILockedNodeDescriptor[] = []
): ILockedNodeDescriptor[] => {
  query.forEach(node => {
    if ('type' in node && node.type === 'GROUP') {
      const groupReadOnly = resolveGroupReadOnly(node.readOnly);

      if (groupReadOnly.enabled) {
        const isFullGroupLock =
          !groupReadOnly.targets || groupReadOnly.targets.length === 0;

        target.push({
          kind: groupReadOnly.inheritToChildren ? 'group-all' : 'group-self',
          fingerprint: groupReadOnly.inheritToChildren
            ? createExactFingerprint(node)
            : createGroupShellFingerprint(node),
          relaxedFingerprint:
            groupReadOnly.inheritToChildren || isFullGroupLock || !groupReadOnly.targets
              ? undefined
              : createGroupReadOnlyFingerprint(node, groupReadOnly.targets),
          readOnly: node.readOnly,
        });
      }

      collectLockedNodeDescriptors(node.children, target);
      return;
    }

    if (node.readOnly) {
      const ruleNode = node as IDenormalizedRuleNode;
      const ruleReadOnlyTargets = getRuleReadOnlyTargets(ruleNode.readOnly);

      target.push({
        kind: 'rule',
        fingerprint: createExactFingerprint(ruleNode),
        relaxedFingerprint:
          isRuleFullyReadOnly(ruleNode.readOnly) || ruleReadOnlyTargets.length === 0
            ? undefined
            : createRuleReadOnlyFingerprint(ruleNode, ruleReadOnlyTargets),
        readOnly: ruleNode.readOnly,
      });
    }
  });

  return target;
};

const collectNodeCandidates = (
  query: DenormalizedQuery,
  candidates: Record<ILockedNodeDescriptor['kind'], INodeCandidate[]> = {
    rule: [],
    'group-all': [],
    'group-self': [],
  }
): Record<ILockedNodeDescriptor['kind'], INodeCandidate[]> => {
  query.forEach(node => {
    if ('type' in node && node.type === 'GROUP') {
      candidates['group-all'].push({
        fingerprint: createExactFingerprint(node),
        node,
      });
      candidates['group-self'].push({
        fingerprint: createGroupShellFingerprint(node),
        node,
      });
      collectNodeCandidates(node.children, candidates);
      return;
    }

    candidates.rule.push({
      fingerprint: createExactFingerprint(node),
      node,
    });
  });

  return candidates;
};

const applyReadOnlyValue = (
  node: DenormalizedNode,
  readOnly: DenormalizedNode['readOnly']
): void => {
  node.readOnly = readOnly as never;
};

export const reapplyBuilderTextModeLocks = (
  previousQuery: DenormalizedQuery,
  nextQuery: DenormalizedQuery
): DenormalizedQuery => {
  const lockedNodes = collectLockedNodeDescriptors(previousQuery);

  if (lockedNodes.length === 0) {
    return nextQuery;
  }

  const clonedNextQuery = clone(nextQuery);
  const candidates = collectNodeCandidates(clonedNextQuery);
  const usedCandidates = new WeakSet<DenormalizedNode>();

  lockedNodes.forEach(descriptor => {
    const candidatePool = candidates[descriptor.kind];
    const candidate =
      candidatePool.find(
        entry =>
          entry.fingerprint === descriptor.fingerprint &&
          !usedCandidates.has(entry.node)
      ) ??
      (descriptor.relaxedFingerprint
        ? candidatePool.find(entry => {
            if (usedCandidates.has(entry.node)) {
              return false;
            }

            const relaxedFingerprint =
              descriptor.kind === 'rule'
                ? getRuleCandidateRelaxedFingerprint(
                    entry.node,
                    descriptor.readOnly
                  )
                : getGroupCandidateRelaxedFingerprint(
                    entry.node as DenormalizedGroupNode,
                    descriptor.readOnly
                  );

            return relaxedFingerprint === descriptor.relaxedFingerprint;
          })
        : undefined);

    if (!candidate) {
      return;
    }

    applyReadOnlyValue(candidate.node, descriptor.readOnly);
    usedCandidates.add(candidate.node);
  });

  return clonedNextQuery;
};

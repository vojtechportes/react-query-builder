import {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
  GroupReadOnlyTarget,
  IDenormalizedRuleNode,
  RuleReadOnlyTarget,
} from '../../../utils/query-tree';
import { QueryOperator } from '../../../utils/query-operators';
import { resolveGroupReadOnly } from '../../../utils/resolve-group-read-only.util';
import {
  getRuleReadOnlyTargets,
  isRuleFullyReadOnly,
} from '../../../utils/resolve-rule-read-only.util';

export interface IReadOnlyNodeDescriptor {
  kind: 'rule' | 'group-all' | 'group-self';
  fingerprint: string;
  relaxedFingerprint?: string;
  readOnly: DenormalizedNode['readOnly'];
  path: number[];
  parentPath: number[];
  parentGroupFingerprint?: string;
}

export interface INodeCandidate {
  kind: IReadOnlyNodeDescriptor['kind'];
  fingerprint: string;
  node: DenormalizedNode;
  path: number[];
  parentPath: number[];
  parentGroupFingerprint?: string;
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

const isSamePath = (left: number[], right: number[]): boolean =>
  left.length === right.length && left.every((segment, index) => segment === right[index]);

const getSiblingDistance = (
  descriptor: IReadOnlyNodeDescriptor,
  candidate: INodeCandidate
): number => {
  const descriptorIndex = descriptor.path[descriptor.path.length - 1] ?? 0;
  const candidateIndex = candidate.path[candidate.path.length - 1] ?? 0;

  return Math.abs(descriptorIndex - candidateIndex);
};

const findCandidate = (
  descriptor: IReadOnlyNodeDescriptor,
  candidates: INodeCandidate[],
  usedCandidates: WeakSet<DenormalizedNode>,
  matcher: (candidate: INodeCandidate) => boolean
): INodeCandidate | undefined => {
  const samePathCandidate = candidates.find(
    candidate =>
      !usedCandidates.has(candidate.node) &&
      isSamePath(candidate.path, descriptor.path) &&
      matcher(candidate)
  );

  if (samePathCandidate) {
    return samePathCandidate;
  }

  const siblingCandidates = candidates
    .filter(
      candidate =>
        !usedCandidates.has(candidate.node) &&
        isSamePath(candidate.parentPath, descriptor.parentPath) &&
        matcher(candidate)
    )
    .sort(
      (left, right) =>
        getSiblingDistance(descriptor, left) - getSiblingDistance(descriptor, right)
    );

  return siblingCandidates[0];
};

const findUniqueGlobalCandidate = (
  candidates: INodeCandidate[],
  usedCandidates: WeakSet<DenormalizedNode>,
  matcher: (candidate: INodeCandidate) => boolean
): INodeCandidate | undefined => {
  const matchingCandidates = candidates.filter(
    candidate => !usedCandidates.has(candidate.node) && matcher(candidate)
  );

  return matchingCandidates.length === 1 ? matchingCandidates[0] : undefined;
};

const findCandidateByParentGroupFingerprint = (
  descriptor: IReadOnlyNodeDescriptor,
  candidates: INodeCandidate[],
  usedCandidates: WeakSet<DenormalizedNode>,
  matcher: (candidate: INodeCandidate) => boolean
): INodeCandidate | undefined => {
  if (!descriptor.parentGroupFingerprint) {
    return undefined;
  }

  const matchingCandidates = candidates
    .filter(
      candidate =>
        !usedCandidates.has(candidate.node) &&
        candidate.parentGroupFingerprint === descriptor.parentGroupFingerprint &&
        matcher(candidate)
    )
    .sort(
      (left, right) =>
        getSiblingDistance(descriptor, left) - getSiblingDistance(descriptor, right)
    );

  return matchingCandidates[0];
};

export const collectReadOnlyNodeDescriptors = (
  query: DenormalizedQuery,
  target: IReadOnlyNodeDescriptor[] = [],
  parentPath: number[] = [],
  parentGroup?: DenormalizedGroupNode
): IReadOnlyNodeDescriptor[] => {
  query.forEach((node, index) => {
    const path = [...parentPath, index];

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
          path,
          parentPath,
          parentGroupFingerprint: parentGroup
            ? createExactFingerprint(parentGroup)
            : undefined,
        });
      }

      collectReadOnlyNodeDescriptors(node.children, target, path, node);
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
        path,
        parentPath,
        parentGroupFingerprint: parentGroup
          ? createExactFingerprint(parentGroup)
          : undefined,
      });
    }
  });

  return target;
};

export const collectReadOnlyNodeCandidates = (
  query: DenormalizedQuery,
  candidates: Record<IReadOnlyNodeDescriptor['kind'], INodeCandidate[]> = {
    rule: [],
    'group-all': [],
    'group-self': [],
  },
  parentPath: number[] = [],
  parentGroup?: DenormalizedGroupNode
): Record<IReadOnlyNodeDescriptor['kind'], INodeCandidate[]> => {
  query.forEach((node, index) => {
    const path = [...parentPath, index];

    if ('type' in node && node.type === 'GROUP') {
      candidates['group-all'].push({
        kind: 'group-all',
        fingerprint: createExactFingerprint(node),
        node,
        path,
        parentPath,
        parentGroupFingerprint: parentGroup
          ? createExactFingerprint(parentGroup)
          : undefined,
      });
      candidates['group-self'].push({
        kind: 'group-self',
        fingerprint: createGroupShellFingerprint(node),
        node,
        path,
        parentPath,
        parentGroupFingerprint: parentGroup
          ? createExactFingerprint(parentGroup)
          : undefined,
      });
      collectReadOnlyNodeCandidates(node.children, candidates, path, node);
      return;
    }

    candidates.rule.push({
      kind: 'rule',
      fingerprint: createExactFingerprint(node),
      node,
      path,
      parentPath,
      parentGroupFingerprint: parentGroup
        ? createExactFingerprint(parentGroup)
        : undefined,
    });
  });

  return candidates;
};

export const matchReadOnlyDescriptorToCandidate = (
  descriptor: IReadOnlyNodeDescriptor,
  candidatePool: INodeCandidate[],
  usedCandidates: WeakSet<DenormalizedNode>
): INodeCandidate | undefined =>
  findCandidate(
    descriptor,
    candidatePool,
    usedCandidates,
    candidate => candidate.fingerprint === descriptor.fingerprint
  ) ||
  findCandidateByParentGroupFingerprint(
    descriptor,
    candidatePool,
    usedCandidates,
    candidate => candidate.fingerprint === descriptor.fingerprint
  ) ||
  findUniqueGlobalCandidate(
    candidatePool,
    usedCandidates,
    candidate => candidate.fingerprint === descriptor.fingerprint
  ) ||
  (descriptor.relaxedFingerprint
    ? findCandidate(
        descriptor,
        candidatePool,
        usedCandidates,
        candidate => {
          const relaxedFingerprint =
            descriptor.kind === 'rule'
              ? getRuleCandidateRelaxedFingerprint(candidate.node, descriptor.readOnly)
              : getGroupCandidateRelaxedFingerprint(
                  candidate.node as DenormalizedGroupNode,
                  descriptor.readOnly
                );

          return relaxedFingerprint === descriptor.relaxedFingerprint;
        }
      )
    || findCandidateByParentGroupFingerprint(
        descriptor,
        candidatePool,
        usedCandidates,
        candidate => {
          const relaxedFingerprint =
            descriptor.kind === 'rule'
              ? getRuleCandidateRelaxedFingerprint(candidate.node, descriptor.readOnly)
              : getGroupCandidateRelaxedFingerprint(
                  candidate.node as DenormalizedGroupNode,
                  descriptor.readOnly
                );

          return relaxedFingerprint === descriptor.relaxedFingerprint;
        }
      )
    || findUniqueGlobalCandidate(
        candidatePool,
        usedCandidates,
        candidate => {
          const relaxedFingerprint =
            descriptor.kind === 'rule'
              ? getRuleCandidateRelaxedFingerprint(candidate.node, descriptor.readOnly)
              : getGroupCandidateRelaxedFingerprint(
                  candidate.node as DenormalizedGroupNode,
                  descriptor.readOnly
                );

          return relaxedFingerprint === descriptor.relaxedFingerprint;
        }
      )
    : undefined);

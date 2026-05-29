import { ITextModeDiagnostic } from '../types/text-mode-diagnostic';
import {
  DenormalizedGroupNode,
  DenormalizedNode,
  DenormalizedQuery,
} from '../../../utils/query-tree';
import {
  createInheritedReadOnlyState,
  IInheritedReadOnlyState,
  resolveEffectiveGroupReadOnly,
} from '../../../utils/resolve-effective-read-only.util';

interface IReadOnlyNegationDescriptor {
  fingerprint: string;
  isNegated: boolean;
}

const createGroupFingerprintWithoutNegation = (
  group: DenormalizedGroupNode
): string =>
  JSON.stringify({
    type: 'GROUP',
    value: group.value,
    children: group.children.map(createNodeFingerprintWithoutNegation),
  });

const createNodeFingerprintWithoutNegation = (
  node: DenormalizedNode
): string => {
  if ('type' in node && node.type === 'GROUP') {
    return createGroupFingerprintWithoutNegation(node);
  }

  return JSON.stringify({
    field: 'field' in node ? node.field : '',
  });
};

const collectReadOnlyNegationDescriptors = (
  query: DenormalizedQuery,
  inheritedReadOnly: IInheritedReadOnlyState = createInheritedReadOnlyState(),
  target: IReadOnlyNegationDescriptor[] = []
): IReadOnlyNegationDescriptor[] => {
  query.forEach((node) => {
    if (!('type' in node) || node.type !== 'GROUP') {
      return;
    }

    const resolvedReadOnly = resolveEffectiveGroupReadOnly(
      node.readOnly,
      inheritedReadOnly
    );

    if (resolvedReadOnly.targets.includes('negation')) {
      target.push({
        fingerprint: createGroupFingerprintWithoutNegation(node),
        isNegated: Boolean(node.isNegated),
      });
    }

    collectReadOnlyNegationDescriptors(
      node.children,
      resolvedReadOnly.inherited,
      target
    );
  });

  return target;
};

const collectCandidateGroups = (
  query: DenormalizedQuery,
  target: Array<DenormalizedGroupNode> = []
): DenormalizedGroupNode[] => {
  query.forEach((node) => {
    if (!('type' in node) || node.type !== 'GROUP') {
      return;
    }

    target.push(node);
    collectCandidateGroups(node.children, target);
  });

  return target;
};

export const findReadOnlyNegationDiagnostic = (
  previousQuery: DenormalizedQuery,
  nextQuery: DenormalizedQuery
): ITextModeDiagnostic | null => {
  const descriptors = collectReadOnlyNegationDescriptors(previousQuery);

  if (descriptors.length === 0) {
    return null;
  }

  const candidates = collectCandidateGroups(nextQuery);

  const hasViolation = descriptors.some((descriptor) => {
    const matchingCandidate = candidates.find(
      (candidate) =>
        createGroupFingerprintWithoutNegation(candidate) === descriptor.fingerprint
    );

    if (!matchingCandidate) {
      return true;
    }

    return Boolean(matchingCandidate.isNegated) !== descriptor.isNegated;
  });

  if (!hasViolation) {
    return null;
  }

  return {
    code: 'readonly_negation',
    message:
      'Negation is read-only for one or more clauses and cannot be changed in text mode.',
    start: 0,
    end: 0,
  };
};

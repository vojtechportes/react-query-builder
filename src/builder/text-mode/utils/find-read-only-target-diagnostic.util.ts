import { ITextModeDiagnostic } from '../types/text-mode-diagnostic';
import { DenormalizedNode, DenormalizedQuery } from '../../../utils/query-tree';
import {
  collectReadOnlyNodeCandidates,
  collectReadOnlyNodeDescriptors,
  matchReadOnlyDescriptorToCandidate,
} from './match-read-only-nodes.util';

const hasOnlyNegationTarget = (readOnly: DenormalizedNode['readOnly']): boolean =>
  Boolean(
    readOnly &&
      typeof readOnly === 'object' &&
      readOnly.enabled &&
      readOnly.targets &&
      readOnly.targets.length === 1 &&
      readOnly.targets[0] === 'negation'
  );

export const findReadOnlyTargetDiagnostic = (
  previousQuery: DenormalizedQuery,
  nextQuery: DenormalizedQuery,
  options: {
    allowProtectedClauseRemoval?: boolean;
  } = {}
): ITextModeDiagnostic | null => {
  const descriptors = collectReadOnlyNodeDescriptors(previousQuery).filter(
    descriptor => !hasOnlyNegationTarget(descriptor.readOnly)
  );

  if (descriptors.length === 0) {
    return null;
  }

  const candidates = collectReadOnlyNodeCandidates(nextQuery);
  const usedCandidates = new WeakSet<DenormalizedNode>();

  const hasViolation = descriptors.some((descriptor) => {
    const candidate = matchReadOnlyDescriptorToCandidate(
      descriptor,
      candidates[descriptor.kind],
      usedCandidates
    );

    if (!candidate) {
      return !options.allowProtectedClauseRemoval;
    }

    usedCandidates.add(candidate.node);
    return false;
  });

  if (!hasViolation) {
    return null;
  }

  return {
    code: 'readonly_target',
    message:
      'One or more read-only clauses cannot be changed or removed in text mode.',
    start: 0,
    end: 0,
  };
};

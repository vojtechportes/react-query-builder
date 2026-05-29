import {
  DenormalizedNode,
  DenormalizedQuery,
} from '../../../utils/query-tree';
import { clone } from '../../../utils/clone.util';
import {
  collectReadOnlyNodeCandidates,
  collectReadOnlyNodeDescriptors,
  matchReadOnlyDescriptorToCandidate,
} from './match-read-only-nodes.util';

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
  const lockedNodes = collectReadOnlyNodeDescriptors(previousQuery);

  if (lockedNodes.length === 0) {
    return nextQuery;
  }

  const clonedNextQuery = clone(nextQuery);
  const candidates = collectReadOnlyNodeCandidates(clonedNextQuery);
  const usedCandidates = new WeakSet<DenormalizedNode>();

  lockedNodes.forEach((descriptor) => {
    const candidate = matchReadOnlyDescriptorToCandidate(
      descriptor,
      candidates[descriptor.kind],
      usedCandidates
    );

    if (!candidate) {
      return;
    }

    applyReadOnlyValue(candidate.node, descriptor.readOnly);
    usedCandidates.add(candidate.node);
  });

  return clonedNextQuery;
};

import * as React from 'react';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
} from '../../../../components/docs-primitives';

export const BuilderRefLockHistoryMethodsApiSection: React.FC = () => (
  <>
    <SectionTitle>Lock and history methods</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>setNodeLock(nodeId, state)</InlineCode>:
        </ItemTitle>{' '}
        Sets the explicit lock state for a rule or group. Groups additionally
        support <InlineCode>'all'</InlineCode> for descendant inheritance.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>lockNode(nodeId, state?)</InlineCode>:
        </ItemTitle>{' '}
        Convenience wrapper for locking a node. For rules, the effective lock
        state is always <InlineCode>'self'</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>unlockNode(nodeId)</InlineCode>:
        </ItemTitle>{' '}
        Clears the node&apos;s lock state while preserving object-based{' '}
        <InlineCode>readOnly.targets</InlineCode> metadata so it can be restored
        by later lock toggles.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>undo()</InlineCode> and <InlineCode>redo()</InlineCode>:
        </ItemTitle>{' '}
        Replay history steps when history is enabled.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>setHistory(history)</InlineCode>:
        </ItemTitle>{' '}
        Replaces the current history state. This is useful for clearing or
        restoring custom history snapshots.
      </li>
    </List>
  </>
);

import * as React from 'react';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
} from '../../../../components/docs-primitives';

export const BuilderRefMutationMethodsApiSection: React.FC = () => (
  <>
    <SectionTitle>Mutation methods</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>cloneNode(nodeId)</InlineCode>:
        </ItemTitle>{' '}
        Clones a rule or group subtree directly below the original node and
        preserves its read-only configuration.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>deleteNode(nodeId)</InlineCode>:
        </ItemTitle>{' '}
        Removes a node subtree unless the node itself or one of its descendants
        is protected by effective read-only state.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>replaceNode(nodeId, node)</InlineCode>:
        </ItemTitle>{' '}
        Replaces a normalized node directly.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>updateNode(nodeId, updater)</InlineCode>:
        </ItemTitle>{' '}
        Reads the current normalized node, passes it to an updater, and replaces
        it with the updater result.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>insertNodes(nodes, index, parentId?)</InlineCode>:
        </ItemTitle>{' '}
        Inserts one or more normalized nodes at the target index, either at the
        root or inside a group.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>addNode(node, parentId?, index?)</InlineCode>:
        </ItemTitle>{' '}
        Inserts one normalized node and appends it when{' '}
        <InlineCode>index</InlineCode> is omitted.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>addGroup(groupType?, parentId?, index?)</InlineCode>:
        </ItemTitle>{' '}
        Creates and inserts a new group node.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>addRule(rule?, parentId?, index?)</InlineCode>:
        </ItemTitle>{' '}
        Creates and inserts a new rule node with optional initial values.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>moveNode(nodeId, index, parentId?)</InlineCode>:
        </ItemTitle>{' '}
        Moves a node to a new index and optional parent group.
      </li>
    </List>
  </>
);

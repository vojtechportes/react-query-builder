import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
  TextLink,
} from '../../../../components/docs-primitives';
import { builderRefSignature } from '../constants/builder-ref-signature';
import { builderRuleDependenciesHookSignature } from '../constants/builder-rule-dependencies-hook-signature';
import { builderRuleOptionsBindingSignature } from '../constants/builder-rule-options-binding-signature';

export const BuilderRefApiContent: React.FC = () => (
  <>
    <CodeBlock
      code={builderRefSignature}
      language="ts"
      label="Builder ref API"
    />
    <CodeBlock
      code={builderRuleDependenciesHookSignature}
      language="ts"
      label="Rule dependencies hook"
    />
    <CodeBlock
      code={builderRuleOptionsBindingSignature}
      language="ts"
      label="Rule options binding"
    />
    <SectionTitle>How to attach it</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>useBuilderRef()</InlineCode>:
        </ItemTitle>{' '}
        Returns a typed React ref controller for the builder instance.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>
            useBuilderRuleDependencies(builderRef, field, dependencyFields)
          </InlineCode>
          :
        </ItemTitle>{' '}
        Returns one dependency snapshot per matching rule and is the recommended
        React-first integration for React Query or similar hook-based data
        layers.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>{'<Builder ref={builderRef} />'}</InlineCode>:
        </ItemTitle>{' '}
        Attaches the ref to the builder so{' '}
        <InlineCode>builderRef.current</InlineCode> exposes the imperative
        methods.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>builderRef.subscribe(listener)</InlineCode>:
        </ItemTitle>{' '}
        Subscribes to builder handle updates. The listener fires immediately
        with the current handle and then again whenever committed builder state
        replaces that handle.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>builderRef.bindRuleOptions(field, config)</InlineCode>:
        </ItemTitle>{' '}
        Automatically hydrates and refreshes rule-scoped options for
        dependency-aware fields. This is the recommended entrypoint when you do
        not need an external query library to own the orchestration, and{' '}
        <InlineCode>onOptionsResolved</InlineCode> is the clean place for
        follow-up work such as explicit value reconciliation.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>
            builderRef.subscribeToRuleDependencies(field, dependencyFields,
            listener)
          </InlineCode>
          :
        </ItemTitle>{' '}
        Subscribes to dependency snapshots for one field. The listener receives
        one entry per matching rule and only re-runs when that rule&apos;s
        dependency context changes.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>
            builderRef.subscribeToFieldOptionState(field, listener)
          </InlineCode>{' '}
          and{' '}
          <InlineCode>
            builderRef.subscribeToRuleOptionState(ruleId, listener)
          </InlineCode>
          :
        </ItemTitle>{' '}
        Subscribe to reactive loading and option snapshots for external UI such
        as badges, spinners, or helper text.
      </li>
    </List>
    <AlertBox title="Reactive option state" variant="info">
      <InlineCode>getFieldOptionState()</InlineCode> and{' '}
      <InlineCode>getRuleOptionState()</InlineCode> return snapshots. Use{' '}
      <InlineCode>subscribeToFieldOptionState()</InlineCode> or{' '}
      <InlineCode>subscribeToRuleOptionState()</InlineCode> when surrounding
      React UI should rerender as the state changes.
    </AlertBox>
    <SectionTitle>Read methods</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>getNodeById(nodeId)</InlineCode>:
        </ItemTitle>{' '}
        Returns one normalized node by id, or <InlineCode>undefined</InlineCode>{' '}
        when it does not exist.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>getNodes()</InlineCode>:
        </ItemTitle>{' '}
        Returns the current normalized query array.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>getData()</InlineCode>:
        </ItemTitle>{' '}
        Returns the current denormalized query tree in the same shape emitted by{' '}
        <InlineCode>onChange</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>getHistory()</InlineCode>:
        </ItemTitle>{' '}
        Returns the current history object with <InlineCode>past</InlineCode>{' '}
        and <InlineCode>future</InlineCode> stacks.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>
            getNearestField(currentNodeId, targetFieldName)
          </InlineCode>
          :
        </ItemTitle>{' '}
        Returns the nearest matching rule in the current ancestor chain. This is
        especially useful for dependency-aware rule options.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>isFieldInUse(field)</InlineCode>:
        </ItemTitle>{' '}
        Returns <InlineCode>true</InlineCode> when at least one rule currently
        targets the given field.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>getFieldOptionState(field)</InlineCode>:
        </ItemTitle>{' '}
        Returns the shared runtime option list and loading status for a field.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>getRuleOptionState(ruleId)</InlineCode>:
        </ItemTitle>{' '}
        Returns the rule-scoped runtime option list and loading status for one
        rule instance.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>bindRuleOptions(field, config)</InlineCode>:
        </ItemTitle>{' '}
        Resolves dependency-aware options, sets <InlineCode>loading</InlineCode>
        , <InlineCode>success</InlineCode>, and <InlineCode>error</InlineCode>{' '}
        states, aborts stale requests, and clears removed rules automatically.
        Use <InlineCode>onOptionsResolved</InlineCode> when you want to run
        post-load logic such as{' '}
        <InlineCode>reconcileRuleValueWithOptions(...)</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>
            subscribeToRuleDependencies(field, dependencyFields, listener)
          </InlineCode>
          :
        </ItemTitle>{' '}
        Emits dependency entries such as the nearest country for every city
        rule, which is ideal for dependency-aware dynamic options.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>subscribeToFieldOptionState(field, listener)</InlineCode>{' '}
          and{' '}
          <InlineCode>subscribeToRuleOptionState(ruleId, listener)</InlineCode>:
        </ItemTitle>{' '}
        Emit reactive option-state snapshots so external UI can reflect{' '}
        <InlineCode>idle</InlineCode>, <InlineCode>loading</InlineCode>,{' '}
        <InlineCode>success</InlineCode>, or <InlineCode>error</InlineCode>{' '}
        without waiting for unrelated renders.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>
            reconcileRuleValueWithOptions(ruleId, {'{'} strategy {'}'} )
          </InlineCode>
          :
        </ItemTitle>{' '}
        Reconciles the current rule value against the effective option list. The
        built-in <InlineCode>clear-if-missing</InlineCode> strategy is useful
        when a value should be cleared once it is no longer available after a
        dependency-driven reload.
      </li>
    </List>
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
    <SectionTitle>Field Option Methods</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>setFieldOptions(field, options)</InlineCode>:
        </ItemTitle>{' '}
        Replaces the shared runtime option set for a field without changing the
        original <InlineCode>fields</InlineCode> prop.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>setFieldOptionsStatus(field, status)</InlineCode>:
        </ItemTitle>{' '}
        Stores a shared option loading state of <InlineCode>'idle'</InlineCode>,{' '}
        <InlineCode>'loading'</InlineCode>, <InlineCode>'success'</InlineCode>,
        or <InlineCode>'error'</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>invalidateFieldOptions(field)</InlineCode>:
        </ItemTitle>{' '}
        Clears the shared runtime cache and falls back to the static options
        defined in <InlineCode>field.value</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>reloadFieldOptions(field)</InlineCode>:
        </ItemTitle>{' '}
        Invalidates the shared runtime cache and then calls{' '}
        <InlineCode>onFieldOptionsReload(field)</InlineCode> so the surrounding
        app can trigger a refetch.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>clearFieldOptions(field)</InlineCode>:
        </ItemTitle>{' '}
        Removes the shared runtime option state entirely.
      </li>
    </List>
    <SectionTitle>Rule Option Methods</SectionTitle>
    <List>
      <li>
        <ItemTitle>
          <InlineCode>setRuleOptions(ruleId, options)</InlineCode>:
        </ItemTitle>{' '}
        Replaces the runtime option set for one specific rule instance.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>setRuleOptionsStatus(ruleId, status)</InlineCode>:
        </ItemTitle>{' '}
        Stores a loading state for one specific rule instance.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>invalidateRuleOptions(ruleId)</InlineCode>:
        </ItemTitle>{' '}
        Clears the rule-scoped runtime cache and falls back to field-scoped or
        static options.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>reloadRuleOptions(ruleId)</InlineCode>:
        </ItemTitle>{' '}
        Invalidates the rule-scoped runtime cache and then calls{' '}
        <InlineCode>onRuleOptionsReload(ruleId)</InlineCode>.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>clearRuleOptions(ruleId)</InlineCode>:
        </ItemTitle>{' '}
        Removes the rule-scoped runtime option state entirely.
      </li>
      <li>
        <ItemTitle>
          <InlineCode>
            reconcileRuleValueWithOptions(ruleId, {'{'} strategy:
            'clear-if-missing' {'}'})
          </InlineCode>
          :
        </ItemTitle>{' '}
        Compares the current rule value against the effective option list for
        that rule and clears missing selections explicitly instead of doing it
        automatically on every reload.
      </li>
    </List>
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
    <AlertBox title="Documentation" variant="info">
      <TextLink to="/documentation/builder-ref">Builder Ref</TextLink>,{' '}
      <TextLink to="/documentation/dynamic-field-options">
        Dynamic Field Options
      </TextLink>
      , <TextLink to="/documentation/history">Undo and Redo</TextLink>, and{' '}
      <TextLink to="/api/builder">Builder</TextLink>.
    </AlertBox>
  </>
);

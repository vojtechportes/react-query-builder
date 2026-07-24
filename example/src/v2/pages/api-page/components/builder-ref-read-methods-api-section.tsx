import * as React from 'react';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
} from '../../../../components/docs-primitives';

export const BuilderRefReadMethodsApiSection: React.FC = () => (
  <>
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
  </>
);

import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
} from '../../../../components/docs-primitives';

export const BuilderRefAttachmentApiSection: React.FC = () => (
  <>
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
  </>
);

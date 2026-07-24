import * as React from 'react';
import {
  InlineCode,
  ItemTitle,
  List,
  SectionTitle,
} from '../../../../components/docs-primitives';

export const BuilderRefRuleOptionMethodsApiSection: React.FC = () => (
  <>
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
  </>
);

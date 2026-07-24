import * as React from 'react';
import { AlertBox } from '../../../../../../components/alert-box';
import { CodeBlock } from '../../../../../../components/code-block';
import { ClientOnly } from '../../../../../../components/client-only';
import { loadImperativeFieldOptionsDemo } from '../../../utils/load-imperative-field-options-demo.util';
import { loadSharedFieldOptionsDemo } from '../../../utils/load-shared-field-options-demo.util';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../../../components/docs-primitives';
import { dynamicFieldOptionsSnippet } from '../constants/dynamic-field-options-snippet';
import { dynamicFieldOptionsReloadSnippet } from '../constants/dynamic-field-options-reload-snippet';
import { dynamicRuleOptionsSnippet } from '../constants/dynamic-rule-options-snippet';
import { dynamicFieldOptionsReactQuerySnippet } from '../constants/dynamic-field-options-react-query-snippet';

export const DynamicFieldOptionsDocumentationContent: React.FC = () => (
  <>
    <p>
      Keep the <InlineCode>fields</InlineCode> array stable and push runtime
      options through <InlineCode>builderRef</InlineCode>. The important choice
      is scope: field-level APIs are for shared options, while rule-level APIs
      are for dependency-aware options.
    </p>
    <SectionTitle>Choose The Scope</SectionTitle>
    <List>
      <li>
        <InlineCode>field.value</InlineCode> still defines the initial static
        option set and remains the backwards-compatible fallback.
      </li>
      <li>
        Field-level methods such as{' '}
        <InlineCode>setFieldOptions(field, options)</InlineCode> are for dynamic
        data where every rule of the same field should share the same option
        set.
      </li>
      <li>
        Rule-level methods such as{' '}
        <InlineCode>setRuleOptions(ruleId, options)</InlineCode> are for
        internal or external dependencies where each rule instance may need
        different options.
      </li>
      <li>
        <InlineCode>getNearestField(currentNodeId, targetFieldName)</InlineCode>{' '}
        helps dependent rules resolve the closest matching context, such as the
        nearest country for a city rule.
      </li>
      <li>
        <InlineCode>builderRef.bindRuleOptions(field, config)</InlineCode> is
        the simplest way to hydrate dependency-aware options and keep them in
        sync with the nearest matching rules.
      </li>
      <li>
        <InlineCode>
          builderRef.subscribeToRuleDependencies(field, dependencyFields,
          listener)
        </InlineCode>{' '}
        stays available when you want to own the orchestration yourself.
      </li>
      <li>
        <InlineCode>
          useBuilderRuleDependencies(builderRef, field, dependencyFields)
        </InlineCode>{' '}
        is the easiest React entrypoint when you want to feed dependency-aware
        rules into <InlineCode>useQueries()</InlineCode> or other hook-based
        data layers.
      </li>
      <li>
        <InlineCode>builderRef.subscribeToFieldOptionState(...)</InlineCode> and{' '}
        <InlineCode>builderRef.subscribeToRuleOptionState(...)</InlineCode> let
        external UI react to loading and success state when you need it.
      </li>
      <li>
        <InlineCode>onFieldChange</InlineCode> is useful for targeted reactive
        reloads when one dependency should refresh only a subset of rules.
      </li>
    </List>
    <SectionTitle>Field-Level API</SectionTitle>
    <p>
      Use the field-level imperative API when all rules of a field should share
      one runtime option set. This is a good fit for globally shared dynamic
      data such as statuses, assignees, or categories.
    </p>
    <CodeBlock
      code={dynamicFieldOptionsSnippet}
      language="tsx"
      label="Shared field options"
    />
    <CodeBlock
      code={dynamicFieldOptionsReloadSnippet}
      language="tsx"
      label="Field-level reload flow"
    />
    <p>
      In this example both <InlineCode>CITY</InlineCode> rules update together
      because the runtime options are stored at field scope.
    </p>
    <p>
      The live example exposes that field-scoped state through{' '}
      <InlineCode>
        builderRef.subscribeToFieldOptionState('CITY', listener)
      </InlineCode>
      .
    </p>
    <ClientOnly
      loader={loadSharedFieldOptionsDemo}
      label="Loading the shared field-options demo..."
      minHeight="18rem"
    />
    <SectionTitle>Rule-Level API</SectionTitle>
    <p>
      Use the rule-level imperative API when options depend on other rules or on
      surrounding app state. This is the right fit for repeated dependencies
      such as <InlineCode>COUNTRY -&gt; CITY</InlineCode> in multiple groups.
    </p>
    <CodeBlock
      code={dynamicRuleOptionsSnippet}
      language="tsx"
      label="Dependency-aware rule options"
    />
    <p>
      This example binds each <InlineCode>CITY</InlineCode> rule to the nearest{' '}
      <InlineCode>COUNTRY</InlineCode> rule. Initial hydration and later
      dependency changes are handled by{' '}
      <InlineCode>builderRef.bindRuleOptions(...)</InlineCode>.
    </p>
    <p>
      The extra{' '}
      <InlineCode>builderRef.reconcileRuleValueWithOptions(...)</InlineCode>{' '}
      call is optional and useful when you want strict select semantics, such as
      clearing a now-invalid city after the nearest country changes.
    </p>
    <ClientOnly
      loader={loadImperativeFieldOptionsDemo}
      label="Loading the imperative field-options demo..."
      minHeight="18rem"
    />
    <SectionTitle>TanStack React Query Example</SectionTitle>
    <p>
      If your app already uses TanStack React Query, keep caching there and use
      the builder only for rule lookup and option storage. For dependency-heavy
      cases, <InlineCode>useBuilderRuleDependencies(...)</InlineCode> fits
      naturally with <InlineCode>useQueries(...)</InlineCode>.
    </p>
    <CodeBlock
      code={dynamicFieldOptionsReactQuerySnippet}
      language="tsx"
      label="Rule-level React Query integration"
    />
    <p>
      The reconciliation call in the success branch is optional. Keep it when
      you want strict select semantics and remove it when the selected value may
      stay valid even if the currently loaded option slice does not include it
      yet.
    </p>
    <AlertBox title="API reference" variant="info">
      <TextLink to="/api/builder-ref">Builder Ref</TextLink>,{' '}
      <TextLink to="/api/builder">Builder</TextLink>, and{' '}
      <TextLink to="/api/fields">Fields</TextLink>.
    </AlertBox>
  </>
);

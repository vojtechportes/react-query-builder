import * as React from 'react';
import { AlertBox } from '../../../../components/alert-box';
import { CodeBlock } from '../../../../components/code-block';
import { ClientOnly } from '../../../../components/client-only';
import { loadImperativeFieldOptionsDemo } from '../utils/load-imperative-field-options-demo.util';
import { loadSharedFieldOptionsDemo } from '../utils/load-shared-field-options-demo.util';
import {
  InlineCode,
  List,
  SectionTitle,
  TextLink,
} from '../../../../components/docs-primitives';
import type { IDocumentationPage } from '../types/documentation-page';

const dynamicFieldOptionsSnippet = `import React, { useCallback, useEffect, useState } from 'react';
import {
  Builder,
  useBuilderRef,
  type DenormalizedQuery,
  type IBuilderFieldOptionState,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'CITY',
    label: 'City',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [
      { value: 'PRG', label: 'Prague' },
      { value: 'BTS', label: 'Bratislava' },
    ],
  },
];

export const SharedFieldOptionsExample = () => {
  const [data, setData] = useState<DenormalizedQuery>([
    {
      type: 'GROUP',
      value: 'AND',
      isNegated: false,
      children: [
        { field: 'CITY', operator: 'EQUAL', value: 'PRG' },
        { field: 'CITY', operator: 'EQUAL', value: 'BTS' },
      ],
    },
  ]);
  const [cityOptionState, setCityOptionState] = useState<IBuilderFieldOptionState>({
    options: fields[0].value ?? [],
    status: 'idle',
  });
  const builderRef = useBuilderRef();

  useEffect(() => builderRef.subscribeToFieldOptionState('CITY', setCityOptionState), [
    builderRef,
  ]);

  const loadSharedCities = useCallback((scope: 'CZ' | 'SK' | 'DE') => {
    builderRef.current?.setFieldOptionsStatus('CITY', 'loading');

    window.setTimeout(() => {
      if (scope === 'CZ') {
        builderRef.current?.setFieldOptions('CITY', [
          { value: 'PRG', label: 'Prague' },
          { value: 'BRN', label: 'Brno' },
          { value: 'OSR', label: 'Ostrava' },
        ]);
        return;
      }

      if (scope === 'SK') {
        builderRef.current?.setFieldOptions('CITY', [
          { value: 'BTS', label: 'Bratislava' },
          { value: 'KSC', label: 'Kosice' },
          { value: 'ZIL', label: 'Zilina' },
        ]);
        return;
      }

      builderRef.current?.setFieldOptions(
        'CITY',
        [
          { value: 'BER', label: 'Berlin' },
          { value: 'MUC', label: 'Munich' },
          { value: 'HAM', label: 'Hamburg' },
        ]
      );
    }, 500);
  }, [builderRef]);

  return (
    <>
      <button type="button" onClick={() => loadSharedCities('CZ')}>
        Load Czech cities
      </button>
      <p>
        Field state: {cityOptionState.status} ({cityOptionState.options.length} options)
      </p>
      <Builder ref={builderRef} fields={fields} data={data} onChange={setData} />
    </>
  );
};`;

const dynamicFieldOptionsReloadSnippet = `const builderRef = useBuilderRef();

<Builder
  ref={builderRef}
  fields={fields}
  data={data}
  onFieldOptionsReload={(field) => {
    if (field === 'CITY') {
      loadSharedCities('CZ');
    }
  }}
  onChange={setData}
/>;

builderRef.current?.reloadFieldOptions('CITY');`;

const dynamicRuleOptionsSnippet = `import React, { useEffect, useState } from 'react';
import {
  Builder,
  useBuilderRef,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'COUNTRY',
    label: 'Country',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
      { value: 'DE', label: 'Germany' },
    ],
  },
  {
    field: 'CITY',
    label: 'City',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [],
  },
];

const initialData: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'COUNTRY', operator: 'EQUAL', value: 'CZ' },
          { field: 'CITY', operator: 'EQUAL', value: 'PRG' },
        ],
      },
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'COUNTRY', operator: 'EQUAL', value: 'SK' },
          { field: 'CITY', operator: 'EQUAL', value: 'BTS' },
        ],
      },
    ],
  },
];

export const RuleScopedOptionsExample = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);
  const builderRef = useBuilderRef();

  useEffect(() => {
    return builderRef.bindRuleOptions('CITY', {
      dependencies: ['COUNTRY'],
      resolve: async ({ dependencies, signal }) => {
        const countryValue = dependencies.COUNTRY?.value;

        if (typeof countryValue !== 'string') {
          return [];
        }

        const response = await fetch(
          \`/api/cities?country=\${countryValue}\`,
          { signal }
        );
        const cities = await response.json();

        return cities.data.map(
          (city: { code: string; name: string }) => ({
            value: city.code,
            label: city.name,
          })
        );
      },
      onOptionsResolved: ({ ruleId }) => {
        builderRef.reconcileRuleValueWithOptions(ruleId, {
          strategy: 'clear-if-missing',
        });
      },
    });
  }, [builderRef]);

  return (
    <Builder
      ref={builderRef}
      fields={fields}
      data={data}
      onChange={setData}
    />
  );
};`;

const dynamicFieldOptionsReactQuerySnippet = `import React, { useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
  Builder,
  useBuilderRef,
  useBuilderRuleDependencies,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';

const fields: IBuilderFieldProps[] = [
  {
    field: 'COUNTRY',
    label: 'Country',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
    ],
  },
  {
    field: 'CITY',
    label: 'City',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [],
  },
];

export const ReactQueryOptionsExample = () => {
  const [data, setData] = useState<DenormalizedQuery>(initialData);
  const builderRef = useBuilderRef();
  const cityEntries = useBuilderRuleDependencies(
    builderRef,
    'CITY',
    ['COUNTRY']
  );

  const cityQueries = useQueries({
    queries: cityEntries.map((entry) => {
      const countryValue = entry.dependencies.COUNTRY?.value;
      const country =
        typeof countryValue === 'string' ? countryValue : undefined;

      return {
        queryKey: ['cities', entry.ruleId, country],
        queryFn: () => loadCities(country as string),
        enabled: Boolean(country),
      };
    }),
  });

  useEffect(() => {
    cityEntries.forEach((entry, index) => {
      const countryValue = entry.dependencies.COUNTRY?.value;
      const query = cityQueries[index];

      if (!builderRef.current || !query) {
        return;
      }

      if (typeof countryValue !== 'string') {
        builderRef.current.clearRuleOptions(entry.ruleId);
        return;
      }

      if (query.status === 'pending') {
        builderRef.current.setRuleOptionsStatus(entry.ruleId, 'loading');
        return;
      }

      if (query.status === 'error') {
        builderRef.current.setRuleOptionsStatus(entry.ruleId, 'error');
        return;
      }

      builderRef.current.setRuleOptions(
        entry.ruleId,
        query.data.data.map(({ code, city }) => ({
          value: code,
          label: city,
        }))
      );
      builderRef.current.reconcileRuleValueWithOptions(entry.ruleId, {
        strategy: 'clear-if-missing',
      });
    });
  }, [builderRef, cityEntries, cityQueries]);

  return (
    <Builder
      ref={builderRef}
      fields={fields}
      data={data}
      onChange={setData}
    />
  );
};`;

export const dynamicFieldOptionsDocumentationPage: IDocumentationPage = {
  path: '/documentation/dynamic-field-options',
  title: 'Dynamic Field Options',
  sectionKey: 'getting-started',
  sectionTitle: 'Getting Started',
  summary: '',
  description:
    'Documentation for field-scoped and rule-scoped imperative list options, including shared-option and dependency-aware live demos plus a TanStack React Query example.',
  searchText:
    'dynamic field options builderRef subscribe subscribeToRuleDependencies useBuilderRuleDependencies setFieldOptions setRuleOptions getNearestField invalidateFieldOptions invalidateRuleOptions clearFieldOptions clearRuleOptions getFieldOptionState getRuleOptionState onFieldChange onRuleOptionsReload tanstack react-query async select options live demo',
  content: (
    <>
      <p>
        Keep the <InlineCode>fields</InlineCode> array stable and push runtime
        options through <InlineCode>builderRef</InlineCode>. The important
        choice is scope: field-level APIs are for shared options, while
        rule-level APIs are for dependency-aware options.
      </p>
      <SectionTitle>Choose The Scope</SectionTitle>
      <List>
        <li>
          <InlineCode>field.value</InlineCode> still defines the initial static
          option set and remains the backwards-compatible fallback.
        </li>
        <li>
          Field-level methods such as{' '}
          <InlineCode>setFieldOptions(field, options)</InlineCode> are for
          dynamic data where every rule of the same field should share the same
          option set.
        </li>
        <li>
          Rule-level methods such as{' '}
          <InlineCode>setRuleOptions(ruleId, options)</InlineCode> are for
          internal or external dependencies where each rule instance may need
          different options.
        </li>
        <li>
          <InlineCode>
            getNearestField(currentNodeId, targetFieldName)
          </InlineCode>{' '}
          helps dependent rules resolve the closest matching context, such as
          the nearest country for a city rule.
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
          <InlineCode>builderRef.subscribeToFieldOptionState(...)</InlineCode>{' '}
          and{' '}
          <InlineCode>builderRef.subscribeToRuleOptionState(...)</InlineCode>{' '}
          let external UI react to loading and success state when you need it.
        </li>
        <li>
          <InlineCode>onFieldChange</InlineCode> is useful for targeted reactive
          reloads when one dependency should refresh only a subset of rules.
        </li>
      </List>
      <SectionTitle>Field-Level API</SectionTitle>
      <p>
        Use the field-level imperative API when all rules of a field should
        share one runtime option set. This is a good fit for globally shared
        dynamic data such as statuses, assignees, or categories.
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
        Use the rule-level imperative API when options depend on other rules or
        on surrounding app state. This is the right fit for repeated
        dependencies such as <InlineCode>COUNTRY -&gt; CITY</InlineCode> in
        multiple groups.
      </p>
      <CodeBlock
        code={dynamicRuleOptionsSnippet}
        language="tsx"
        label="Dependency-aware rule options"
      />
      <p>
        This example binds each <InlineCode>CITY</InlineCode> rule to the
        nearest <InlineCode>COUNTRY</InlineCode> rule. Initial hydration and
        later dependency changes are handled by{' '}
        <InlineCode>builderRef.bindRuleOptions(...)</InlineCode>.
      </p>
      <p>
        The extra{' '}
        <InlineCode>builderRef.reconcileRuleValueWithOptions(...)</InlineCode>{' '}
        call is optional and useful when you want strict select semantics, such
        as clearing a now-invalid city after the nearest country changes.
      </p>
      <ClientOnly
        loader={loadImperativeFieldOptionsDemo}
        label="Loading the imperative field-options demo..."
        minHeight="18rem"
      />
      <SectionTitle>TanStack React Query Example</SectionTitle>
      <p>
        If your app already uses TanStack React Query, keep caching there and
        use the builder only for rule lookup and option storage. For
        dependency-heavy cases,{' '}
        <InlineCode>useBuilderRuleDependencies(...)</InlineCode> fits naturally
        with <InlineCode>useQueries(...)</InlineCode>.
      </p>
      <CodeBlock
        code={dynamicFieldOptionsReactQuerySnippet}
        language="tsx"
        label="Rule-level React Query integration"
      />
      <p>
        The reconciliation call in the success branch is optional. Keep it when
        you want strict select semantics and remove it when the selected value
        may stay valid even if the currently loaded option slice does not
        include it yet.
      </p>
      <AlertBox title="API reference" variant="info">
        <TextLink to="/api/builder-ref">Builder Ref</TextLink>,{' '}
        <TextLink to="/api/builder">Builder</TextLink>, and{' '}
        <TextLink to="/api/fields">Fields</TextLink>.
      </AlertBox>
    </>
  ),
};

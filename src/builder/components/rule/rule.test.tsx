import React, { ReactElement } from 'react';
import { readFileSync } from 'fs';
import { join } from 'path';
import { renderToString } from 'react-dom/server';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../..';
import { BuilderContext } from '../../context';
import { strings } from '../../../shared/localization/locales/en-us';
import { Rule } from './rule';
import ruleStyles from './rule.module.css';
import { Rule as RuleContainer } from './components/rule-container';
import ruleContainerStyles from './components/rule-container/rule-container.module.css';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD_1',
    label: 'Mock Field',
    operators: ['EQUAL'],
    type: 'BOOLEAN',
  },
  {
    field: 'MOCK_FIELD_2',
    label: 'Mock Field 2',
    operators: ['EQUAL', 'IS_NULL'],
    type: 'TEXT',
  },
  {
    field: 'MOCK_FIELD_3',
    label: 'Mock Field 3',
    operators: ['EQUAL'],
    type: 'DATE',
  },
  {
    field: 'MOCK_FIELD_4',
    label: 'Mock Field 4',
    operators: ['EQUAL'],
    type: 'NUMBER',
  },
  {
    field: 'MOCK_FIELD_5',
    label: 'Mock Field 5',
    operators: ['EQUAL'],
    type: 'STATEMENT',
  },
  {
    field: 'MOCK_FIELD_6',
    label: 'Mock Field 6',
    operators: ['EQUAL'],
    type: 'LIST',
    value: [{ label: 'Text value', value: 'text-value' }],
    fieldComparison: { type: 'string' },
  },
  {
    field: 'MOCK_FIELD_7',
    label: 'Mock Field 7',
    operators: ['EQUAL'],
    type: 'MULTI_LIST',
    value: [{ label: 'Multi value', value: 'multi-value' }],
  },
  {
    field: 'MOCK_FIELD_8',
    label: 'Mock Field 8',
    operators: ['EQUAL'],
    type: 'TEXT',
  },
];
const data: any[] = [
  {
    type: 'GROUP',
    value: 'AND',
    id: 'test-1',
    isNegated: false,
    children: ['test-2'],
  },
  {
    field: 'MOCK_FIELD_1',
    value: true,
    id: 'test-2',
    parent: 'test-1',
  },
  {
    field: 'MOCK_FIELD_2',
    value: '',
    id: 'test-3',
    parent: 'test-1',
  },
  {
    field: 'MOCK_FIELD_2',
    operator: 'IS_NULL',
    id: 'test-10',
    parent: 'test-1',
  },
  {
    field: 'MOCK_FIELD_3',
    value: '',
    id: 'test-4',
    parent: 'test-1',
  },
  {
    field: 'MOCK_FIELD_4',
    value: '',
    id: 'test-5',
    parent: 'test-1',
  },
  {
    field: 'MOCK_FIELD_5',
    value: '',
    id: 'test-6',
    parent: 'test-1',
  },
  {
    field: 'MOCK_FIELD_6',
    value: '',
    id: 'test-7',
    parent: 'test-1',
  },
  {
    field: 'MOCK_FIELD_7',
    value: '',
    id: 'test-8',
    parent: 'test-1',
  },
];

const renderWithContext = (
  element: ReactElement,
  overrides?: Partial<
    React.ComponentProps<typeof BuilderContext.Provider>['value']
  >
) =>
  render(
    <BuilderContext.Provider
      value={{
        components,
        fields,
        data,
        strings,
        setData: jest.fn(),
        onChange: jest.fn(),
        dispatchAction: jest.fn(),
        readOnly: false,
        ...overrides,
      }}
    >
      {element}
    </BuilderContext.Provider>
  );

describe('#components/Rule', () => {
  it('renders in editable and read-only modes', () => {
    const editable = renderWithContext(
      <Rule id="test-2" field="MOCK_FIELD_1" />
    );
    const readOnly = renderWithContext(
      <Rule id="test-2" field="MOCK_FIELD_1" />,
      {
        readOnly: true,
      }
    );

    expect(editable.container.firstChild).toBeTruthy();
    expect(readOnly.container.firstChild).toBeTruthy();
  });

  it('renders all supported rule widget variants', () => {
    const { container } = renderWithContext(
      <>
        <Rule data-test="Rule[0]" id="test-2" field="" />
        <Rule data-test="Rule[1]" id="test-2" field="MOCK_FIELD_1" />
        <Rule data-test="Rule[2]" id="test-3" field="MOCK_FIELD_2" />
        <Rule data-test="Rule[3]" id="test-4" field="MOCK_FIELD_3" />
        <Rule data-test="Rule[4]" id="test-5" field="MOCK_FIELD_4" />
        <Rule data-test="Rule[5]" id="test-6" field="MOCK_FIELD_5" />
        <Rule data-test="Rule[6]" id="test-7" field="MOCK_FIELD_6" />
        <Rule data-test="Rule[7]" id="test-8" field="MOCK_FIELD_7" />
        <Rule
          data-test="Rule[8]"
          id="test-9"
          field="SOME_FIELD_THAT_DOESNT_EXISTS"
        />
        <Rule
          data-test="Rule[9]"
          id="test-10"
          field="MOCK_FIELD_2"
          operator="IS_NULL"
        />
      </>
    );

    for (let index = 0; index < 8; index += 1) {
      expect(
        container.querySelector(`[data-test="Rule[${index}]"]`)
      ).toBeTruthy();
    }

    expect(
      container.querySelector(
        '[data-test="Rule[9]"] [data-test="SelectMultiTrigger"]'
      )
    ).toBeTruthy();
    expect(
      container.querySelectorAll(
        '[data-test="Rule[9]"] input[type="text"], [data-test="Rule[9]"] input[type="date"], [data-test="Rule[9]"] input[type="number"]'
      )
    ).toHaveLength(0);
    expect(container.querySelector('[data-test="Rule[8]"]')).toBeNull();
  });

  it('deletes a rule through the delete control', () => {
    const dispatchAction = jest.fn();
    const { getByRole } = renderWithContext(
      <Rule data-test="Rule[1]" id="test-2" field="MOCK_FIELD_1" />,
      { dispatchAction }
    );

    fireEvent.click(getByRole('button', { name: 'Delete' }));

    expect(dispatchAction).toHaveBeenCalled();
  });

  it('renders nothing when strings are unavailable', () => {
    const { container } = renderWithContext(<Rule id="test-9" field="" />, {
      strings: {},
    });

    expect(container.firstChild).toBeNull();
  });

  it('hides the delete control when the rule is locally read-only', () => {
    const { queryByRole } = renderWithContext(
      <Rule id="test-2" field="MOCK_FIELD_1" readOnly />
    );

    expect(queryByRole('button', { name: 'Delete' })).toBeNull();
  });

  it('hides the delete control when the rule has targeted read-only fields', () => {
    const { queryByRole } = renderWithContext(
      <Rule id="test-2" field="MOCK_FIELD_1" operator="EQUAL" value={true} />,
      {
        data: [
          {
            type: 'GROUP',
            value: 'AND',
            id: 'test-1',
            isNegated: false,
            children: ['test-2'],
          },
          {
            field: 'MOCK_FIELD_1',
            value: true,
            operator: 'EQUAL',
            id: 'test-2',
            parent: 'test-1',
            readOnly: {
              enabled: true,
              targets: ['field'],
            },
          },
        ] as any,
      }
    );

    expect(queryByRole('button', { name: 'Delete' })).toBeNull();
  });

  it('keeps targeted rule controls visible but disables only the targeted inputs', () => {
    const { container } = renderWithContext(
      <Rule
        id="test-2"
        field="MOCK_FIELD_1"
        operator="EQUAL"
        value={true}
        readOnlyTargets={['operator', 'value']}
      />
    );

    expect(
      container.querySelector('#query-builder-rule-test-2-field-trigger')
    ).not.toHaveAttribute('disabled');
    expect(
      container.querySelector('#query-builder-rule-test-2-operator-trigger')
    ).toHaveAttribute('disabled');
    expect(container.querySelector('[data-test="Switch"]')).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('renders value-source and value-field selectors for field comparisons', () => {
    const { container } = renderWithContext(
      <>
        <Rule
          id="test-3"
          field="MOCK_FIELD_2"
          operator="EQUAL"
          valueSource="field"
          valueField="MOCK_FIELD_8"
        />
        <Rule
          id="test-7"
          field="MOCK_FIELD_6"
          operator="EQUAL"
          valueSource="field"
          valueField="MOCK_FIELD_8"
        />
      </>,
      {
        allowFieldComparisons: true,
      }
    );

    expect(
      container.querySelector('#query-builder-rule-test-3-value-source-trigger')
    ).toBeTruthy();
    expect(
      container.querySelector('#query-builder-rule-test-3-value-field-trigger')
    ).toBeTruthy();
    expect(
      container.querySelector('#query-builder-rule-test-7-value-source-trigger')
    ).toBeTruthy();
    expect(
      container.querySelector('#query-builder-rule-test-7-value-field-trigger')
    ).toBeTruthy();
  });
});

describe('#components/Rule CSS Module presentation', () => {
  it.each([
    [false, false],
    [true, false],
    [false, true],
    [true, true],
  ])(
    'maps dragHandle=%s controls=%s to finite container state',
    (hasDragHandle, hasControls) => {
      const { container } = render(
        <RuleContainer
          dragHandle={hasDragHandle ? <span data-test="drag" /> : null}
          controls={hasControls ? <button type="button">Control</button> : null}
          className="incoming-rule"
          data-test="rule-container"
        >
          Content
        </RuleContainer>
      );
      const rule = container.firstElementChild as HTMLElement;
      const content = rule.children[hasDragHandle ? 1 : 0] as HTMLElement;

      expect(rule).toHaveClass(ruleContainerStyles.rule, 'incoming-rule');
      expect(rule.classList.contains(ruleContainerStyles.withDragHandle)).toBe(
        hasDragHandle
      );
      expect(rule.classList.contains(ruleContainerStyles.withControls)).toBe(
        hasControls
      );
      expect(rule).toHaveAttribute(
        'data-rule-has-drag-handle',
        String(hasDragHandle)
      );
      expect(rule).toHaveAttribute(
        'data-rule-has-controls',
        String(hasControls)
      );
      expect(content).toHaveClass(ruleContainerStyles.content);
      expect(
        content.classList.contains(ruleContainerStyles.contentWithoutControls)
      ).toBe(!hasControls);
      expect(
        Boolean(rule.querySelector(`.${ruleContainerStyles.controls}`))
      ).toBe(hasControls);
    }
  );

  it('maps rule layout, comparison, validation, and read-only state classes', () => {
    const { container } = renderWithContext(
      <Rule
        id="test-3"
        field="MOCK_FIELD_2"
        operator="EQUAL"
        valueSource="field"
        valueField="MOCK_FIELD_8"
        readOnly
      />,
      {
        allowFieldComparisons: true,
        showValidation: true,
        validation: {
          isValid: false,
          issues: [
            {
              ruleId: 'test-3',
              field: 'MOCK_FIELD_2',
              code: 'required',
              message: 'Value is required',
            },
          ],
          issuesByRuleId: {
            'test-3': [
              {
                ruleId: 'test-3',
                field: 'MOCK_FIELD_2',
                code: 'required',
                message: 'Value is required',
              },
            ],
          },
        },
      }
    );
    const rule = container.firstElementChild as HTMLElement;

    expect(rule).toHaveClass(ruleContainerStyles.rule, ruleStyles.readOnly);
    expect(rule.querySelector(`.${ruleStyles.fieldsContent}`)).toBeTruthy();
    expect(rule.querySelectorAll(`.${ruleStyles.layoutItem}`)).toHaveLength(2);
    expect(rule.querySelector(`.${ruleStyles.valueContent}`)).toBeTruthy();
    expect(rule.querySelector(`.${ruleStyles.valueEditorGrid}`)).toBeTruthy();
    expect(
      rule.querySelector(`.${ruleStyles.validationIssues}`)
    ).toHaveTextContent('Value is required');
  });

  it('renders range and multi-value editor shapes', () => {
    const { container } = renderWithContext(
      <>
        <Rule
          data-test="date-range"
          id="test-4"
          field="MOCK_FIELD_3"
          operator="EQUAL"
          value={['2025-01-01', '2025-01-31']}
        />
        <Rule
          data-test="multi-value"
          id="test-8"
          field="MOCK_FIELD_7"
          operator="EQUAL"
          value={['multi-value']}
        />
      </>
    );

    expect(
      container.querySelector(
        '[data-test="date-range"] [data-range-inputs="true"]'
      )
    ).toBeTruthy();
    expect(
      container.querySelectorAll('[data-test="date-range"] input[type="date"]')
    ).toHaveLength(2);
    expect(
      container.querySelector(
        '[data-test="multi-value"] [data-test="SelectMultiTrigger"]'
      )
    ).toBeTruthy();
  });

  it('preserves custom rule-container composition', () => {
    const CustomRule = jest.fn(
      ({
        children,
        className,
        controls,
        dragHandle,
      }: React.ComponentProps<typeof RuleContainer>) => (
        <section className={className} data-custom-rule="true">
          {dragHandle}
          {children}
          {controls}
        </section>
      )
    );
    const { container } = renderWithContext(
      <Rule
        id="test-2"
        field="MOCK_FIELD_1"
        operator="EQUAL"
        value
        readOnly
        dragHandle={<span data-test="custom-drag" />}
      />,
      {
        components: { ...defaultComponents, Rule: CustomRule },
      }
    );

    expect(CustomRule).toHaveBeenCalled();
    expect(container.querySelector('[data-custom-rule="true"]')).toHaveClass(
      ruleStyles.readOnly
    );
    expect(container.querySelector('[data-test="custom-drag"]')).toBeTruthy();
  });

  it('renders rule modules on the server without styled-components output', () => {
    const markup = renderToString(
      <BuilderContext.Provider
        value={{
          components,
          fields,
          data,
          strings,
          setData: jest.fn(),
          onChange: jest.fn(),
          dispatchAction: jest.fn(),
          readOnly: false,
        }}
      >
        <Rule
          id="test-3"
          field="MOCK_FIELD_2"
          operator="EQUAL"
          value="server"
        />
      </BuilderContext.Provider>
    );

    expect(markup).toContain('data-rule-has-drag-handle="false"');
    expect(markup).toContain(ruleStyles.fieldsContent);
    expect(markup).not.toContain('data-styled');
    expect(markup).not.toContain('$theme');
  });

  it('defines extracted token, grid, validation, and responsive rules', () => {
    const ruleCss = readFileSync(join(__dirname, 'rule.module.css'), 'utf8');
    const containerCss = readFileSync(
      join(
        __dirname,
        'components',
        'rule-container',
        'rule-container.module.css'
      ),
      'utf8'
    );

    expect(containerCss).toContain(
      'background-color: var(--query-builder-color-white)'
    );
    expect(containerCss).toContain(
      'border: 1px solid var(--query-builder-color-grey-300)'
    );
    expect(containerCss).toContain('.withDragHandle.withControls');
    expect(containerCss).toContain('@media (max-width: 900px)');
    expect(ruleCss).toContain('grid-template-columns: minmax(0, 1.35fr)');
    expect(ruleCss).toContain('--query-builder-control-min-width: 0px');
    expect(ruleCss).toContain('min-width: 0');
    expect(ruleCss).toContain(
      'color: var(--query-builder-color-error-primary)'
    );
    expect(ruleCss).toContain('@media (max-width: 900px)');
    expect(ruleCss).toContain('grid-column: 1 / -1');
  });
});

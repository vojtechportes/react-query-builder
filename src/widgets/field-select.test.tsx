import React, { ReactElement } from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../builder';
import { BuilderContext } from '../builder-context';
import { FieldSelect } from './field-select';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  { field: 'MOCK_FIELD_1', label: 'Mock Field', type: 'BOOLEAN' },
  { field: 'MOCK_FIELD_2', label: 'Mock Field', type: 'DATE', operators: ['BETWEEN'] },
  { field: 'MOCK_FIELD_3', label: 'Mock Field', type: 'DATE', operators: ['LARGER'] },
  {
    field: 'MOCK_FIELD_4',
    label: 'Mock Field',
    type: 'TEXT',
    operators: ['EQUAL'],
    fieldComparison: { type: 'string' },
  },
  {
    field: 'MOCK_FIELD_5',
    label: 'Mock Field',
    type: 'TEXT',
    operators: ['BETWEEN'],
    fieldComparison: { type: 'string' },
  },
  { field: 'MOCK_FIELD_6', label: 'Mock Field', type: 'NUMBER', operators: ['EQUAL'] },
  { field: 'MOCK_FIELD_7', label: 'Mock Field', type: 'NUMBER', operators: ['BETWEEN'] },
  {
    field: 'MOCK_FIELD_8',
    label: 'Mock Field',
    type: 'LIST',
    operators: ['EQUAL'],
    value: [{ label: 'test', value: 'test' }],
    fieldComparison: { type: 'string' },
  },
  {
    field: 'MOCK_FIELD_9',
    label: 'Mock Field',
    type: 'MULTI_LIST',
    value: [{ label: 'test', value: 'test' }],
  },
  {
    field: 'MOCK_FIELD_10',
    label: 'Mock Field',
    type: 'STATEMENT',
    value: 'test',
  },
];
const data: any[] = [{ id: 'test', field: 'MOCK_FIELD_1', value: false }];

const getByDataTest = (container: HTMLElement, value: string): HTMLElement => {
  const element = container.querySelector(`[data-test="${value}"]`);

  if (!element) {
    throw new Error(`Unable to find element with data-test="${value}"`);
  }

  return element as HTMLElement;
};

const renderWithContext = (
  element: ReactElement,
  overrides?: Partial<React.ComponentProps<typeof BuilderContext.Provider>['value']>
) =>
  render(
    <BuilderContext.Provider
      value={{
        components,
        fields,
        data,
        strings: { form: {} },
        setData: jest.fn(),
        onChange: jest.fn(),
        readOnly: false,
        ...overrides,
      }}
    >
      {element}
    </BuilderContext.Provider>
  );

describe('#components/Widgets/FieldSelect', () => {
  it('renders in editable and read-only modes', () => {
    const editable = renderWithContext(<FieldSelect id="test" selectedValue="" />);
    const readOnly = renderWithContext(<FieldSelect id="test" selectedValue="" />, {
      readOnly: true,
    });

    expect(editable.container.firstChild).toBeTruthy();
    expect(readOnly.container.firstChild).toBeTruthy();
  });

  it('cycles through the available fields', () => {
    const { container } = renderWithContext(
      <FieldSelect id="test" selectedValue="" />
    );

    for (const item of fields) {
      fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
      fireEvent.click(getByDataTest(container, `SelectMultiOption[${item.field}]`));
    }

    expect(container.firstChild).toBeTruthy();
  });

  it('falls back to the default form components when custom ones are unavailable', () => {
    const { container } = renderWithContext(
      <FieldSelect id="test" selectedValue="" />,
      { components: {} as IBuilderComponentsProps }
    );

    expect(container.querySelector('[data-test="SelectMultiTrigger"]')).toBeTruthy();
  });

  it('disables exhausted field options while keeping the current selection available', () => {
    const limitedFields: IBuilderFieldProps[] = [
      {
        field: 'MOCK_FIELD_1',
        label: 'Mock Field 1',
        type: 'BOOLEAN',
        usageLimit: { max: 1 },
      },
      {
        field: 'MOCK_FIELD_2',
        label: 'Mock Field 2',
        type: 'DATE',
        operators: ['BETWEEN'],
        usageLimit: { max: 1 },
      },
    ];
    const limitedData: any[] = [
      {
        id: 'group-1',
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: ['rule-1', 'rule-2'],
      },
      { id: 'rule-1', field: 'MOCK_FIELD_1', value: false, parent: 'group-1' },
      { id: 'rule-2', field: 'MOCK_FIELD_2', value: '', parent: 'group-1' },
    ];
    const { container } = renderWithContext(
      <FieldSelect id="rule-2" selectedValue="MOCK_FIELD_2" />,
      {
        data: limitedData,
        fields: limitedFields,
      }
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));

    expect(
      getByDataTest(container, 'SelectMultiOption[MOCK_FIELD_1]').hasAttribute(
        'disabled'
      )
    ).toBe(true);
    expect(
      getByDataTest(container, 'SelectMultiOption[MOCK_FIELD_2]').hasAttribute(
        'disabled'
      )
    ).toBe(false);
  });

  it('preserves field-comparison mode when the next field still supports it', () => {
    const onFieldChange = jest.fn();
    const fieldComparisonData: any[] = [
      {
        id: 'test',
        field: 'MOCK_FIELD_4',
        operator: 'EQUAL',
        valueSource: 'field',
        valueField: 'MOCK_FIELD_5',
      },
    ];
    const { container } = renderWithContext(
      <FieldSelect id="test" selectedValue="MOCK_FIELD_4" />,
      {
        data: fieldComparisonData,
        allowFieldComparisons: true,
        onFieldChange,
      }
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[MOCK_FIELD_8]'));

    expect(onFieldChange).toHaveBeenCalledWith(
      expect.objectContaining({
        field: 'MOCK_FIELD_8',
        previousValueSource: 'field',
        previousValueField: 'MOCK_FIELD_5',
        valueSource: 'field',
        valueField: 'MOCK_FIELD_5',
        data: [
          {
            field: 'MOCK_FIELD_8',
            operator: 'EQUAL',
            valueSource: 'field',
            valueField: 'MOCK_FIELD_5',
          },
        ],
      })
    );
  });

  it('emits source metadata when changing a field from a field-comparison rule', () => {
    const onFieldChange = jest.fn();
    const fieldComparisonData: any[] = [
      {
        id: 'test',
        field: 'MOCK_FIELD_4',
        operator: 'EQUAL',
        valueSource: 'field',
        valueField: 'MOCK_FIELD_5',
      },
    ];
    const { container } = renderWithContext(
      <FieldSelect id="test" selectedValue="MOCK_FIELD_4" />,
      {
        data: fieldComparisonData,
        onFieldChange,
      }
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[MOCK_FIELD_1]'));

    expect(onFieldChange).toHaveBeenCalledWith(
      expect.objectContaining({
        field: 'MOCK_FIELD_1',
        previousValueSource: 'field',
        previousValueField: 'MOCK_FIELD_5',
        valueSource: 'value',
        value: false,
        data: [
          {
            field: 'MOCK_FIELD_1',
            valueSource: 'value',
            value: false,
          },
        ],
      })
    );
  });
});

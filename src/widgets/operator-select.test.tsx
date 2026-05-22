import React, { ReactElement } from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../builder';
import { BuilderContext } from '../builder-context';
import {
  OperatorSelect,
  IOperatorSelectValuesProps,
} from './operator-select';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  { field: 'MOCK_FIELD_1', label: 'Mock Field', type: 'TEXT' },
  { field: 'MOCK_FIELD_2', label: 'Mock Field', type: 'NUMBER', operators: [] },
];
const data: any[] = [
  { field: 'MOCK_FIELD_1', id: 'test-1', value: 'Test' },
  { field: 'MOCK_FIELD_2', id: 'test-2', value: 'Test' },
  { field: 'MOCK_FIELD_2', id: 'test-3', value: [1, 2], operator: 'NOT_BETWEEN' },
];

const operatorSelectValues: IOperatorSelectValuesProps[][] = [
  [
    { value: 'BETWEEN', label: 'Test' },
    { value: 'ALL_IN', label: 'Test' },
    { value: 'ANY_IN', label: 'Test' },
  ],
  [{ value: 'ALL_IN', label: 'Test' }, { value: 'ANY_IN', label: 'Test' }],
  [{ value: 'IS_NULL', label: 'Test' }, { value: 'IS_NOT_NULL', label: 'Test' }],
];

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

describe('#components/Widgets/OperatorSelect', () => {
  it('renders in editable and read-only modes', () => {
    const editable = renderWithContext(
      <OperatorSelect id="test-1" values={operatorSelectValues[0]} />
    );
    const readOnly = renderWithContext(
      <OperatorSelect id="test-1" values={operatorSelectValues[0]} />,
      { readOnly: true }
    );

    expect(editable.container.firstChild).toBeTruthy();
    expect(readOnly.container.firstChild).toBeTruthy();
  });

  it('switches to BETWEEN for text fields', () => {
    const { container } = renderWithContext(
      <OperatorSelect id="test-1" values={operatorSelectValues[0]} />
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[BETWEEN]'));

    expect(container.firstChild).toBeTruthy();
  });

  it('switches to ALL_IN when BETWEEN is not first', () => {
    const { container } = renderWithContext(
      <OperatorSelect id="test-1" values={operatorSelectValues[1]} />
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[ALL_IN]'));

    expect(container.firstChild).toBeTruthy();
  });

  it('resets NUMBER values correctly when switching to BETWEEN', () => {
    const onChange = jest.fn();
    const { container } = renderWithContext(
      <OperatorSelect id="test-2" values={operatorSelectValues[0]} />,
      { onChange }
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[BETWEEN]'));

    expect(onChange).toHaveBeenCalledWith([
      { field: 'MOCK_FIELD_1', id: 'test-1', value: 'Test' },
      { field: 'MOCK_FIELD_2', id: 'test-2', value: [0, 0], operator: 'BETWEEN' },
      { field: 'MOCK_FIELD_2', id: 'test-3', value: [1, 2], operator: 'NOT_BETWEEN' },
    ]);
  });

  it('keeps NUMBER scalar values when switching to ALL_IN', () => {
    const onChange = jest.fn();
    const { container } = renderWithContext(
      <OperatorSelect id="test-2" values={operatorSelectValues[1]} />,
      { onChange }
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[ALL_IN]'));

    expect(onChange).toHaveBeenCalledWith([
      { field: 'MOCK_FIELD_1', id: 'test-1', value: 'Test' },
      { field: 'MOCK_FIELD_2', id: 'test-2', value: 'Test', operator: 'ALL_IN' },
      { field: 'MOCK_FIELD_2', id: 'test-3', value: [1, 2], operator: 'NOT_BETWEEN' },
    ]);
  });

  it('converts NOT_BETWEEN values back to a scalar when needed', () => {
    const onChange = jest.fn();
    const { container } = renderWithContext(
      <OperatorSelect id="test-3" values={operatorSelectValues[1]} />,
      { onChange }
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[ALL_IN]'));

    expect(onChange).toHaveBeenCalledWith([
      { field: 'MOCK_FIELD_1', id: 'test-1', value: 'Test' },
      { field: 'MOCK_FIELD_2', id: 'test-2', value: 'Test' },
      { field: 'MOCK_FIELD_2', id: 'test-3', value: 0, operator: 'ALL_IN' },
    ]);
  });

  it('falls back to the default form components when custom ones are unavailable', () => {
    const { container } = renderWithContext(
      <OperatorSelect id="test-1" values={operatorSelectValues[0]} />,
      { components: {} as IBuilderComponentsProps }
    );

    expect(container.querySelector('[data-test="SelectMultiTrigger"]')).toBeTruthy();
  });

  it('clears the value when switching to IS_NULL', () => {
    const onChange = jest.fn();
    const { container } = renderWithContext(
      <OperatorSelect id="test-1" values={operatorSelectValues[2]} />,
      { onChange }
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[IS_NULL]'));

    expect(onChange).toHaveBeenCalledWith([
      { field: 'MOCK_FIELD_1', id: 'test-1', operator: 'IS_NULL' },
      { field: 'MOCK_FIELD_2', id: 'test-2', value: 'Test' },
      { field: 'MOCK_FIELD_2', id: 'test-3', value: [1, 2], operator: 'NOT_BETWEEN' },
    ]);
  });
});

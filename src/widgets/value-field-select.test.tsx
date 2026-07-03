import React, { ReactElement } from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../builder';
import { BuilderContext } from '../builder-context';
import { ValueFieldSelect } from './value-field-select';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  { field: 'TEXT_A', label: 'Text A', type: 'TEXT', operators: ['EQUAL'] },
  { field: 'TEXT_B', label: 'Text B', type: 'TEXT', operators: ['EQUAL'] },
  { field: 'TEXT_C', label: 'Text C', type: 'TEXT', operators: ['EQUAL'] },
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
        data: [
          {
            id: 'test',
            field: 'TEXT_A',
            operator: 'EQUAL',
            valueSource: 'field',
            valueField: 'TEXT_B',
          },
        ] as any,
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

describe('#components/Widgets/ValueFieldSelect', () => {
  it('changes the referenced comparison field', () => {
    const onChange = jest.fn();
    const onFieldChange = jest.fn();
    const { container } = renderWithContext(
      <ValueFieldSelect
        id="test"
        selectedValue="TEXT_B"
        compatibleFields={[fields[1], fields[2]]}
      />,
      { onChange, onFieldChange }
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[TEXT_C]'));

    expect(onChange).toHaveBeenCalledWith([
      {
        id: 'test',
        field: 'TEXT_A',
        operator: 'EQUAL',
        valueSource: 'field',
        valueField: 'TEXT_C',
      },
    ]);
    expect(onFieldChange).toHaveBeenCalledWith(
      expect.objectContaining({
        previousValueSource: 'field',
        previousValueField: 'TEXT_B',
        valueSource: 'field',
        valueField: 'TEXT_C',
      })
    );
  });

  it('dispatches a replace action in the history-enabled path', () => {
    const dispatchAction = jest.fn();
    const onFieldChange = jest.fn();
    const { container } = renderWithContext(
      <ValueFieldSelect
        id="test"
        selectedValue="TEXT_B"
        compatibleFields={[fields[1], fields[2]]}
      />,
      { dispatchAction, onFieldChange }
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[TEXT_C]'));

    expect(dispatchAction).toHaveBeenCalledWith({
      type: 'replace-node',
      nodeId: 'test',
      node: {
        id: 'test',
        field: 'TEXT_A',
        operator: 'EQUAL',
        valueSource: 'field',
        valueField: 'TEXT_C',
        value: undefined,
      },
    });
    expect(onFieldChange).toHaveBeenCalledWith(
      expect.objectContaining({
        previousValueSource: 'field',
        previousValueField: 'TEXT_B',
        valueSource: 'field',
        valueField: 'TEXT_C',
      })
    );
  });

  it('does not change the comparison field while read-only', () => {
    const onChange = jest.fn();
    const { container } = renderWithContext(
      <ValueFieldSelect
        id="test"
        selectedValue="TEXT_B"
        compatibleFields={[fields[1], fields[2]]}
      />,
      { onChange, readOnly: true }
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));

    expect(container.querySelector('[data-test="SelectMultiOption[TEXT_C]"]')).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });
});

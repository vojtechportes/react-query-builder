import React, { ReactElement } from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../builder';
import { BuilderContext } from '../builder-context';
import { ValueSourceSelect } from './value-source-select';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  { field: 'TEXT_A', label: 'Text A', type: 'TEXT', operators: ['EQUAL'] },
  { field: 'TEXT_B', label: 'Text B', type: 'TEXT', operators: ['EQUAL'] },
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
            valueSource: 'value',
            value: 'alpha',
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

describe('#components/Widgets/ValueSourceSelect', () => {
  it('switches a rule from literal to field comparison mode', () => {
    const onChange = jest.fn();
    const onFieldChange = jest.fn();
    const { container } = renderWithContext(
      <ValueSourceSelect
        id="test"
        field={fields[0]}
        selectedValueSource="value"
        compatibleFields={[fields[1]]}
        fieldComparisonEnabled
      />,
      { onChange, onFieldChange }
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[field]'));

    expect(onChange).toHaveBeenCalledWith([
      {
        id: 'test',
        field: 'TEXT_A',
        operator: 'EQUAL',
        valueSource: 'field',
        valueField: 'TEXT_B',
      },
    ]);
    expect(onFieldChange).toHaveBeenCalledWith(
      expect.objectContaining({
        previousValue: 'alpha',
        previousValueSource: 'value',
        value: undefined,
        valueSource: 'field',
        valueField: 'TEXT_B',
      })
    );
  });

  it('switches a rule from field comparison mode back to literal mode', () => {
    const onChange = jest.fn();
    const onFieldChange = jest.fn();
    const { container } = renderWithContext(
      <ValueSourceSelect
        id="test"
        field={fields[0]}
        selectedValueSource="field"
        compatibleFields={[fields[1]]}
        fieldComparisonEnabled
      />,
      {
        data: [
          {
            id: 'test',
            field: 'TEXT_A',
            operator: 'EQUAL',
            valueSource: 'field',
            valueField: 'TEXT_B',
          },
        ] as any,
        onChange,
        onFieldChange,
      }
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[value]'));

    expect(onChange).toHaveBeenCalledWith([
      {
        id: 'test',
        field: 'TEXT_A',
        operator: 'EQUAL',
        valueSource: 'value',
        value: '',
      },
    ]);
    expect(onFieldChange).toHaveBeenCalledWith(
      expect.objectContaining({
        previousValueSource: 'field',
        previousValueField: 'TEXT_B',
        valueSource: 'value',
        value: '',
      })
    );
  });

  it('disables the field option when field comparisons are unavailable', () => {
    const { container } = renderWithContext(
      <ValueSourceSelect
        id="test"
        field={fields[0]}
        selectedValueSource="value"
        compatibleFields={[]}
        fieldComparisonEnabled={false}
      />
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));

    expect(
      getByDataTest(container, 'SelectMultiOption[field]').hasAttribute('disabled')
    ).toBe(true);
  });
});

import React, { ReactElement } from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../../builder';
import { BuilderContext } from '../../builder-context';
import { SelectMulti } from './select-multi';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'MULTI_LIST',
    value: [{ value: 'test', label: 'test' }],
  },
];
const data: any[] = [{ id: 'test', field: 'MOCK_FIELD', value: [] }];
const selectValues = [
  { value: 'test', label: 'Retail' },
  { value: 'another', label: 'Priority' },
  { value: 'third', label: 'Enterprise' },
  { value: 'fourth', label: 'Wholesale' },
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

describe('#components/Widgets/SelectMulti', () => {
  it('renders in editable and read-only modes', () => {
    const editable = renderWithContext(
      <SelectMulti id="test" selectedValue={[]} values={selectValues} />
    );
    const readOnly = renderWithContext(
      <SelectMulti id="test" selectedValue={[]} values={selectValues} />,
      { readOnly: true }
    );

    expect(editable.container.firstChild).toBeTruthy();
    expect(readOnly.container.firstChild).toBeTruthy();
  });

  it('adds and removes values through the options list', () => {
    const { container } = renderWithContext(
      <SelectMulti id="test" selectedValue={['test']} values={selectValues} />
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[test]'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[another]'));

    expect(container.firstChild).toBeTruthy();
  });

  it('shows a summary badge when values overflow the summary width', () => {
    const { container } = renderWithContext(
      <SelectMulti
        id="test"
        selectedValue={['test', 'another', 'third', 'fourth']}
        values={selectValues}
      />
    );

    expect(getByDataTest(container, 'SelectMultiSummaryBadge').textContent).toEqual(
      '+1'
    );
  });

  it('falls back to the default form components when custom ones are unavailable', () => {
    const { container } = renderWithContext(
      <SelectMulti id="test" selectedValue={[]} values={selectValues} />,
      { components: {} as IBuilderComponentsProps }
    );

    expect(container.querySelector('[data-test="SelectMultiTrigger"]')).toBeTruthy();
  });
});

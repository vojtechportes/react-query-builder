import React, { ReactElement } from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../builder';
import { BuilderContext } from '../builder-context';
import { Select } from './select';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'LIST',
    value: [{ value: 'test', label: 'test' }],
  },
];
const data: any[] = [{ id: 'test', field: 'MOCK_FIELD', value: 'test' }];
const selectValues = [{ value: 'test', label: 'test' }];

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

describe('#components/Widgets/Select', () => {
  it('renders in editable and read-only modes', () => {
    const editable = renderWithContext(
      <Select id="test" selectedValue="" values={selectValues} />
    );
    const readOnly = renderWithContext(
      <Select id="test" selectedValue="" values={selectValues} />,
      { readOnly: true }
    );

    expect(editable.container.firstChild).toBeTruthy();
    expect(readOnly.container.firstChild).toBeTruthy();
  });

  it('opens the options and selects a value', () => {
    const { container } = renderWithContext(
      <Select id="test" selectedValue="" values={selectValues} />
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[test]'));

    expect(container.firstChild).toBeTruthy();
  });

  it('falls back to the default form components when custom ones are unavailable', () => {
    const { container } = renderWithContext(
      <Select id="test" selectedValue="" values={selectValues} />,
      { components: {} as IBuilderComponentsProps }
    );

    expect(container.querySelector('[data-test="SelectMultiTrigger"]')).toBeTruthy();
  });
});

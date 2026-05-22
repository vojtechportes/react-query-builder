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
  { field: 'MOCK_FIELD_4', label: 'Mock Field', type: 'TEXT', operators: ['EQUAL'] },
  { field: 'MOCK_FIELD_5', label: 'Mock Field', type: 'TEXT', operators: ['BETWEEN'] },
  { field: 'MOCK_FIELD_6', label: 'Mock Field', type: 'NUMBER', operators: ['EQUAL'] },
  { field: 'MOCK_FIELD_7', label: 'Mock Field', type: 'NUMBER', operators: ['BETWEEN'] },
  {
    field: 'MOCK_FIELD_8',
    label: 'Mock Field',
    type: 'LIST',
    value: [{ label: 'test', value: 'test' }],
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
});

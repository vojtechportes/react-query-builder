import React, { ReactElement } from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../builder';
import { BuilderContext } from '../builder-context';
import { strings } from '../constants/strings';
import { Rule } from './rule';

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
  },
  {
    field: 'MOCK_FIELD_7',
    label: 'Mock Field 7',
    operators: ['EQUAL'],
    type: 'MULTI_LIST',
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
  overrides?: Partial<React.ComponentProps<typeof BuilderContext.Provider>['value']>
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
    const editable = renderWithContext(<Rule id="test-2" field="MOCK_FIELD_1" />);
    const readOnly = renderWithContext(<Rule id="test-2" field="MOCK_FIELD_1" />, {
      readOnly: true,
    });

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
      expect(container.querySelector(`[data-test="Rule[${index}]"]`)).toBeTruthy();
    }

    expect(
      container.querySelector('[data-test="Rule[9]"] [data-test="SelectMultiTrigger"]')
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
});

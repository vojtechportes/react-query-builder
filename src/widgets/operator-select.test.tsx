import { mount, shallow } from 'enzyme';
import React from 'react';
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
  {
    field: 'MOCK_FIELD_1',
    label: 'Mock Field',
    type: 'TEXT',
  },
  {
    field: 'MOCK_FIELD_2',
    label: 'Mock Field',
    type: 'NUMBER',
    operators: [],
  },
];
const data: any[] = [
  {
    field: 'MOCK_FIELD_1',
    id: 'test-1',
    value: 'Test',
  },
  {
    field: 'MOCK_FIELD_2',
    id: 'test-2',
    value: 'Test',
  },
  {
    field: 'MOCK_FIELD_2',
    id: 'test-3',
    value: [1, 2],
    operator: 'NOT_BETWEEN',
  },
];
const strings = { form: {} };
const setData = jest.fn();
const onChange = jest.fn();

const operatorSelectValues: IOperatorSelectValuesProps[][] = [
  // Testing scenario where BETWEEN is first in operator list
  [
    { value: 'BETWEEN', label: 'Test' },
    { value: 'ALL_IN', label: 'Test' },
    { value: 'ANY_IN', label: 'Test' },
  ],
  // Testing scenario where BETWEEN is NOT first in operator list
  [{ value: 'ALL_IN', label: 'Test' }, { value: 'ANY_IN', label: 'Test' }],
];

describe('#components/Widgets/OperatorSelect', () => {
  it('Tests Snapshot', () => {
    expect(
      shallow(
        <BuilderContext.Provider
          value={{
            components,
            fields,
            data,
            strings,
            setData,
            onChange,
            readOnly: false,
          }}
        >
          <OperatorSelect id="test-1" values={operatorSelectValues[0]} />
        </BuilderContext.Provider>
      )
    ).toMatchSnapshot();

    expect(
      shallow(
        <BuilderContext.Provider
          value={{
            components,
            fields,
            data,
            strings,
            setData,
            onChange,
            readOnly: true,
          }}
        >
          <OperatorSelect id="test-1" values={operatorSelectValues[0]} />
        </BuilderContext.Provider>
      )
    ).toMatchSnapshot();
  });

  it('Tests user interaction where BETWEEN is first in operator list and field is of STRING type', () => {
    const wrapper = mount(
      <BuilderContext.Provider
        value={{
          components,
          fields,
          data,
          strings,
          setData,
          onChange,
          readOnly: false,
        }}
      >
        <OperatorSelect id="test-1" values={operatorSelectValues[0]} />
      </BuilderContext.Provider>
    );

    const select = wrapper.find('select').first();
    select.simulate('change', { target: { value: 'BETWEEN' } });
  });

  it('Tests user interaction where BETWEEN is NOT first in operator list and field is of STRING type', () => {
    const wrapper = mount(
      <BuilderContext.Provider
        value={{
          components,
          fields,
          data,
          strings,
          setData,
          onChange,
          readOnly: false,
        }}
      >
        <OperatorSelect id="test-1" values={operatorSelectValues[1]} />
      </BuilderContext.Provider>
    );

    const select = wrapper.find('select').first();
    select.simulate('change', { target: { value: 'ALL_IN' } });
  });

  it('Tests user interaction where BETWEEN is first in operator list and field is of NUMBER type', () => {
    onChange.mockClear();

    const wrapper = mount(
      <BuilderContext.Provider
        value={{
          components,
          fields,
          data,
          strings,
          setData,
          onChange,
          readOnly: false,
        }}
      >
        <OperatorSelect id="test-2" values={operatorSelectValues[0]} />
      </BuilderContext.Provider>
    );

    const select = wrapper.find('select').first();
    select.simulate('change', { target: { value: 'BETWEEN' } });

    expect(onChange).toHaveBeenCalledWith([
      {
        field: 'MOCK_FIELD_1',
        id: 'test-1',
        value: 'Test',
      },
      {
        field: 'MOCK_FIELD_2',
        id: 'test-2',
        value: [0, 0],
        operator: 'BETWEEN',
      },
      {
        field: 'MOCK_FIELD_2',
        id: 'test-3',
        value: [1, 2],
        operator: 'NOT_BETWEEN',
      },
    ]);
  });

  it('Tests user interaction where BETWEEN is NOT first in operator list and field is of NUMBER type', () => {
    onChange.mockClear();

    const wrapper = mount(
      <BuilderContext.Provider
        value={{
          components,
          fields,
          data,
          strings,
          setData,
          onChange,
          readOnly: false,
        }}
      >
        <OperatorSelect id="test-2" values={operatorSelectValues[1]} />
      </BuilderContext.Provider>
    );

    const select = wrapper.find('select').first();
    select.simulate('change', { target: { value: 'ALL_IN' } });

    expect(onChange).toHaveBeenCalledWith([
      {
        field: 'MOCK_FIELD_1',
        id: 'test-1',
        value: 'Test',
      },
      {
        field: 'MOCK_FIELD_2',
        id: 'test-2',
        value: 'Test',
        operator: 'ALL_IN',
      },
      {
        field: 'MOCK_FIELD_2',
        id: 'test-3',
        value: [1, 2],
        operator: 'NOT_BETWEEN',
      },
    ]);
  });

  it('Resets NOT_BETWEEN number values back to numeric scalar output', () => {
    onChange.mockClear();

    const wrapper = mount(
      <BuilderContext.Provider
        value={{
          components,
          fields,
          data,
          strings,
          setData,
          onChange,
          readOnly: false,
        }}
      >
        <OperatorSelect id="test-3" values={operatorSelectValues[1]} />
      </BuilderContext.Provider>
    );

    const select = wrapper.find('select').first();
    select.simulate('change', { target: { value: 'ALL_IN' } });

    expect(onChange).toHaveBeenCalledWith([
      {
        field: 'MOCK_FIELD_1',
        id: 'test-1',
        value: 'Test',
      },
      {
        field: 'MOCK_FIELD_2',
        id: 'test-2',
        value: 'Test',
      },
      {
        field: 'MOCK_FIELD_2',
        id: 'test-3',
        value: 0,
        operator: 'ALL_IN',
      },
    ]);
  });

  it('Tests no form components scenario', () => {
    const wrapper = mount(
      <BuilderContext.Provider
        value={{
          components: {},
          fields,
          data,
          strings,
          setData,
          onChange,
          readOnly: false,
        }}
      >
        <OperatorSelect id="test-1" values={operatorSelectValues[0]} />
      </BuilderContext.Provider>
    );

    expect(Object.keys(wrapper).length).toBe(0);
  });
});

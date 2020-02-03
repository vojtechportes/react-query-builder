import { mount, shallow } from 'enzyme';
import React from 'react';
import {
  BuilderComponentsProps,
  BuilderFieldProps,
  defaultComponents,
} from '../../../src/components/Builder';
import { BuilderContext } from '../../../src/components/Context';
import {
  OperatorSelect,
  OperatorSelectValuesProps,
} from '../../../src/components/Widgets/OperatorSelect';

const components: BuilderComponentsProps = defaultComponents;
const fields: BuilderFieldProps[] = [
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
];
const strings = { form: {} };
const setData = jest.fn();
const onChange = () => jest.fn();

const operatorSelectValues: OperatorSelectValuesProps[][] = [
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
  });

  it('Tests user interaction where BETWEEN is NOT first in operator list and field is of NUMBER type', () => {
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

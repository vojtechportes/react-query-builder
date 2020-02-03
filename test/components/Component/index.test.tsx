import { mount, shallow } from 'enzyme';
import React from 'react';
import {
  BuilderComponentsProps,
  BuilderFieldProps,
  defaultComponents,
} from '../../../src/components/Builder';
import { Component } from '../../../src/components/Component/index';
import { BuilderContext } from '../../../src/components/Context';
import { strings } from '../../../src/constants/strings';

const components: BuilderComponentsProps = defaultComponents;
const fields: BuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD_1',
    label: 'Mock Field',
    operators: ['EQUAL'],
    type: 'BOOLEAN',
  },
  {
    field: 'MOCK_FIELD_2',
    label: 'Mock Field 2',
    operators: ['EQUAL'],
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
const setData = jest.fn();
const onChange = () => jest.fn();

describe('#components/Component', () => {
  it('Tests snapshot', () => {
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
          <Component id="test-2" field="MOCK_FIELD_1" />
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
          <Component id="test-2" field="MOCK_FIELD_1" />
        </BuilderContext.Provider>
      )
    ).toMatchSnapshot();
  });

  it('Tests full behavior', () => {
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
        <Component data-test="Component[0]" id="test-2" field="" />
        <Component data-test="Component[1]" id="test-2" field="MOCK_FIELD_1" />
        <Component data-test="Component[2]" id="test-3" field="MOCK_FIELD_2" />
        <Component data-test="Component[3]" id="test-4" field="MOCK_FIELD_3" />
        <Component data-test="Component[4]" id="test-5" field="MOCK_FIELD_4" />
        <Component data-test="Component[5]" id="test-6" field="MOCK_FIELD_5" />
        <Component data-test="Component[6]" id="test-7" field="MOCK_FIELD_6" />
        <Component data-test="Component[7]" id="test-8" field="MOCK_FIELD_7" />
        <Component
          data-test="Component[8]"
          id="test-9"
          field="SOME_FIELD_THAT_DOESNT_EXISTS"
        />
      </BuilderContext.Provider>
    );

    expect(wrapper.find('[data-test="Component[0]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Component[1]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Component[2]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Component[3]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Component[4]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Component[5]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Component[6]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Component[7]"]')).toBeDefined();
    expect(Object.keys(wrapper.find('[data-test="Component[8]"]')).length).toBe(
      0
    );

    wrapper.find('[data-test="Component[1]"] button').simulate('click');

    expect(Object.keys(wrapper.find('[data-test="Component[1]"]')).length).toBe(
      0
    );
  });

  it('Tests no srtrings scenario', () => {
    const wrapper = mount(
      <BuilderContext.Provider
        value={{
          components,
          fields,
          data,
          strings: {},
          setData,
          onChange,
          readOnly: false,
        }}
      >
        <Component id="test-9" field="" />
      </BuilderContext.Provider>
    );

    expect(Object.keys(wrapper).length).toBe(0);
  });
});

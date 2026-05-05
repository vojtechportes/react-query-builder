import { mount, shallow } from 'enzyme';
import React from 'react';
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
const setData = jest.fn();
const onChange = () => jest.fn();

describe('#components/Rule', () => {
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
          <Rule id="test-2" field="MOCK_FIELD_1" />
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
          <Rule id="test-2" field="MOCK_FIELD_1" />
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
        <Rule data-test="Rule[9]" id="test-10" field="MOCK_FIELD_2" operator="IS_NULL" />
      </BuilderContext.Provider>
    );

    expect(wrapper.find('[data-test="Rule[0]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Rule[1]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Rule[2]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Rule[3]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Rule[4]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Rule[5]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Rule[6]"]')).toBeDefined();
    expect(wrapper.find('[data-test="Rule[7]"]')).toBeDefined();
    expect(
      wrapper.find('[data-test="Rule[9]"] [data-test="SelectMultiTrigger"]').length
    ).toBeGreaterThan(0);
    const ruleNineInputs = wrapper
      .find('[data-test="Rule[9]"]')
      .find('input')
      .filterWhere((node) => {
        const inputType = node.prop('type');

        return (
          inputType === 'text' ||
          inputType === 'date' ||
          inputType === 'number'
        );
      });

    expect(
      ruleNineInputs.length
    ).toEqual(0);
    expect(Object.keys(wrapper.find('[data-test="Rule[8]"]')).length).toBe(
      0
    );

    wrapper
      .find('[data-test="Rule[1]"] button')
      .filterWhere((node) => node.text() === 'Delete')
      .first()
      .simulate('click');

    expect(Object.keys(wrapper.find('[data-test="Rule[1]"]')).length).toBe(
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
        <Rule id="test-9" field="" />
      </BuilderContext.Provider>
    );

    expect(Object.keys(wrapper).length).toBe(0);
  });

  it('Hides the delete control when the rule is locally read-only', () => {
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
        <Rule id="test-2" field="MOCK_FIELD_1" readOnly />
      </BuilderContext.Provider>
    );

    expect(wrapper.find('button').filterWhere((node) => node.text() === 'Delete').length).toEqual(0);
  });
});

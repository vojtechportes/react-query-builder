import { mount, shallow } from 'enzyme';
import React from 'react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../builder';
import { BuilderContext } from '../builder-context';
import { strings } from '../constants/strings';
import { Group } from './group';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'TEXT',
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
    type: 'GROUP',
    value: 'AND',
    id: 'test-2',
    isNegated: false,
    parent: 'test-1',
  },
];
const setData = jest.fn();
const onChange = () => jest.fn();

describe('#components/Group', () => {
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
          <Group id="test" isRoot value="AND" isNegated={false} />
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
          <Group id="test" isRoot value="AND" isNegated={false} />
        </BuilderContext.Provider>
      )
    ).toMatchSnapshot();
  });

  it('Tests user interaction', () => {
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
        <Group id="test-2" isRoot={false} value="AND" isNegated={false} />
      </BuilderContext.Provider>
    );

    const optionNot = wrapper.find('[data-test="Option[not]"]').first();
    const optionAnd = wrapper.find('[data-test="Option[and]"]').first();
    const optionOr = wrapper.find('[data-test="Option[or]"]').first();

    const addRule = wrapper.find('[data-test="AddRule"]').first();
    const addGroup = wrapper.find('[data-test="AddGroup"]').first();
    const remove = wrapper.find('[data-test="Remove"]').first();

    optionNot.simulate('click');
    optionNot.simulate('click');

    optionOr.simulate('click');
    optionAnd.simulate('click');

    addRule.simulate('click');
    addGroup.simulate('click');
    remove.simulate('click');
  });

  it('Tests user interaction on root element', () => {
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
        <Group id="test-1" isRoot value="AND" isNegated={false} />
      </BuilderContext.Provider>
    );

    const addRule = wrapper.find('[data-test="AddRule"]').first();
    const addGroup = wrapper.find('[data-test="AddGroup"]').first();

    addRule.simulate('click');
    addGroup.simulate('click');
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
        <Group id="test-1" isRoot />
      </BuilderContext.Provider>
    );

    expect(Object.keys(wrapper).length).toBe(0);
  });
});

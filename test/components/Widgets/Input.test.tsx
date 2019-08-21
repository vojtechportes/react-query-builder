import { Input } from '../../../src/components/Widgets/Input';
import {
  BuilderContext,
  BuilderFieldProps,
  BuilderComponentsProps,
  defaultComponents,
} from '../../../src/components/Builder';
import { shallow, mount } from 'enzyme';
import React from 'react';

const components: BuilderComponentsProps = defaultComponents;
const fields: BuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'TEXT',
  },
];
const data: any[] = [
  {
    id: 'test',
    value: '',
  },
];
const strings = {};
const setData = jest.fn();
const onChange = () => jest.fn();

describe('#components/Widgets/Input', () => {
  it('Tests Snapshot', () => {
    expect(
      shallow(
        <BuilderContext.Provider
          value={{ components, fields, data, strings, setData, onChange }}
        >
          <Input id="test" value="" type="text" />
        </BuilderContext.Provider>
      )
    ).toMatchSnapshot();
    expect(
      shallow(
        <BuilderContext.Provider
          value={{ components, fields, data, strings, setData, onChange }}
        >
          <Input id="test" value="" type="number" />
        </BuilderContext.Provider>
      )
    ).toMatchSnapshot();
  });

  it('Tests user interaction', () => {
    const wrapper = mount(
      <BuilderContext.Provider
        value={{ components, fields, data, strings, setData, onChange }}
      >
        <Input id="test" value="" type="text" />
      </BuilderContext.Provider>
    );

    const input = wrapper.find('input').first();
    input.simulate('change');
  });

  it('Tests no form components scenario', () => {
    const wrapper = mount(
      <BuilderContext.Provider
        value={{ components: {}, fields, data, strings, setData, onChange }}
      >
        <Input id="test" value="" type="text" />
      </BuilderContext.Provider>
    );

    expect(Object.keys(wrapper).length).toBe(0);
  });
});

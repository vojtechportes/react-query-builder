import { Select } from '../../../src/components/Widgets/Select';
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
    type: 'LIST',
    value: [
      {
        value: 'test',
        label: 'test',
      },
    ],
  },
];
const data: any[] = [
  {
    id: 'test',
    field: 'MOCK_FIELD',
    value: 'test',
  },
];
const selectValues = [
  {
    value: 'test',
    label: 'test',
  },
];
const strings = { form: {} };
const setData = jest.fn();
const onChange = () => jest.fn();

describe('#components/Widgets/Select', () => {
  it('Tests Snapshot', () => {
    expect(
      shallow(
        <BuilderContext.Provider
          value={{ components, fields, data, strings, setData, onChange }}
        >
          <Select id="test" selectedValue={''} values={selectValues} />
        </BuilderContext.Provider>
      )
    ).toMatchSnapshot();
  });

  it('Tests user interaction', () => {
    const wrapper = mount(
      <BuilderContext.Provider
        value={{ components, fields, data, strings, setData, onChange }}
      >
        <Select id="test" selectedValue={''} values={selectValues} />
      </BuilderContext.Provider>
    );

    const select = wrapper.find('select').first();
    select.simulate('change', { target: { value: 'test' } });
  });

  it('Test no form components scenario', () => {
    const wrapper = mount(
      <BuilderContext.Provider
        value={{ components: {}, fields, data, strings, setData, onChange }}
      >
        <Select id="test" selectedValue={''} values={selectValues} />
      </BuilderContext.Provider>
    );

    expect(Object.keys(wrapper).length).toBe(0);
  });
});

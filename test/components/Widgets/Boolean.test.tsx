import { Boolean } from '../../../src/components/Widgets/Boolean';
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
    type: 'BOOLEAN',
  },
];
const data: any[] = [
  {
    id: 'test',
    value: false,
  },
];
const strings = {};
const setData = jest.fn();
const onChange = () => jest.fn();

describe('#components/Widgets/Boolean', () => {
  it('Tests Snapshot', () => {
    expect(
      shallow(
        <BuilderContext.Provider
          value={{ components, fields, data, strings, setData, onChange }}
        >
          <Boolean id="test" selectedValue={false} />
        </BuilderContext.Provider>
      )
    ).toMatchSnapshot();
  });

  it('Tests user interaction', () => {
    const wrapper = mount(
      <BuilderContext.Provider
        value={{ components, fields, data, strings, setData, onChange }}
      >
        <Boolean id="test" selectedValue={false} />
      </BuilderContext.Provider>
    );

    const switchEl = wrapper.find('[data-test="Switch"]').first();
    switchEl.simulate('click');
  });

  it('Tests no form components scenario', () => {
    const wrapper = mount(
      <BuilderContext.Provider
        value={{ components: {}, fields, data, strings, setData, onChange }}
      >
        <Boolean id="test" selectedValue={false} />
      </BuilderContext.Provider>
    );

    expect(Object.keys(wrapper).length).toBe(0);
  });
});

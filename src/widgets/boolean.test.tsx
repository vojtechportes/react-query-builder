import { mount, shallow } from 'enzyme';
import React from 'react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../builder';
import { BuilderContext } from '../builder-context';
import { Boolean } from './boolean';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
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
          <Boolean id="test" selectedValue={false} />
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
          <Boolean id="test" selectedValue={false} />
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
        <Boolean id="test" selectedValue={false} />
      </BuilderContext.Provider>
    );

    const switchEl = wrapper.find('[data-test="Switch"]').first();
    switchEl.simulate('click');
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
        <Boolean id="test" selectedValue={false} />
      </BuilderContext.Provider>
    );

    expect(Object.keys(wrapper).length).toBe(0);
  });
});

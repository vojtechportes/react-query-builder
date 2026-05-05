import { mount, shallow } from 'enzyme';
import React from 'react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../../builder';
import { BuilderContext } from '../../builder-context';
import { SelectMulti } from './select-multi';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'MULTI_LIST',
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
    value: [],
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

describe('#components/Widgets/SelectMulti', () => {
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
          <SelectMulti id="test" selectedValue={[]} values={selectValues} />
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
          <SelectMulti id="test" selectedValue={[]} values={selectValues} />
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
        <SelectMulti id="test" selectedValue={['test']} values={selectValues} />
      </BuilderContext.Provider>
    );

    const trigger = wrapper.find('[data-test="SelectMultiTrigger"]').first();
    trigger.simulate('click');
    wrapper.update();

    const option = wrapper.find('[data-test="SelectMultiOption[test]"]').first();
    option.simulate('click');
    option.simulate('click');

    const remove = wrapper.find('[data-test="Delete"]').first();
    remove.simulate('click');
  });

  it('Test no form components scenario', () => {
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
        <SelectMulti id="test" selectedValue={[]} values={selectValues} />
      </BuilderContext.Provider>
    );

    expect(Object.keys(wrapper).length).toBe(0);
  });
});

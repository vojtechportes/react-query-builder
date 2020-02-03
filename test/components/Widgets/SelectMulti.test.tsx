import { mount, shallow } from 'enzyme';
import React from 'react';
import {
  BuilderComponentsProps,
  BuilderFieldProps,
  defaultComponents,
} from '../../../src/components/Builder';
import { BuilderContext } from '../../../src/components/Context';
import { SelectMulti } from '../../../src/components/Widgets/SelectMulti';

const components: BuilderComponentsProps = defaultComponents;
const fields: BuilderFieldProps[] = [
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

    const select = wrapper.find('select').first();
    select.simulate('change', { target: { value: 'test' } });
    select.simulate('change', { target: { value: 'test' } });

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

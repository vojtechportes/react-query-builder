import { mount, shallow } from 'enzyme';
import React from 'react';
import {
  BuilderComponentsProps,
  BuilderFieldProps,
  defaultComponents,
} from '../../../src/components/Builder';
import { BuilderContext } from '../../../src/components/Context';
import { FieldSelect } from '../../../src/components/Widgets/FieldSelect';

const components: BuilderComponentsProps = defaultComponents;
const fields: BuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD_1',
    label: 'Mock Field',
    type: 'BOOLEAN',
  },
  {
    field: 'MOCK_FIELD_2',
    label: 'Mock Field',
    type: 'DATE',
    operators: ['BETWEEN'],
  },
  {
    field: 'MOCK_FIELD_3',
    label: 'Mock Field',
    type: 'DATE',
    operators: ['LARGER'],
  },
  {
    field: 'MOCK_FIELD_4',
    label: 'Mock Field',
    type: 'TEXT',
    operators: ['EQUAL'],
  },
  {
    field: 'MOCK_FIELD_5',
    label: 'Mock Field',
    type: 'TEXT',
    operators: ['BETWEEN'],
  },
  {
    field: 'MOCK_FIELD_6',
    label: 'Mock Field',
    type: 'NUMBER',
    operators: ['EQUAL'],
  },
  {
    field: 'MOCK_FIELD_7',
    label: 'Mock Field',
    type: 'NUMBER',
    operators: ['BETWEEN'],
  },
  {
    field: 'MOCK_FIELD_8',
    label: 'Mock Field',
    type: 'LIST',
    value: [{ label: 'test', value: 'test' }],
  },
  {
    field: 'MOCK_FIELD_9',
    label: 'Mock Field',
    type: 'MULTI_LIST',
    value: [{ label: 'test', value: 'test' }],
  },
  {
    field: 'MOCK_FIELD_10',
    label: 'Mock Field',
    type: 'STATEMENT',
    value: 'test',
  },
];
const data: any[] = [
  {
    id: 'test',
    field: 'MOCK_FIELD_1',
    value: false,
  },
];
const strings = { form: {} };
const setData = jest.fn();
const onChange = () => jest.fn();

describe('#components/Widgets/FieldSelect', () => {
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
          <FieldSelect id="test" selectedValue={''} />
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
          <FieldSelect id="test" selectedValue={''} />
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
        <FieldSelect id="test" selectedValue={''} />
      </BuilderContext.Provider>
    );

    const select = wrapper.find('select');
    fields.forEach(item => {
      select.simulate('change', { target: { value: item.field } });
    });
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
        <FieldSelect id="test" selectedValue={''} />
      </BuilderContext.Provider>
    );

    expect(Object.keys(wrapper).length).toBe(0);
  });
});

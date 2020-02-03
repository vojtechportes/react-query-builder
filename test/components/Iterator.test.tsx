import { mount, shallow } from 'enzyme';
import React from 'react';
import {
  BuilderComponentsProps,
  BuilderFieldProps,
  defaultComponents,
} from '../../src/components/Builder';
import { BuilderContext } from '../../src/components/Context';
import { Iterator } from '../../src/components/Iterator';
import { strings } from '../../src/constants/strings';

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
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    id: 'test-1',
    children: ['test-2', 'test-3'],
  },
  { field: 'MOCK_FIELD', value: '', id: 'test-2', parent: 'test-1' },
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    id: 'test-3',
    children: ['test-4'],
  },
  { field: 'MOCK_FIELD', value: '', id: 'test-4', parent: 'test-3', children: [] },
];

const filteredData = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    id: 'test-1',
    children: ['test-2', 'test-3'],
  },
];

const setData = jest.fn();
const onChange = () => jest.fn();

describe('#components/Iterator', () => {
  it('Tests snapshot', () => {
    expect(
      shallow(<Iterator filteredData={[]} originalData={[]} />)
    ).toMatchSnapshot();
  });

  it('Tests full behavior', () => {
    const wrapper = mount(
      <BuilderContext.Provider
        value={{ components, fields, data, strings, setData, onChange, readOnly: false }}
      >
        <Iterator filteredData={filteredData} originalData={data} />
      </BuilderContext.Provider>
    );

    expect(wrapper.find('[data-test="IteratorComponent"]').length).toEqual(1)
  });
});

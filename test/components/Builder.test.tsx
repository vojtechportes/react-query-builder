import { Builder, BuilderFieldProps } from '../../src/components/Builder';
import React from 'react';
import { shallow, mount } from 'enzyme';

export const fields: BuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'TEXT',
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
];

describe('#components/Builder', () => {
  it('Tests snapshot', () => {
    expect(
      shallow(<Builder fields={fields} data={[]} onChange={jest.fn()} />)
    ).toMatchSnapshot();
  });

  it('Mounts Builder component', () => {
    mount(<Builder fields={fields} data={[]} onChange={jest.fn()} />);
  });
});

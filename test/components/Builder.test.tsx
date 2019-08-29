import { mount } from 'enzyme';
import React from 'react';
import { Builder, BuilderFieldProps } from '../../src/components/Builder';

export const fields: BuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'TEXT',
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
];

describe('#components/Builder', () => {
  it('Test full functionality', () => {
    mount(<Builder fields={fields} data={[]} onChange={jest.fn()} />);
  });
});

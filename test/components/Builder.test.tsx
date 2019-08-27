import { Builder, BuilderFieldProps } from '../../src/components/Builder';
import React from 'react';
import { mount } from 'enzyme';

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

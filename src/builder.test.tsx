import { mount } from 'enzyme';
import React from 'react';
import { Builder, BuilderFieldProps } from './builder';

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
    const onChange = jest.fn();

    mount(<Builder fields={fields} data={[]} onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('Updates rendered criteria when data prop changes', () => {
    const wrapper = mount(
      <Builder fields={fields} data={[]} onChange={jest.fn()} />
    );

    expect(wrapper.find('[data-test="IteratorComponent"]').length).toEqual(0);

    wrapper.setProps({
      data: [
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [{ field: 'MOCK_FIELD', value: '', operator: 'EQUAL' }],
        },
      ],
    });
    wrapper.update();

    expect(wrapper.find('[data-test="IteratorComponent"]').length).toEqual(1);
  });
});

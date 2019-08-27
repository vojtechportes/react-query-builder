import { SelectMulti } from '../../../src/components/Form/SelectMulti';
import { shallow, mount } from 'enzyme';
import React from 'react';

const mockValues = [{ value: 'test', label: 'test' }];

describe('#components/SelectMulti', () => {
  it('Tests Snapshot', () => {
    expect(
      shallow(
        <SelectMulti
          onChange={jest.fn()}
          onDelete={jest.fn()}
          selectedValue={['test']}
          values={mockValues}
        />
      )
    ).toMatchSnapshot();
  });

  it('Tests user interaction', () => {
    const wrapper = mount(
      <SelectMulti
        onChange={jest.fn()}
        onDelete={jest.fn()}
        selectedValue={['test']}
        values={mockValues}
      />
    );

    const select = wrapper.find('select');

    select.simulate('focus');
    select.simulate('change', { target: { value: ['test'] } });
    select.simulate('change', { target: { value: [] } });
  });
});

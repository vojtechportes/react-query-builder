import { SelectMulti } from '../../../src/components/Form/SelectMulti';
import { mount, shallow } from 'enzyme';
import React from 'react';

const mockValues = [{ value: 'test', label: 'test' }];

describe('#components/SelectMulti', () => {
  it('Tests Snapshot', () => {
    expect(
      shallow(
        <SelectMulti
          disabled={false}
          onChange={jest.fn()}
          onDelete={jest.fn()}
          selectedValue={['test']}
          values={mockValues}
        />
      )
    ).toMatchSnapshot();
  });

  it('Tests user interaction', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <SelectMulti
        disabled={false}
        onChange={onChange}
        onDelete={jest.fn()}
        selectedValue={['test']}
        values={mockValues}
      />
    );

    const select = wrapper.find('select');

    select.simulate('focus');
    select.simulate('change', { target: { value: ['test'] } });
    select.simulate('change', { target: { value: [] } });
    expect(onChange).toBeCalledTimes(2);
  });
});

import { mount, shallow } from 'enzyme';
import React from 'react';
import { Select } from './select';

const mockValues = [{ value: 'test', label: 'test' }];

describe('#components/Select', () => {
  it('Tests Snapshot', () => {
    expect(
      shallow(
        <Select
          disabled={false}
          onChange={jest.fn()}
          selectedValue={'Test'}
          values={mockValues}
        />
      )
    ).toMatchSnapshot();
  });

  it('Tests user interaction', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Select
        disabled={false}
        onChange={onChange}
        selectedValue={'Test'}
        values={mockValues}
      />
    );

    wrapper.find('[data-test="SelectMultiTrigger"]').first().simulate('click');
    wrapper.find('[data-test="SelectMultiOption[test]"]').first().simulate('click');

    expect(onChange).toBeCalled();
  });
});

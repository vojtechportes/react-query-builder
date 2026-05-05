import { SelectMulti } from './select-multi';
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
    const onDelete = jest.fn();
    const wrapper = mount(
      <SelectMulti
        disabled={false}
        onChange={onChange}
        onDelete={onDelete}
        selectedValue={['test']}
        values={mockValues}
      />
    );

    const trigger = wrapper.find('[data-test="SelectMultiTrigger"]').first();
    trigger.simulate('click');
    wrapper.update();

    const option = wrapper.find('[data-test="SelectMultiOption[test]"]').first();
    option.simulate('click');

    const remove = wrapper.find('[data-test="Delete"]').first();
    remove.simulate('click');

    expect(onChange).toBeCalledTimes(0);
    expect(onDelete).toBeCalledTimes(2);
  });
});

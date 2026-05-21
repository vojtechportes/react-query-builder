import { SelectMulti } from './select-multi';
import { mount, shallow } from 'enzyme';
import React from 'react';

const mockValues = [
  { value: 'test', label: 'test' },
  { value: 'another', label: 'another' },
];

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

    const secondOption = wrapper.find('[data-test="SelectMultiOption[another]"]').first();
    secondOption.simulate('click');

    expect(onChange).toBeCalledTimes(1);
    expect(onDelete).toBeCalledTimes(1);
  });

  it('Shows summary badge for hidden values', () => {
    const wrapper = mount(
      <SelectMulti
        disabled={false}
        onChange={jest.fn()}
        onDelete={jest.fn()}
        selectedValue={['test', 'another', 'third', 'fourth']}
        values={[
          { value: 'test', label: 'Retail' },
          { value: 'another', label: 'Priority' },
          { value: 'third', label: 'Enterprise' },
          { value: 'fourth', label: 'Wholesale' },
        ]}
      />
    );

    expect(
      wrapper.find('[data-test="SelectMultiSummaryBadge"]').first().text()
    ).toEqual('+1');
  });
});

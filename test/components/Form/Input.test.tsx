import { Input } from '../../../src/components/Form/Input';
import { shallow, mount } from 'enzyme';
import React from 'react';

describe('#components/Input', () => {
  it('Tests Snapshot', () => {
    expect(
      shallow(
        <Input
          disabled={false}
          type="text"
          onChange={jest.fn()}
          value={'Test'}
        />
      )
    ).toMatchSnapshot();
  });

  it('Tests user interaction', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Input disabled={false} type="text" onChange={onChange} value={'Test'} />
    );

    const input = wrapper.find('input');

    input.simulate('focus');
    input.simulate('change', { target: { value: 'test' } });
    expect(onChange).toBeCalled();
  });
});

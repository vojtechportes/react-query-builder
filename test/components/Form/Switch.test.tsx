import { mount, shallow } from 'enzyme';
import React from 'react';
import { Switch } from '../../../src/components/Form/Switch';

describe('#components/Switch', () => {
  it('Tests Snapshot', () => {
    expect(
      shallow(<Switch disabled={false} onChange={jest.fn()} switched={false} />)
    ).toMatchSnapshot();
  });

  it('Tests user interaction', () => {
    const onChange = jest.fn();

    const wrapper = mount(
      <Switch disabled={false} onChange={onChange} switched={false} />
    );

    const swtichElement = wrapper.find('[data-test="Switch"]').first();

    swtichElement.simulate('click');
    expect(onChange).toBeCalled();
  });
});

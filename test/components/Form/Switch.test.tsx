import { Switch } from '../../../src/components/Form/Switch';
import { shallow, mount } from 'enzyme';
import React from 'react';

describe('#components/Switch', () => {
  it('Tests Snapshot', () => {
    expect(
      shallow(<Switch onChange={jest.fn()} switched={false} />)
    ).toMatchSnapshot();
  });

  it('Tests user interaction', () => {
    const wrapper = mount(<Switch onChange={jest.fn()} switched={false} />);

    const swtichEl = wrapper.find('[data-test="Switch"]').first();

    swtichEl.simulate('click');
  });
});

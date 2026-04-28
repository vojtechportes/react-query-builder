import { mount } from 'enzyme';
import React, { act } from 'react';
import { Popover } from './popover';
import { PopoverItem } from './popover-item';

describe('#components/Popover', () => {
  it('Closes when a popover item is clicked', () => {
    const onClick = jest.fn();
    const wrapper = mount(
      <Popover label="Add Group" data-test="PopoverTrigger">
        <PopoverItem
          label="With Modifiers"
          onClick={onClick}
          data-test="PopoverItem"
        />
      </Popover>
    );

    wrapper
      .find('button[data-test="PopoverTrigger"]')
      .hostNodes()
      .first()
      .simulate('click');
    wrapper.update();

    expect(
      wrapper.find('button[data-test="PopoverItem"]').hostNodes().length
    ).toEqual(1);

    wrapper
      .find('button[data-test="PopoverItem"]')
      .hostNodes()
      .first()
      .simulate('click');
    wrapper.update();

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(
      wrapper.find('button[data-test="PopoverItem"]').hostNodes().length
    ).toEqual(0);
  });

  it('Closes when clicking outside the popover', () => {
    const wrapper = mount(
      <div>
        <Popover label="Add Group" data-test="PopoverTrigger">
          <PopoverItem label="With Modifiers" onClick={jest.fn()} />
        </Popover>
        <button type="button" data-test="OutsideButton">
          Outside
        </button>
      </div>
    );

    wrapper
      .find('button[data-test="PopoverTrigger"]')
      .hostNodes()
      .first()
      .simulate('click');
    wrapper.update();

    expect(wrapper.text()).toContain('With Modifiers');

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    wrapper.update();

    expect(wrapper.text()).not.toContain('With Modifiers');
  });
});

import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { Popover } from './popover';
import { PopoverItem } from './popover-item';

const getByDataTest = (container: HTMLElement, value: string): HTMLElement => {
  const element = container.querySelector(`[data-test="${value}"]`);

  if (!element) {
    throw new Error(`Unable to find element with data-test="${value}"`);
  }

  return element as HTMLElement;
};

const queryByDataTest = (
  container: HTMLElement,
  value: string
): HTMLElement | null =>
  container.querySelector(`[data-test="${value}"]`);

describe('#components/Popover', () => {
  it('closes when a popover item is clicked', () => {
    const onClick = jest.fn();
    const { container } = render(
      <Popover label="Add Group" data-test="PopoverTrigger">
        <PopoverItem
          label="With Modifiers"
          onClick={onClick}
          data-test="PopoverItem"
        />
      </Popover>
    );

    fireEvent.click(getByDataTest(container, 'PopoverTrigger'));
    expect(queryByDataTest(container, 'PopoverItem')).toBeTruthy();

    fireEvent.click(getByDataTest(container, 'PopoverItem'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(queryByDataTest(container, 'PopoverItem')).toBeNull();
  });

  it('closes when clicking outside the popover', () => {
    const { container, queryByText } = render(
      <div>
        <Popover label="Add Group" data-test="PopoverTrigger">
          <PopoverItem label="With Modifiers" onClick={jest.fn()} />
        </Popover>
        <button type="button" data-test="OutsideButton">
          Outside
        </button>
      </div>
    );

    fireEvent.click(getByDataTest(container, 'PopoverTrigger'));
    expect(queryByText('With Modifiers')).toBeTruthy();

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(queryByText('With Modifiers')).toBeNull();
  });
});

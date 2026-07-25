import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Popover } from './popover';
import popoverStyles from './popover.module.css';
import { PopoverItem, IPopoverItemProps } from '../popover-item';
import popoverItemStyles from '../popover-item/popover-item.module.css';
import { ThemeProvider } from '../theme-provider/theme-provider';

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
): HTMLElement | null => container.querySelector(`[data-test="${value}"]`);

const getPopoverCss = () =>
  readFileSync(join(__dirname, 'popover.module.css'), 'utf8');

const getPopoverItemCss = () =>
  readFileSync(
    join(__dirname, '..', 'popover-item', 'popover-item.module.css'),
    'utf8'
  );

describe('#components/Popover', () => {
  it('opens and closes when the trigger is toggled repeatedly', () => {
    const { container } = render(
      <Popover label="Add Group" data-test="PopoverTrigger">
        <PopoverItem
          label="With Modifiers"
          onClick={jest.fn()}
          data-test="PopoverItem"
        />
      </Popover>
    );

    fireEvent.click(getByDataTest(container, 'PopoverTrigger'));
    expect(queryByDataTest(container, 'PopoverItem')).toBeTruthy();

    fireEvent.click(getByDataTest(container, 'PopoverTrigger'));
    expect(queryByDataTest(container, 'PopoverItem')).toBeNull();

    fireEvent.click(getByDataTest(container, 'PopoverTrigger'));
    expect(queryByDataTest(container, 'PopoverItem')).toBeTruthy();
  });

  it('closes when a popover item is clicked after the child callback runs', () => {
    const onClick = jest.fn((event: React.MouseEvent<HTMLButtonElement>) => {
      expect(event.currentTarget.isConnected).toBe(true);
    });

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
    fireEvent.click(getByDataTest(container, 'PopoverItem'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(queryByDataTest(container, 'PopoverItem')).toBeNull();
  });

  it('keeps non-element children visible and does not wrap their clicks', () => {
    const { container, getByText } = render(
      <Popover label="Add Group" data-test="PopoverTrigger">
        Plain child
      </Popover>
    );

    fireEvent.click(getByDataTest(container, 'PopoverTrigger'));
    fireEvent.click(getByText('Plain child'));

    expect(getByText('Plain child')).toBeTruthy();
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

    fireEvent.mouseDown(getByDataTest(container, 'OutsideButton'));

    expect(queryByText('With Modifiers')).toBeNull();
  });

  it('does not close from an inside mousedown', () => {
    const { container } = render(
      <Popover label="Add Group" data-test="PopoverTrigger">
        <PopoverItem
          label="With Modifiers"
          onClick={jest.fn()}
          data-test="PopoverItem"
        />
      </Popover>
    );

    fireEvent.click(getByDataTest(container, 'PopoverTrigger'));
    fireEvent.mouseDown(getByDataTest(container, 'PopoverItem'));

    expect(queryByDataTest(container, 'PopoverItem')).toBeTruthy();
  });

  it('removes its outside-click listener on cleanup', () => {
    const removeEventListener = jest.spyOn(document, 'removeEventListener');
    const { unmount } = render(
      <Popover label="Add Group">
        <PopoverItem label="With Modifiers" onClick={jest.fn()} />
      </Popover>
    );

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );

    removeEventListener.mockRestore();
  });

  it('composes className on the container and preserves the trigger data hook', () => {
    const { container } = render(
      <Popover
        label="Add Group"
        className="incoming-class"
        data-test="PopoverTrigger"
      >
        <PopoverItem label="With Modifiers" onClick={jest.fn()} />
      </Popover>
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root.classList.contains(popoverStyles.container)).toBe(true);
    expect(root.classList.contains('incoming-class')).toBe(true);
    expect(getByDataTest(container, 'PopoverTrigger').tagName).toBe('BUTTON');
  });

  it('serializes theme variables and renders on the server', () => {
    const markup = renderToString(
      <ThemeProvider colors={{ white: '#fefefe', grey: { 500: '#aaaaaa' } }}>
        <Popover label="Add Group" data-test="PopoverTrigger">
          <PopoverItem label="With Modifiers" onClick={jest.fn()} />
        </Popover>
      </ThemeProvider>
    );

    expect(markup).toContain('data-test="PopoverTrigger"');
    expect(markup).toContain('--query-builder-color-white:#fefefe');
    expect(markup).not.toContain('With Modifiers');
  });

  it('exposes every CSS Module class used by the component', () => {
    expect(popoverStyles.container).toBe('container');
    expect(popoverStyles.content).toBe('content');
  });

  it('defines the preserved popover positioning and layering rules', () => {
    const css = getPopoverCss();

    expect(css).toContain('position: absolute');
    expect(css).toContain('top: calc(100% + 0.35rem)');
    expect(css).toContain('z-index: var(--query-builder-popover-z-index, 5)');
    expect(css).toContain('min-width: 180px');
    expect(css).toContain('--query-builder-shadow-popover');
    expect(css).toContain('0 4px 12px rgba(0, 0, 0, 0.15)');
  });
});

describe('#components/PopoverItem', () => {
  it('renders a button item with callback, className, item class, and data hook', () => {
    const onClick = jest.fn();
    const { container } = render(
      <PopoverItem
        label="With Modifiers"
        onClick={onClick}
        className="incoming-class"
        data-test="PopoverItem"
      />
    );
    const item = getByDataTest(container, 'PopoverItem') as HTMLButtonElement;

    fireEvent.click(item);

    expect(item.type).toBe('button');
    expect(item.classList.contains(popoverItemStyles.item)).toBe(true);
    expect(item.classList.contains('incoming-class')).toBe(true);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards native disabled state and suppresses clicks', () => {
    const onClick = jest.fn();
    const { container } = render(
      <PopoverItem
        label="Disabled"
        onClick={onClick}
        disabled
        data-test="PopoverItem"
      />
    );
    const item = getByDataTest(container, 'PopoverItem') as HTMLButtonElement;

    fireEvent.click(item);

    expect(item.disabled).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('serializes only explicit provider colors on a standalone item', () => {
    const { container } = render(
      <ThemeProvider colors={{ grey: { 700: '#123456' } }}>
        <PopoverItem label="With Modifiers" onClick={jest.fn()} />
      </ThemeProvider>
    );
    const item = container.firstElementChild as HTMLElement;

    expect(item.style.getPropertyValue('--query-builder-color-grey-700')).toBe(
      '#123456'
    );
    expect(item.style.getPropertyValue('--query-builder-color-white')).toBe('');
  });

  it('exposes every CSS Module class used by the component', () => {
    expect(popoverItemStyles.item).toBe('item');
  });

  it('defines last-child, hover, and disabled CSS states', () => {
    const css = getPopoverItemCss();

    expect(css).toContain('.item:last-child');
    expect(css).toContain('.item:hover:not(:disabled)');
    expect(css).toContain('.item:disabled');
    expect(css).toContain('border-bottom: 0');
  });

  it('keeps the public props type additive and compatible', () => {
    const props: IPopoverItemProps = {
      label: 'Disabled',
      onClick: jest.fn(),
      disabled: true,
      className: 'incoming-class',
      'data-test': 'PopoverItem',
    };

    expect(props.disabled).toBe(true);
  });
});

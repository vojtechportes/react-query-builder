import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DragHandle } from './drag-handle';
import styles from './drag-handle.module.css';

describe('#components/DragHandle', () => {
  it('forwards its ref to the handle element', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(<DragHandle ref={ref} />);

    expect(ref.current).toHaveAttribute('data-test', 'DragHandle');
  });

  it('preserves DnD attributes, listeners, className, style, and data-test override order', () => {
    const onPointerDown = jest.fn();
    const { container } = render(
      <DragHandle
        role="button"
        aria-describedby="dnd-instructions"
        tabIndex={0}
        className="incoming-class"
        style={{ width: '18px' }}
        data-test="CustomDragHandle"
        onPointerDown={onPointerDown}
      />
    );
    const handle = container.firstElementChild as HTMLElement;

    expect(handle).toHaveAttribute('role', 'button');
    expect(handle).toHaveAttribute('aria-describedby', 'dnd-instructions');
    expect(handle).toHaveAttribute('tabindex', '0');
    expect(handle).toHaveAttribute('data-test', 'CustomDragHandle');
    expect(handle).toHaveClass(styles.dragHandle, 'incoming-class');
    expect(handle.style.width).toBe('18px');

    fireEvent.pointerDown(handle);

    expect(onPointerDown).toHaveBeenCalledTimes(1);
  });

  it('does not emit component-local theme variables', () => {
    const { container } = render(<DragHandle />);
    const handle = container.firstElementChild as HTMLElement;

    expect(handle).not.toHaveAttribute('style');
  });

  it('renders on the server without styled-components runtime output', () => {
    const markup = renderToString(<DragHandle />);

    expect(markup).toContain('class="dragHandle"');
    expect(markup).not.toContain('--query-builder-color-grey-300');
    expect(markup).not.toContain('data-styled');
  });

  it('exposes every CSS Module class used by the component', () => {
    expect(styles.dragHandle).toBe('dragHandle');
  });
});

import { useDroppable } from '@dnd-kit/core';
import { render } from '@testing-library/react';
import React from 'react';
import { DropZone, IDropZoneProps } from './drop-zone';
import { ThemeProvider } from '../theme-provider/theme-provider';
import styles from './drop-zone.module.css';

jest.mock('@dnd-kit/core', () => ({
  useDroppable: jest.fn(),
}));

const setNodeRef = jest.fn();
const defaultProps: IDropZoneProps = {
  id: 'drop-zone:root:1',
  index: 1,
  parentId: 'root',
  isActive: false,
  isDragging: false,
};

const renderDropZone = (props: Partial<IDropZoneProps> = {}) =>
  render(<DropZone {...defaultProps} {...props} />);

beforeEach(() => {
  jest.clearAllMocks();
  (useDroppable as jest.Mock).mockReturnValue({ setNodeRef });
});

describe('#components/DropZone', () => {
  it('registers the droppable data and attaches its ref to the outer element', () => {
    const { container } = renderDropZone({ isEmpty: true });
    const anchor = container.firstElementChild;

    expect(useDroppable).toHaveBeenCalledWith({
      id: 'drop-zone:root:1',
      data: {
        type: 'drop-zone',
        index: 1,
        parentId: 'root',
        isEmpty: true,
      },
    });
    expect(setNodeRef).toHaveBeenCalledWith(anchor);
  });

  it('preserves the three-element DOM structure and active data hook', () => {
    const { container } = renderDropZone({ isActive: true });
    const anchor = container.firstElementChild as HTMLElement;
    const dropZone = anchor.firstElementChild as HTMLElement;
    const inner = dropZone.firstElementChild as HTMLElement;

    expect(anchor.children).toHaveLength(1);
    expect(dropZone.children).toHaveLength(1);
    expect(inner.children).toHaveLength(0);
    expect(anchor.getAttribute('data-test')).toBe('ActiveDropZone');
    expect(dropZone.hasAttribute('data-test')).toBe(false);
    expect(inner.hasAttribute('data-test')).toBe(false);
  });

  it('omits the active data hook while inactive', () => {
    const { container } = renderDropZone();

    expect(container.firstElementChild?.hasAttribute('data-test')).toBe(false);
  });

  it('composes an incoming class on the outer element', () => {
    const { container } = renderDropZone({ className: 'incoming-class' });

    expect(container.firstElementChild?.classList.contains(styles.anchor)).toBe(
      true
    );
    expect(
      container.firstElementChild?.classList.contains('incoming-class')
    ).toBe(true);
  });

  it.each([
    { isActive: false, isDragging: false, isEmpty: false },
    { isActive: false, isDragging: false, isEmpty: true },
    { isActive: false, isDragging: true, isEmpty: false },
    { isActive: false, isDragging: true, isEmpty: true },
    { isActive: true, isDragging: false, isEmpty: false },
    { isActive: true, isDragging: false, isEmpty: true },
    { isActive: true, isDragging: true, isEmpty: false },
    { isActive: true, isDragging: true, isEmpty: true },
  ])(
    'maps active=$isActive dragging=$isDragging empty=$isEmpty to state classes',
    ({ isActive, isDragging, isEmpty }) => {
      const { container } = renderDropZone({
        isActive,
        isDragging,
        isEmpty,
      });
      const anchor = container.firstElementChild as HTMLElement;
      const dropZone = anchor.firstElementChild as HTMLElement;
      const inner = dropZone.firstElementChild as HTMLElement;

      expect(anchor.classList.contains(styles.anchor)).toBe(true);
      expect(anchor.classList.contains(styles.active)).toBe(isActive);
      expect(anchor.classList.contains(styles.dragging)).toBe(isDragging);
      expect(anchor.classList.contains(styles.empty)).toBe(isEmpty);
      expect(dropZone.classList.contains(styles.dropZone)).toBe(true);
      expect(dropZone.classList.contains(styles.dragging)).toBe(isDragging);
      expect(inner.classList.contains(styles.inner)).toBe(true);
      expect(inner.classList.contains(styles.active)).toBe(isActive);
      expect(inner.classList.contains(styles.empty)).toBe(isEmpty);
    }
  );

  it('disables transitions on every styled layer', () => {
    const { container } = renderDropZone({ disableTransition: true });
    const anchor = container.firstElementChild as HTMLElement;
    const dropZone = anchor.firstElementChild as HTMLElement;
    const inner = dropZone.firstElementChild as HTMLElement;

    expect(anchor.classList.contains(styles.transitionDisabled)).toBe(true);
    expect(dropZone.classList.contains(styles.transitionDisabled)).toBe(true);
    expect(inner.classList.contains(styles.transitionDisabled)).toBe(true);
  });

  it('does not emit component-local theme variables', () => {
    const { container } = renderDropZone({ isActive: true });
    const anchor = container.firstElementChild as HTMLElement;
    const inner = anchor.querySelector(`.${styles.inner}`) as HTMLElement;

    expect(anchor.style.length).toBe(0);
    expect(inner.style.length).toBe(0);
  });

  it('serializes only explicit provider colors on a standalone root', () => {
    const { container } = render(
      <ThemeProvider colors={{ grey: { 300: '#abcdef' } }}>
        <DropZone {...defaultProps} isActive />
      </ThemeProvider>
    );
    const anchor = container.firstElementChild as HTMLElement;

    expect(
      anchor.style.getPropertyValue('--query-builder-color-grey-300')
    ).toBe('#abcdef');
    expect(
      anchor.style.getPropertyValue('--query-builder-color-primary-default')
    ).toBe('');
  });

  it('uses only the nearest provider variables on a standalone root', () => {
    const { container } = render(
      <ThemeProvider colors={{ primary: { default: '#123456' } }}>
        <ThemeProvider colors={{ grey: { 300: '#abcdef' } }}>
          <DropZone {...defaultProps} isActive />
        </ThemeProvider>
      </ThemeProvider>
    );
    const anchor = container.firstElementChild as HTMLElement;

    expect(
      anchor.style.getPropertyValue('--query-builder-color-grey-300')
    ).toBe('#abcdef');
    expect(
      anchor.style.getPropertyValue('--query-builder-color-primary-default')
    ).toBe('');
  });

  it('exposes every CSS Module class used by the component', () => {
    expect(styles.anchor).toBe('anchor');
    expect(styles.dropZone).toBe('dropZone');
    expect(styles.inner).toBe('inner');
    expect(styles.active).toBe('active');
    expect(styles.dragging).toBe('dragging');
    expect(styles.empty).toBe('empty');
    expect(styles.transitionDisabled).toBe('transitionDisabled');
  });
});

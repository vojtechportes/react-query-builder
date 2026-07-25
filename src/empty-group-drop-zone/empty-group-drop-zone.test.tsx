import { useDroppable } from '@dnd-kit/core';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ThemeProvider } from '../theme-provider/theme-provider';
import {
  EmptyGroupDropZone,
  IEmptyGroupDropZoneProps,
} from './empty-group-drop-zone';
import styles from './empty-group-drop-zone.module.css';

jest.mock('@dnd-kit/core', () => ({
  useDroppable: jest.fn(),
}));

const setNodeRef = jest.fn();
const defaultProps: IEmptyGroupDropZoneProps = {
  id: 'empty:root',
  index: 0,
  parentId: 'root',
  isActive: false,
  isDragging: false,
};

const renderEmptyGroupDropZone = (
  props: Partial<IEmptyGroupDropZoneProps> = {}
) => render(<EmptyGroupDropZone {...defaultProps} {...props} />);

beforeEach(() => {
  jest.clearAllMocks();
  (useDroppable as jest.Mock).mockReturnValue({ setNodeRef });
});

describe('#components/EmptyGroupDropZone', () => {
  it('registers empty droppable data and attaches its ref to the hit area', () => {
    const { container } = renderEmptyGroupDropZone();
    const hitArea = container.firstElementChild as HTMLElement;

    expect(useDroppable).toHaveBeenCalledWith({
      id: 'empty:root',
      data: {
        type: 'drop-zone',
        index: 0,
        parentId: 'root',
        isEmpty: true,
      },
    });
    expect(setNodeRef).toHaveBeenCalledWith(hitArea);
  });

  it('preserves fragment layers and the active data hook', () => {
    const { container } = renderEmptyGroupDropZone({ isActive: true });
    const hitArea = container.children[0] as HTMLElement;
    const placeholder = container.children[1] as HTMLElement;
    const inner = placeholder.firstElementChild as HTMLElement;

    expect(container.children).toHaveLength(2);
    expect(hitArea.children).toHaveLength(0);
    expect(placeholder.children).toHaveLength(1);
    expect(inner.children).toHaveLength(0);
    expect(placeholder).toHaveAttribute('data-testid', 'ActiveDropZone');
  });

  it('omits the active data hook while inactive', () => {
    const { container } = renderEmptyGroupDropZone();

    expect(container.children[1]).not.toHaveAttribute('data-testid');
  });

  it.each([
    { isActive: false, isDragging: false },
    { isActive: false, isDragging: true },
    { isActive: true, isDragging: false },
    { isActive: true, isDragging: true },
  ])(
    'maps active=$isActive dragging=$isDragging to state classes',
    ({ isActive, isDragging }) => {
      const { container } = renderEmptyGroupDropZone({
        isActive,
        isDragging,
      });
      const hitArea = container.children[0] as HTMLElement;
      const placeholder = container.children[1] as HTMLElement;
      const inner = placeholder.firstElementChild as HTMLElement;

      expect(hitArea).toHaveClass(styles.hitArea);
      expect(hitArea.classList.contains(styles.dragging)).toBe(isDragging);
      expect(placeholder).toHaveClass(styles.placeholder);
      expect(placeholder.classList.contains(styles.active)).toBe(isActive);
      expect(placeholder.classList.contains(styles.dragging)).toBe(isDragging);
      expect(inner).toHaveClass(styles.placeholderInner);
      expect(inner.classList.contains(styles.active)).toBe(isActive);
    }
  );

  it('disables transitions on both visible layers', () => {
    const { container } = renderEmptyGroupDropZone({ disableTransition: true });
    const placeholder = container.children[1] as HTMLElement;
    const inner = placeholder.firstElementChild as HTMLElement;

    expect(placeholder).toHaveClass(styles.transitionDisabled);
    expect(inner).toHaveClass(styles.transitionDisabled);
  });

  it('serializes only explicit provider colors on the placeholder inner element', () => {
    const { container } = render(
      <ThemeProvider colors={{ grey: { 500: '#654321' } }}>
        <EmptyGroupDropZone {...defaultProps} isActive />
      </ThemeProvider>
    );
    const placeholder = container.children[1] as HTMLElement;
    const inner = placeholder.firstElementChild as HTMLElement;

    expect(inner.style.getPropertyValue('--query-builder-color-grey-500')).toBe(
      '#654321'
    );
    expect(
      inner.style.getPropertyValue('--query-builder-color-primary-default')
    ).toBe('');
  });

  it('renders on the server without styled-components runtime output', () => {
    const markup = renderToString(<EmptyGroupDropZone {...defaultProps} />);

    expect(markup).toContain('class="hitArea"');
    expect(markup).toContain('class="placeholder"');
    expect(markup).not.toContain('data-styled');
  });

  it('exposes every CSS Module class used by the component', () => {
    expect(styles.hitArea).toBe('hitArea');
    expect(styles.placeholder).toBe('placeholder');
    expect(styles.placeholderInner).toBe('placeholderInner');
    expect(styles.active).toBe('active');
    expect(styles.dragging).toBe('dragging');
    expect(styles.transitionDisabled).toBe('transitionDisabled');
  });
});

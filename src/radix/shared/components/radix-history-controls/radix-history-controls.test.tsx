import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { RadixHistoryControls } from './radix-history-controls';
import styles from './radix-history-controls.module.css';

describe('#radix/components/RadixHistoryControls', () => {
  it('renders both actions and preserves incoming classes', () => {
    const { container, getByRole } = render(
      <RadixHistoryControls
        undoButton={<button type="button">Undo</button>}
        redoButton={<button type="button">Redo</button>}
        className="incoming-history"
        canUndo
        canRedo
        onUndo={jest.fn()}
        onRedo={jest.fn()}
      />
    );
    const controls = container.firstElementChild as HTMLElement;

    expect(controls).toHaveClass(styles.controls, 'incoming-history');
    expect(getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Redo' })).toBeInTheDocument();
  });
});

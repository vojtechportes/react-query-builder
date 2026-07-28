import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BootstrapHistoryControls } from './bootstrap-history-controls';

describe('#adapters/bootstrap/shared/components/bootstrap-history-controls', () => {
  it('renders its adapter behavior', () => {
    render(
      <BootstrapHistoryControls
        undoButton={<button type="button">Undo</button>}
        redoButton={<button type="button">Redo</button>}
        canUndo
        canRedo={false}
        onUndo={jest.fn()}
        onRedo={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Redo' })).toBeInTheDocument();
  });
});

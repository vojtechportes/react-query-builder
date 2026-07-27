import '@testing-library/jest-dom';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import styles from './history-controls.module.css';
import { HistoryControls } from './history-controls';

const defaultProps = {
  canUndo: true,
  canRedo: true,
  onUndo: jest.fn(),
  onRedo: jest.fn(),
};

describe('#components/HistoryControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('preserves button order, callbacks, and incoming className', () => {
    const { container, getByRole } = render(
      <HistoryControls
        {...defaultProps}
        className="consumer-history"
        undoButton={
          <button type="button" onClick={defaultProps.onUndo}>
            Undo
          </button>
        }
        redoButton={
          <button type="button" onClick={defaultProps.onRedo}>
            Redo
          </button>
        }
      />
    );
    const root = container.firstElementChild as HTMLElement;
    const buttons = root.querySelectorAll('button');

    expect(root).toHaveClass(styles.historyControls, 'consumer-history');
    expect(buttons[0]).toHaveTextContent('Undo');
    expect(buttons[1]).toHaveTextContent('Redo');

    fireEvent.click(getByRole('button', { name: 'Undo' }));
    fireEvent.click(getByRole('button', { name: 'Redo' }));

    expect(defaultProps.onUndo).toHaveBeenCalledTimes(1);
    expect(defaultProps.onRedo).toHaveBeenCalledTimes(1);
  });

  it('renders on the server without styled-components attributes', () => {
    const markup = renderToString(
      <HistoryControls
        {...defaultProps}
        undoButton={<button type="button">Undo</button>}
        redoButton={<button type="button">Redo</button>}
      />
    );

    expect(markup).toContain(`class="${styles.historyControls}"`);
    expect(markup.indexOf('Undo')).toBeLessThan(markup.indexOf('Redo'));
    expect(markup).not.toContain('data-styled');
  });

  it('exposes its CSS Module class', () => {
    expect(styles.historyControls).toBe('historyControls');
  });

  it('defines the history action grid and tokenized spacing', () => {
    const css = readFileSync(
      join(__dirname, 'history-controls.module.css'),
      'utf8'
    );

    expect(css).toContain('grid-auto-flow: column');
    expect(css).toContain('grid-auto-columns: min-content');
    expect(css).toContain('gap: var(--query-builder-control-gap, 0.5rem)');
  });
});

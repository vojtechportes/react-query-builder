import '@testing-library/jest-dom';
import { readFileSync } from 'fs';
import { join } from 'path';
import { render } from '@testing-library/react';
import React from 'react';
import { RadixGroup } from './radix-group';
import styles from './radix-group.module.css';

describe('#radix/components/RadixGroup', () => {
  it('maps drag handle and header controls to structural classes', () => {
    const { container, rerender } = render(
      <RadixGroup
        dragHandle={<span data-test="drag" />}
        controlsLeft={<span>Left</span>}
        controlsRight={<span>Right</span>}
        contentOverlay={<span data-test="overlay" />}
        className="incoming-group"
      >
        Content
      </RadixGroup>
    );
    const group = container.firstElementChild as HTMLElement;

    expect(group).toHaveClass(
      styles.group,
      styles.withDragHandle,
      'incoming-group'
    );
    expect(group.querySelector(`.${styles.header}`)).not.toBeNull();
    expect(group.querySelector(`.${styles.left}`)).not.toBeNull();
    expect(group.querySelector(`.${styles.right}`)).not.toBeNull();
    expect(group.querySelector('[data-test="overlay"]')).not.toBeNull();

    rerender(<RadixGroup>Content</RadixGroup>);

    expect(group).toHaveClass(styles.group);
    expect(group).not.toHaveClass(styles.withDragHandle);
    expect(group.querySelector(`.${styles.header}`)).toBeNull();
  });

  it('preserves the responsive 900px layout contract', () => {
    const css = readFileSync(join(__dirname, 'radix-group.module.css'), 'utf8');

    expect(css).toContain('@media (max-width: 900px)');
    expect(css).toContain('grid-template-columns: minmax(0, 1fr)');
    expect(css).toContain('justify-self: start');
  });
});

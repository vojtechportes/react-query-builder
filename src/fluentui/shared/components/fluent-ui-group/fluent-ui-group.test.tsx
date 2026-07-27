import '@testing-library/jest-dom';
import { readFileSync } from 'fs';
import { join } from 'path';
import { render } from '@testing-library/react';
import React from 'react';
import { FluentUiGroup } from './fluent-ui-group';
import styles from './fluent-ui-group.module.css';

describe('#fluentui/components/FluentUiGroup', () => {
  it('maps drag handle and header controls to layout classes', () => {
    const { container, rerender } = render(
      <FluentUiGroup
        dragHandle={<span data-test="drag" />}
        controlsLeft={<span>Left</span>}
        controlsRight={<span>Right</span>}
        contentOverlay={<span data-test="overlay" />}
        className="incoming-group"
      >
        Content
      </FluentUiGroup>
    );
    const group = container.firstElementChild as HTMLElement;
    const header = group.querySelector(`.${styles.header}`);

    expect(group).toHaveClass(
      styles.group,
      styles.withDragHandle,
      'incoming-group'
    );
    expect(header).toHaveClass(
      styles.withLeftControls,
      styles.withRightControls
    );
    expect(group.querySelector(`.${styles.left}`)).not.toBeNull();
    expect(group.querySelector(`.${styles.right}`)).not.toBeNull();
    expect(group.querySelector('[data-test="overlay"]')).not.toBeNull();

    rerender(<FluentUiGroup>Content</FluentUiGroup>);

    expect(group).toHaveClass(styles.group);
    expect(group).not.toHaveClass(styles.withDragHandle);
    expect(group.querySelector(`.${styles.header}`)).toBeNull();
  });

  it('preserves the responsive 900px layout contract', () => {
    const css = readFileSync(
      join(__dirname, 'fluent-ui-group.module.css'),
      'utf8'
    );

    expect(css).toContain('@media (max-width: 900px)');
    expect(css).toContain(
      'grid-template-columns: repeat(3, minmax(0, max-content))'
    );
  });
});

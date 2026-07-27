import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { RadixRule } from './radix-rule';
import styles from './radix-rule.module.css';

describe('#radix/components/RadixRule', () => {
  it('maps drag handle and controls to layout classes', () => {
    const { container, rerender } = render(
      <RadixRule
        dragHandle={<span data-test="drag" />}
        controls={<button type="button">Delete</button>}
        className="incoming-rule"
        data-test="Rule"
      >
        Content
      </RadixRule>
    );
    const rule = container.firstElementChild as HTMLElement;

    expect(rule).toHaveClass(
      styles.rule,
      styles.withDragHandle,
      styles.withControls,
      'incoming-rule'
    );
    expect(rule).toHaveAttribute('data-test', 'Rule');
    expect(rule.querySelector(`.${styles.controls}`)).not.toBeNull();

    rerender(<RadixRule controls={null}>Content</RadixRule>);

    expect(rule).toHaveClass(styles.rule);
    expect(rule).not.toHaveClass(styles.withDragHandle, styles.withControls);
    expect(rule.querySelector(`.${styles.body}`)).toHaveClass(
      styles.bodyWithoutControls
    );
    expect(rule.querySelector(`.${styles.controls}`)).toBeNull();
  });
});

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { FluentUiRule } from './fluent-ui-rule';
import styles from './fluent-ui-rule.module.css';

describe('#fluentui/components/FluentUiRule', () => {
  it('maps drag handle and controls to layout classes', () => {
    const { container, rerender } = render(
      <FluentUiRule
        dragHandle={<span data-test="drag" />}
        controls={<button type="button">Delete</button>}
        className="incoming-rule"
        data-test="Rule"
      >
        Content
      </FluentUiRule>
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

    rerender(<FluentUiRule controls={null}>Content</FluentUiRule>);

    expect(rule).toHaveClass(styles.rule);
    expect(rule).not.toHaveClass(styles.withDragHandle, styles.withControls);
    expect(rule.querySelector(`.${styles.body}`)).toHaveClass(
      styles.bodyWithoutControls
    );
    expect(rule.querySelector(`.${styles.controls}`)).toBeNull();
  });
});

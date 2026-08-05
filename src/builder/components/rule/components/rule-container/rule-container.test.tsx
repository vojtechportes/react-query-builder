import React from 'react';
import { readFileSync } from 'fs';
import { join } from 'path';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Rule } from './rule-container';
import styles from './rule-container.module.css';

describe('#components/RuleContainer', () => {
  it.each([
    [false, false],
    [true, false],
    [false, true],
    [true, true],
  ])(
    'maps dragHandle=%s controls=%s to finite container state',
    (hasDragHandle, hasControls) => {
      const { container } = render(
        <Rule
          dragHandle={hasDragHandle ? <span data-test="drag" /> : null}
          controls={hasControls ? <button type="button">Control</button> : null}
          className="incoming-rule"
          data-test="rule-container"
        >
          Content
        </Rule>
      );
      const rule = container.firstElementChild as HTMLElement;
      const content = rule.children[hasDragHandle ? 1 : 0] as HTMLElement;

      expect(rule).toHaveClass(styles.rule, 'incoming-rule');
      expect(rule.classList.contains(styles.withDragHandle)).toBe(
        hasDragHandle
      );
      expect(rule.classList.contains(styles.withControls)).toBe(hasControls);
      expect(rule).toHaveAttribute(
        'data-rule-has-drag-handle',
        String(hasDragHandle)
      );
      expect(rule).toHaveAttribute(
        'data-rule-has-controls',
        String(hasControls)
      );
      expect(content).toHaveClass(styles.content);
      expect(content.classList.contains(styles.contentWithoutControls)).toBe(
        !hasControls
      );
      expect(Boolean(rule.querySelector(`.${styles.controls}`))).toBe(
        hasControls
      );
    }
  );

  it('defines container tokens and responsive control layouts', () => {
    const containerCss = readFileSync(
      join(__dirname, 'rule-container.module.css'),
      'utf8'
    );
    const narrowContainerCss = containerCss.slice(
      containerCss.indexOf('@media (max-width: 640px)')
    );

    expect(containerCss).toContain(
      'background-color: var(--query-builder-color-background)'
    );
    expect(containerCss).toContain(
      'border: 1px solid var(--query-builder-color-grey-300)'
    );
    expect(containerCss).toContain('.withDragHandle.withControls');
    expect(containerCss).toContain('@media (max-width: 900px)');
    expect(containerCss).toContain('@media (max-width: 640px)');
    expect(narrowContainerCss).toMatch(
      /\.withControls\s*\{\s*grid-template-columns: 1fr;\s*\}/
    );
    expect(narrowContainerCss).toMatch(
      /\.withDragHandle\.withControls\s*\{\s*grid-template-columns: auto 1fr;\s*\}/
    );
    expect(narrowContainerCss).toMatch(
      /\.withControls \.controls\s*\{[^}]*grid-column: 1 \/ -1;[^}]*padding-left: 0\.7rem;[^}]*\}/
    );
    expect(narrowContainerCss).toMatch(
      /\.withDragHandle\.withControls \.controls\s*\{\s*grid-column: 2;\s*\}/
    );
  });
});

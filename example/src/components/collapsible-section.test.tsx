/* @vitest-environment jsdom */

import * as React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { CollapsibleSection } from './collapsible-section';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const chevronDownPath =
  'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z';
const chevronUpPath =
  'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z';

describe('CollapsibleSection', () => {
  it('toggles its copy and content through the native summary control', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    try {
      await act(async () => {
        root.render(
          <CollapsibleSection
            collapsedLabel="Show generated query"
            expandedLabel="Hide generated query"
          >
            <p>Generated content</p>
          </CollapsibleSection>
        );
      });

      const details = container.querySelector('details');
      const summary = container.querySelector('summary');
      const collapsedLabel = container.querySelector(
        "[data-label='collapsed']"
      );
      const expandedLabel = container.querySelector("[data-label='expanded']");
      const icons = Array.from(container.querySelectorAll('svg'));
      const paths = icons.map((icon) =>
        icon.querySelector('path')?.getAttribute('d')
      );

      expect(details?.open).toBe(false);
      expect(collapsedLabel?.textContent).toBe('Show generated query');
      expect(expandedLabel?.textContent).toBe('Hide generated query');
      expect(getComputedStyle(collapsedLabel as Element).display).not.toBe(
        'none'
      );
      expect(getComputedStyle(expandedLabel as Element).display).toBe('none');
      expect(container.textContent).toContain('Generated content');
      expect(icons).toHaveLength(2);
      expect(icons.every((icon) => icon.getAttribute('width') === '16')).toBe(
        true
      );
      expect(paths).toEqual([chevronDownPath, chevronUpPath]);

      await act(async () => {
        summary?.click();
      });

      expect(details?.open).toBe(true);
      expect(getComputedStyle(collapsedLabel as Element).display).toBe('none');
      expect(getComputedStyle(expandedLabel as Element).display).not.toBe(
        'none'
      );

      await act(async () => {
        summary?.click();
      });

      expect(details?.open).toBe(false);
      expect(getComputedStyle(collapsedLabel as Element).display).not.toBe(
        'none'
      );
      expect(getComputedStyle(expandedLabel as Element).display).toBe('none');
    } finally {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    }
  });
});

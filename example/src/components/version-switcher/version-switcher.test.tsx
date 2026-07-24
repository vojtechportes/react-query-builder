/* @vitest-environment jsdom */

import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { VersionSwitcher } from './version-switcher';

beforeEach(() => {
  window.scrollTo = vi.fn();
});

afterEach(() => {
  cleanup();
});

const renderSwitcher = (
  currentVersion: 'v1' | 'v2',
  path = '/documentation/usage?tab=api#example',
  basename?: string
) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <VersionSwitcher basename={basename} currentVersion={currentVersion} />
    </MemoryRouter>
  );

describe('VersionSwitcher', () => {
  it.each([
    ['v1', 'v2'],
    ['v2', 'v1'],
  ] as const)(
    'shows %s as active and links to the equivalent %s route',
    async (currentVersion, targetVersion) => {
      const user = userEvent.setup();

      renderSwitcher(currentVersion);

      const trigger = screen.getByRole('button', {
        name: `Documentation version. Current version: ${currentVersion}`,
      });

      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(
        screen.getByRole('menuitemradio', {
          name: `Documentation ${currentVersion}, current version`,
        })
      ).toHaveAttribute('aria-checked', 'true');
      expect(
        screen.getByRole('menuitemradio', {
          name: `Switch to documentation ${targetVersion}`,
        })
      ).toHaveAttribute(
        'href',
        `/${targetVersion}/documentation/usage?tab=api#example`
      );
    }
  );

  it('supports menu keyboard navigation and restores trigger focus on Escape', async () => {
    const user = userEvent.setup();

    renderSwitcher('v1');

    const trigger = screen.getByRole('button', {
      name: 'Documentation version. Current version: v1',
    });

    trigger.focus();
    await user.keyboard('{ArrowDown}');

    const currentOption = screen.getByRole('menuitemradio', {
      name: 'Documentation v1, current version',
    });
    const targetOption = screen.getByRole('menuitemradio', {
      name: 'Switch to documentation v2',
    });

    expect(currentOption).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(targetOption).toHaveFocus();

    await user.keyboard('{Home}');
    expect(currentOption).toHaveFocus();

    await user.keyboard('{End}');
    expect(targetOption).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('activates focused menu choices with Enter and Space', async () => {
    const user = userEvent.setup();

    renderSwitcher('v1');

    const trigger = screen.getByRole('button', {
      name: 'Documentation version. Current version: v1',
    });

    trigger.focus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    trigger.focus();
    await user.keyboard('{ArrowUp}');

    const targetOption = screen.getByRole('menuitemradio', {
      name: 'Switch to documentation v2',
    });
    const targetClick = vi.fn((event: Event) => event.preventDefault());

    targetOption.addEventListener('click', targetClick);
    await user.keyboard(' ');

    expect(targetClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('opens with ArrowUp on the last option', async () => {
    const user = userEvent.setup();

    renderSwitcher('v1');

    const trigger = screen.getByRole('button', {
      name: 'Documentation version. Current version: v1',
    });

    trigger.focus();
    await user.keyboard('{ArrowUp}');

    expect(
      screen.getByRole('menuitemradio', {
        name: 'Switch to documentation v2',
      })
    ).toHaveFocus();
  });

  it('dismisses on outside interaction and Tab', async () => {
    const user = userEvent.setup();

    renderSwitcher('v1');

    const trigger = screen.getByRole('button', {
      name: 'Documentation version. Current version: v1',
    });

    await user.click(trigger);
    await user.click(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(trigger);
    await user.tab();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('keeps the active choice operable without reloading and supports a deployment basename', async () => {
    const user = userEvent.setup();

    renderSwitcher(
      'v1',
      '/api/builder?tab=props#theme',
      '/react-query-builder/'
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Documentation version. Current version: v1',
      })
    );

    const currentOption = screen.getByRole('menuitemradio', {
      name: 'Documentation v1, current version',
    });

    expect(currentOption).toHaveAttribute(
      'href',
      '/react-query-builder/v1/api/builder?tab=props#theme'
    );
    expect(
      screen.getByRole('menuitemradio', {
        name: 'Switch to documentation v2',
      })
    ).toHaveAttribute(
      'href',
      '/react-query-builder/v2/api/builder?tab=props#theme'
    );

    await user.click(currentOption);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

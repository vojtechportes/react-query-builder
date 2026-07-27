/* @vitest-environment jsdom */

import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@vojtechportes/react-query-builder', async (importOriginal) => {
  const { colors } =
    await importOriginal<typeof import('@vojtechportes/react-query-builder')>();

  return {
    colors,
    Builder: ({ strings }: { strings?: { group?: { addRule?: string } } }) => (
      <div data-testid="builder">{strings?.group?.addRule}</div>
    ),
    ThemeProvider: ({ children }: React.PropsWithChildren) => children,
  };
});

vi.mock('@vojtechportes/react-query-builder/antd/v6', () => ({
  components: {},
}));
vi.mock('@vojtechportes/react-query-builder/bootstrap/v5', () => ({
  components: {},
}));
vi.mock('@vojtechportes/react-query-builder/fluentui/v8', () => ({
  components: {},
}));
vi.mock('@vojtechportes/react-query-builder/mantine/v9', () => ({
  components: {},
}));
vi.mock('@vojtechportes/react-query-builder/mui/v9', () => ({
  components: {},
}));
vi.mock('@vojtechportes/react-query-builder/radix/v1', () => ({
  components: {},
}));
vi.mock('@vojtechportes/react-query-builder/monaco', () => ({
  createMonacoComponents: (components: unknown) => components,
}));
vi.mock('@mantine/core', () => ({
  MantineProvider: ({ children }: React.PropsWithChildren) => children,
}));
vi.mock('@radix-ui/themes', () => ({
  Theme: ({ children }: React.PropsWithChildren) => children,
}));
vi.mock('./mui-builder-surface', () => ({
  MuiBuilderSurface: ({ children }: React.PropsWithChildren) => (
    <div>{children}</div>
  ),
}));

import { localeStrings } from '../constants/locale-strings';
import { localeOptions } from '../constants/locale-options';
import { DemoPlayground } from './demo-playground';

afterEach(cleanup);

describe('DemoPlayground locale selection', () => {
  it('lists every locale, defaults to en-US, and follows node placement', () => {
    render(<DemoPlayground />);

    const placementSelect = screen.getByLabelText('New node placement');
    const localeSelect = screen.getByLabelText('Locale');

    expect(localeSelect).toHaveValue('en-US');
    expect(within(localeSelect).getAllByRole('option')).toHaveLength(10);
    expect(
      within(localeSelect)
        .getAllByRole('option')
        .map((option) => option.getAttribute('value'))
    ).toEqual(localeOptions.map((option) => option.id));
    expect(
      placementSelect.compareDocumentPosition(localeSelect) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('changes Builder strings without resetting query data', async () => {
    const user = userEvent.setup();
    render(<DemoPlayground />);

    const outputHeading = screen.getByText('Native output');
    const outputBefore = outputHeading.parentElement?.textContent;

    await user.selectOptions(screen.getByLabelText('Locale'), 'fr-FR');

    expect(await screen.findByTestId('builder')).toHaveTextContent(
      localeStrings['fr-FR'].group?.addRule ?? ''
    );
    expect(outputHeading.parentElement?.textContent).toBe(outputBefore);
  });

  it('renders CJK translations through the Demo selector', async () => {
    const user = userEvent.setup();
    render(<DemoPlayground />);

    await user.selectOptions(screen.getByLabelText('Locale'), 'zh-TW');

    expect(await screen.findByTestId('builder')).toHaveTextContent(
      localeStrings['zh-TW'].group?.addRule ?? ''
    );
  });
  it.each([
    'MUI adapter',
    'ANTD adapter',
    'Fluent UI adapter',
    'Mantine adapter',
    'Bootstrap adapter',
    'Radix adapter',
  ])('keeps localized strings in the %s path', async (adapterName) => {
    const user = userEvent.setup();
    render(<DemoPlayground />);

    await user.selectOptions(screen.getByLabelText('Locale'), 'de-DE');
    await user.click(screen.getByRole('radio', { name: adapterName }));

    expect(await screen.findByTestId('builder')).toHaveTextContent(
      localeStrings['de-DE'].group?.addRule ?? ''
    );
  });
});

/* @vitest-environment jsdom */

import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@vojtechportes/react-query-builder', async (importOriginal) => {
  const { colors } =
    await importOriginal<typeof import('@vojtechportes/react-query-builder')>();

  return {
    colors,
    Builder: ({
      strings,
      readOnly,
      readOnlyProtectsDelete,
      lockable,
      cloneable,
      draggable,
      allowGroupNegation,
      allowFieldComparisons,
      newNodePlacement,
      history,
      textMode,
      defaultMode,
      singleRootGroup,
      useDefaultContainerStyles,
      colorScheme,
      showValidation,
      components,
      style,
    }: {
      strings?: { group?: { addRule?: string } };
      readOnly?: boolean;
      readOnlyProtectsDelete?: boolean;
      lockable?: boolean;
      cloneable?: boolean;
      draggable?: boolean;
      allowGroupNegation?: boolean;
      allowFieldComparisons?: boolean;
      newNodePlacement?: string;
      history?: boolean;
      textMode?: boolean;
      defaultMode?: string;
      singleRootGroup?: boolean;
      useDefaultContainerStyles?: boolean;
      colorScheme?: 'light' | 'dark';
      showValidation?: boolean;
      components?: unknown;
      style?: React.CSSProperties;
    }) => (
      <div>
        <div data-testid="builder" style={style}>
          {strings?.group?.addRule}
        </div>
        <output data-testid="builder-props">
          {JSON.stringify({
            readOnly,
            readOnlyProtectsDelete,
            lockable,
            cloneable,
            draggable,
            allowGroupNegation,
            allowFieldComparisons,
            newNodePlacement,
            history,
            textMode,
            defaultMode,
            singleRootGroup,
            useDefaultContainerStyles,
            colorScheme,
            showValidation,
            hasComponents: Boolean(components),
          })}
        </output>
      </div>
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
  it('wires behavior controls, output formats, and generated source', async () => {
    const user = userEvent.setup();
    render(<DemoPlayground />);

    expect(
      screen.getByRole('button', { name: 'Elasticsearch' })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'RSQL' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'SQL' }));
    expect(screen.getByText('SQL output')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Show Builder source' })
    );
    expect(screen.getByText('Builder source')).toBeInTheDocument();

    expect(
      screen.getByRole('checkbox', { name: 'Use default container styles' })
    ).toBeChecked();
    expect(
      JSON.parse(screen.getByTestId('builder-props').textContent ?? '')
    ).toMatchObject({ useDefaultContainerStyles: true });

    for (const checkboxName of [
      'Read-only mode',
      'Lock controls',
      'Clone controls',
      'Draggable nodes',
      'Allow group negation',
      'Allow field comparisons',
      'Undo / redo history',
      'Use default container styles',
      'Show validation errors',
    ]) {
      await user.click(screen.getByRole('checkbox', { name: checkboxName }));
    }
    await user.selectOptions(
      screen.getByLabelText('New node placement'),
      'prepend'
    );

    expect(
      JSON.parse(screen.getByTestId('builder-props').textContent ?? '')
    ).toMatchObject({
      readOnly: true,
      readOnlyProtectsDelete: true,
      lockable: true,
      cloneable: true,
      draggable: true,
      allowGroupNegation: false,
      allowFieldComparisons: false,
      newNodePlacement: 'prepend',
      history: true,
      singleRootGroup: true,
      useDefaultContainerStyles: false,
      showValidation: false,
    });
    expect(
      screen.getByText('Builder source').parentElement?.parentElement
        ?.textContent
    ).toContain('readOnly');
    expect(
      screen.getByText('Builder source').parentElement?.parentElement
        ?.textContent
    ).toContain('useDefaultContainerStyles={false}');
  });

  it('switches dark mode only for default components and restores it', async () => {
    const user = userEvent.setup();
    render(<DemoPlayground />);

    const darkMode = screen.getByRole('checkbox', { name: 'Dark mode' });
    const defaultComponents = screen.getByRole('radio', {
      name: 'Default components',
    });

    expect(defaultComponents.closest('label')?.nextElementSibling).toBe(
      darkMode.closest('label')
    );
    expect(darkMode).toBeEnabled();
    expect(darkMode).not.toBeChecked();
    expect(
      JSON.parse(screen.getByTestId('builder-props').textContent ?? '')
    ).toMatchObject({ colorScheme: 'light' });

    await user.click(darkMode);

    expect(
      JSON.parse(screen.getByTestId('builder-props').textContent ?? '')
    ).toMatchObject({ colorScheme: 'dark' });

    await user.click(
      screen.getByRole('button', { name: 'Show Builder source' })
    );

    const darkSource =
      screen.getByText('Builder source').parentElement?.parentElement
        ?.textContent;

    expect(darkSource).toContain(
      "import '@vojtechportes/react-query-builder/dark-mode.variables.css';"
    );
    expect(darkSource).toContain('colorScheme="dark"');

    await user.click(screen.getByRole('radio', { name: 'MUI adapter' }));

    expect(darkMode).toBeDisabled();
    expect(darkMode).toBeChecked();
    expect(
      JSON.parse(screen.getByTestId('builder-props').textContent ?? '')
    ).not.toHaveProperty('colorScheme');

    await user.click(screen.getByRole('radio', { name: 'Default components' }));

    expect(darkMode).toBeEnabled();
    expect(darkMode).toBeChecked();
    expect(
      JSON.parse(screen.getByTestId('builder-props').textContent ?? '')
    ).toMatchObject({ colorScheme: 'dark' });
  });
  it('preserves text, Monaco, and single-root dependencies', async () => {
    const user = userEvent.setup();
    render(<DemoPlayground />);

    expect(
      screen.getByRole('checkbox', {
        name: 'Open in text mode (requires text editor mode)',
      })
    ).toBeDisabled();
    expect(
      screen.getByRole('checkbox', {
        name: 'Monaco text editor (requires text editor mode)',
      })
    ).toBeDisabled();

    await user.click(
      screen.getByRole('checkbox', { name: 'Text editor mode' })
    );
    await user.click(
      screen.getByRole('checkbox', { name: 'Open in text mode' })
    );
    await user.click(
      screen.getByRole('checkbox', { name: 'Monaco text editor' })
    );

    expect(
      JSON.parse(screen.getByTestId('builder-props').textContent ?? '')
    ).toMatchObject({
      textMode: true,
      defaultMode: 'text',
      hasComponents: true,
      colorScheme: 'light',
    });

    await user.click(screen.getByRole('checkbox', { name: 'Dark mode' }));

    expect(
      JSON.parse(screen.getByTestId('builder-props').textContent ?? '')
    ).toMatchObject({
      hasComponents: true,
      colorScheme: 'dark',
    });

    await user.click(
      screen.getByRole('button', { name: 'Show Builder source' })
    );

    const monacoDarkSource =
      screen.getByText('Builder source').parentElement?.parentElement
        ?.textContent;

    expect(monacoDarkSource).toContain('createMonacoComponents({})');
    expect(monacoDarkSource).toContain('dark-mode.variables.css');
    expect(monacoDarkSource).toContain('colorScheme="dark"');

    await user.click(
      screen.getByRole('checkbox', { name: 'Single root group' })
    );

    expect(
      screen.getByRole('checkbox', {
        name: 'Text editor mode (requires single root group)',
      })
    ).toBeDisabled();
    expect(
      JSON.parse(screen.getByTestId('builder-props').textContent ?? '')
    ).toMatchObject({ textMode: false, singleRootGroup: false });
  });

  it('applies CSS variables per Builder and emits copy-ready source', async () => {
    const user = userEvent.setup();
    render(<DemoPlayground />);

    fireEvent.change(screen.getByLabelText('Primary'), {
      target: { value: '#123456' },
    });
    await user.clear(screen.getByLabelText('Builder padding'));
    await user.type(screen.getByLabelText('Builder padding'), '1.5rem');
    await user.clear(screen.getByLabelText('Control radius'));
    await user.type(screen.getByLabelText('Control radius'), '10px');
    await user.clear(screen.getByLabelText('Builder shadow'));
    await user.type(
      screen.getByLabelText('Builder shadow'),
      '0 12px 30px rgb(15 23 42 / 20%)'
    );

    const builder = screen.getByTestId('builder');

    expect(
      builder.style.getPropertyValue('--query-builder-color-primary-default')
    ).toBe('#123456');
    expect(builder.style.getPropertyValue('--query-builder-root-padding')).toBe(
      '1.5rem'
    );
    expect(builder.style.getPropertyValue('--query-builder-radius-sm')).toBe(
      '10px'
    );
    expect(builder.style.getPropertyValue('--query-builder-shadow-root')).toBe(
      '0 12px 30px rgb(15 23 42 / 20%)'
    );

    await user.click(
      screen.getByRole('button', { name: 'Show Builder source' })
    );

    const source =
      screen.getByText('Builder source').parentElement?.parentElement
        ?.textContent;

    expect(source).toContain(
      "import '@vojtechportes/react-query-builder/styles.css';"
    );
    expect(source).toContain('const builderStyle: IBuilderStyle');
    expect(source).toContain('--query-builder-root-padding');
    expect(source).toContain('style={builderStyle}');
    expect(source).not.toContain('ThemeProvider');

    await user.click(screen.getByRole('radio', { name: 'MUI adapter' }));

    expect(screen.getByLabelText('Primary')).toBeDisabled();
    expect(
      screen.getByText(/The MUI adapter uses Material UI styling/)
    ).toBeInTheDocument();
  });
});

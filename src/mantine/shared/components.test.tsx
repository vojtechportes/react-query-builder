import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Builder, IBuilderFieldProps, IStrings } from '../../index';
import { components as mantineV8Components } from '../v8';
import { components as mantineV9Components } from '../v9';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;

const fields: IBuilderFieldProps[] = [
  {
    field: 'status',
    label: 'Status',
    type: 'TEXT',
    operators: ['EQUAL'],
  },
];

const data = [
  {
    type: 'GROUP' as const,
    value: 'AND' as const,
    isNegated: false,
    children: [
      {
        field: 'status',
        operator: 'EQUAL' as const,
        value: 'active',
      },
    ],
  },
];

const untranslatedData = [
  {
    type: 'GROUP' as const,
    value: 'AND' as const,
    isNegated: false,
    children: [
      {
        field: '',
      },
    ],
  },
];

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe('#mantine/components', () => {
  it('renders the builder with the Mantine v8 component mapping', () => {
    renderWithMantine(
      <Builder
        fields={fields}
        data={data}
        components={mantineV8Components}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders the builder with the Mantine v9 component mapping', () => {
    renderWithMantine(
      <Builder
        fields={fields}
        data={data}
        components={mantineV9Components}
        history
        onChange={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Redo' })).toBeInTheDocument();
  });

  it('renders history and text-mode toolbar actions with the Mantine button adapter', () => {
    renderWithMantine(
      <Builder
        fields={fields}
        data={data}
        components={mantineV9Components}
        history
        textMode
        onChange={jest.fn()}
      />
    );

    const textModeToggle = screen.getByRole('button', {
      name: 'Switch to text mode',
    });

    expect(textModeToggle.className).toContain('mantine-Button-root');
    expect(textModeToggle.querySelector('svg')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Undo' }).className).toContain(
      'mantine-Button-root'
    );
    expect(screen.getByRole('button', { name: 'Redo' }).className).toContain(
      'mantine-Button-root'
    );
  });

  it('renders the SQL text editor with the Mantine text-mode input adapter', () => {
    renderWithMantine(
      <Builder
        fields={fields}
        data={data}
        components={mantineV9Components}
        textMode
        defaultMode="text"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole('textbox')).toHaveClass('builder-text-mode-input-field');
  });

  it('renders the locked text-mode warning with the Mantine alert adapter', () => {
    const { container } = renderWithMantine(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                field: 'status',
                operator: 'EQUAL',
                value: 'active',
                readOnly: true,
              },
            ],
          },
        ]}
        components={mantineV9Components}
        textMode
        onChange={jest.fn()}
      />
    );

    expect(
      container.querySelector('[data-test="TextModeBlockedAlert"]')
    ).toHaveClass('mantine-Alert-root');
  });

  it('uses builder strings for adapter copy', () => {
    const strings: IStrings = {
      form: {
        selectYourValue: 'Choose a translated value',
      },
      group: {
        clone: 'Duplicate group',
        lock: 'Protect group',
        lockDescendants: 'Protect group and children',
        unlockDescendants: 'Unprotect group and children',
      },
      rule: {
        clone: 'Duplicate rule',
      },
    };

    renderWithMantine(
      <Builder
        fields={fields}
        data={untranslatedData}
        components={mantineV9Components}
        strings={strings}
        cloneable
        lockable
        singleRootGroup={false}
        onChange={jest.fn()}
      />
    );

    expect(
      screen.getByPlaceholderText('Choose a translated value')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Duplicate group' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Protect group' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Duplicate rule' })
    ).toBeInTheDocument();
  });
});

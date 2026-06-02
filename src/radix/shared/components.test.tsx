import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Theme } from '@radix-ui/themes';
import { Builder, IBuilderFieldProps, IStrings } from '../../index';
import { components as radixV1Components } from '../v1';

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

const renderWithRadix = (ui: React.ReactElement) => render(<Theme>{ui}</Theme>);

describe('#radix/components', () => {
  it('renders the builder with the Radix v1 component mapping', () => {
    renderWithRadix(
      <Builder
        fields={fields}
        data={data}
        components={radixV1Components}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders history and text-mode toolbar actions with the Radix button adapter', () => {
    renderWithRadix(
      <Builder
        fields={fields}
        data={data}
        components={radixV1Components}
        history
        textMode
        onChange={jest.fn()}
      />
    );

    const textModeToggle = screen.getByRole('button', {
      name: 'Switch to text mode',
    });

    expect(textModeToggle.className).toContain('rt-Button');
    expect(screen.getByRole('button', { name: 'Undo' }).className).toContain(
      'rt-Button'
    );
    expect(screen.getByRole('button', { name: 'Redo' }).className).toContain(
      'rt-Button'
    );
  });

  it('renders the SQL text editor with the Radix text-mode input adapter', () => {
    renderWithRadix(
      <Builder
        fields={fields}
        data={data}
        components={radixV1Components}
        textMode
        defaultMode="text"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole('textbox')).toHaveClass('builder-text-mode-input-field');
  });

  it('renders the locked text-mode warning with the Radix alert adapter', () => {
    const { container } = renderWithRadix(
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
        components={radixV1Components}
        textMode
        onChange={jest.fn()}
      />
    );

    expect(container.querySelector('[data-test="TextModeBlockedAlert"]')).not.toBeNull();
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

    renderWithRadix(
      <Builder
        fields={fields}
        data={untranslatedData}
        components={radixV1Components}
        strings={strings}
        cloneable
        lockable
        singleRootGroup={false}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('Choose a translated value')).toBeInTheDocument();
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

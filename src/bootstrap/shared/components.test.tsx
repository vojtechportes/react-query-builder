import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Builder, IBuilderFieldProps } from '../../index';
import { components as bootstrapComponents } from '../v5';

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

describe('#bootstrap/components', () => {
  it('renders the builder with the Bootstrap component mapping', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={bootstrapComponents}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('active')).toHaveClass('form-control');
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('btn');
  });

  it('renders history and text-mode toolbar actions with Bootstrap button styling', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={bootstrapComponents}
        history
        textMode
        onChange={jest.fn()}
      />
    );

    const textModeToggle = screen.getByRole('button', {
      name: 'Switch to text mode',
    });

    expect(textModeToggle).toHaveClass('btn');
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveClass('btn');
    expect(screen.getByRole('button', { name: 'Redo' })).toHaveClass('btn');

    fireEvent.click(textModeToggle);

    expect(screen.getByRole('button', { name: 'Switch to builder mode' })).toHaveClass(
      'btn'
    );
  });

  it('renders the SQL text editor with Bootstrap text-mode input styling', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={bootstrapComponents}
        textMode
        defaultMode="text"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole('textbox')).toHaveClass('form-control');
  });

  it('renders the locked text-mode warning with Bootstrap alert styling', () => {
    const AlertComponent = bootstrapComponents.Alert!;

    expect(AlertComponent).toBeDefined();

    const { container } = render(
      <AlertComponent severity="warning" variant="outlined" data-test="TextModeBlockedAlert">
        Locked rules or groups are not supported in the text editor under this configuration.
      </AlertComponent>
    );

    expect(
      container.querySelector('[data-test="TextModeBlockedAlert"]')
    ).toHaveClass('alert');
  });
});

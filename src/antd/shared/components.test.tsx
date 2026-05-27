import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Builder, IBuilderFieldProps } from '../../index';
import { components as antdV5Components } from '../v5';
import { components as antdV6Components } from '../v6';

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

describe('#antd/components', () => {
  it('renders the builder with the ANTD v5 component mapping', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={antdV5Components}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders the builder with the ANTD v6 component mapping', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={antdV6Components}
        history
        onChange={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Redo' })).toBeInTheDocument();
  });

  it('renders history and text-mode toolbar actions with the ANTD button adapter', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={antdV6Components}
        history
        textMode
        onChange={jest.fn()}
      />
    );

    const textModeToggle = screen.getByRole('button', {
      name: 'Switch to text mode',
    });

    expect(textModeToggle).toHaveClass('ant-btn');
    expect(textModeToggle.querySelector('[aria-label="code"]')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveClass('ant-btn');
    expect(screen.getByRole('button', { name: 'Redo' })).toHaveClass('ant-btn');

    fireEvent.click(textModeToggle);

    expect(
      screen.getByRole('button', { name: 'Switch to builder mode' }).querySelector(
        '[aria-label="appstore"]'
      )
    ).not.toBeNull();
  });

  it('renders the SQL text editor with the ANTD text-mode input adapter', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={antdV6Components}
        textMode
        defaultMode="text"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole('textbox')).toHaveClass('ant-input');
  });

  it('renders the locked text-mode warning with the ANTD alert adapter', () => {
    const AlertComponent = antdV6Components.Alert!;

    expect(AlertComponent).toBeDefined();

    const { container } = render(
      <AlertComponent severity="warning" variant="outlined" data-test="TextModeBlockedAlert">
        Locked rules or groups are not supported in the text editor under this configuration.
      </AlertComponent>
    );

    expect(
      container.querySelector('[data-test="TextModeBlockedAlert"]')
    ).toHaveClass('ant-alert');
  });
});

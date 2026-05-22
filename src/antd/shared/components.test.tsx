import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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
});

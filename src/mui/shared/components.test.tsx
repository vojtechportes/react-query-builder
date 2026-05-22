import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Builder, IBuilderFieldProps, IStrings } from '../../index';
import { components as muiV7Components } from '../v7';
import { components as muiV9Components } from '../v9';

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

describe('#mui/components', () => {
  it('renders the builder with the MUI v7 component mapping', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={muiV7Components}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders the builder with the MUI v9 component mapping', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={muiV9Components}
        history
        onChange={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Redo' })).toBeInTheDocument();
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

    render(
      <Builder
        fields={fields}
        data={untranslatedData}
        components={muiV9Components}
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

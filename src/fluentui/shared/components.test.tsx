import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Builder, IBuilderFieldProps, IStrings } from '../../index';
import { components as fluentUiV8Components } from '../v8';

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

describe('#fluentui/components', () => {
  it('renders the builder with the Fluent UI v8 component mapping', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={fluentUiV8Components}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders history and text-mode toolbar actions with the Fluent UI button adapter', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={fluentUiV8Components}
        history
        textMode
        onChange={jest.fn()}
      />
    );

    const textModeToggle = screen.getByRole('button', {
      name: 'Switch to text mode',
    });

    expect(textModeToggle).toHaveClass('ms-Button');
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveClass('ms-Button');
    expect(screen.getByRole('button', { name: 'Redo' })).toHaveClass('ms-Button');
  });

  it('renders the SQL text editor with the Fluent UI text-mode input adapter', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={fluentUiV8Components}
        textMode
        defaultMode="text"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole('textbox')).toHaveClass('ms-TextField-field');
  });

  it('renders the locked text-mode warning with the Fluent UI alert adapter', () => {
    const { container } = render(
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
        components={fluentUiV8Components}
        textMode
        onChange={jest.fn()}
      />
    );

    expect(
      container
        .querySelector('[data-test="TextModeBlockedAlert"]')
        ?.closest('.ms-MessageBar')
    ).not.toBeNull();
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
        components={fluentUiV8Components}
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

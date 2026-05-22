import React from 'react';
import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  Builder,
  defaultComponents,
  IBuilderFieldProps,
  IBuilderProps,
} from './index';

export const fields: IBuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'TEXT',
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
  {
    field: 'MOCK_NUMBER',
    label: 'Mock Number',
    type: 'NUMBER',
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
];

const queryByDataTest = (
  container: HTMLElement,
  value: string
): HTMLElement | null =>
  container.querySelector(`[data-test="${value}"]`);

const getByDataTest = (container: HTMLElement, value: string): HTMLElement => {
  const element = queryByDataTest(container, value);

  if (!element) {
    throw new Error(`Unable to find element with data-test="${value}"`);
  }

  return element;
};

const getAllByDataTest = (
  container: HTMLElement,
  value: string
): HTMLElement[] =>
  Array.from(container.querySelectorAll(`[data-test="${value}"]`));

describe('#components/Builder', () => {
  it('Test full functionality', () => {
    const onChange = jest.fn();

    render(<Builder fields={fields} data={[]} onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('Updates rendered criteria when data prop changes', () => {
    const { container, rerender } = render(
      <Builder fields={fields} data={[]} onChange={jest.fn()} />
    );

    expect(getAllByDataTest(container, 'IteratorRule')).toHaveLength(0);

    rerender(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'MOCK_FIELD', value: '', operator: 'EQUAL' }],
          },
        ]}
        onChange={jest.fn()}
      />
    );

    expect(getAllByDataTest(container, 'IteratorRule')).toHaveLength(1);
  });

  it('Only renders drag handles when draggable is enabled', () => {
    const props: IBuilderProps = {
      fields,
      data: [
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [{ field: 'MOCK_FIELD', value: '', operator: 'EQUAL' }],
        },
      ],
      onChange: jest.fn(),
    };
    const { container, rerender } = render(<Builder {...props} />);

    expect(getAllByDataTest(container, 'DragHandle')).toHaveLength(0);

    rerender(<Builder {...props} draggable />);

    expect(getAllByDataTest(container, 'DragHandle').length).toBeGreaterThan(0);
  });

  it('Does not render clone controls when cloneable is disabled', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'MOCK_FIELD', value: '', operator: 'EQUAL' }],
          },
        ]}
        onChange={jest.fn()}
      />
    );

    expect(getAllByDataTest(container, 'CloneButton[group]')).toHaveLength(0);
    expect(getAllByDataTest(container, 'CloneButton[rule]')).toHaveLength(0);
  });

  it('Does not render history controls unless history is enabled', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        singleRootGroup={false}
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'Undo')).toBeNull();
    expect(queryByDataTest(container, 'Redo')).toBeNull();
  });

  it('Uses a custom HistoryControls component while preserving built-in undo and redo buttons', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        singleRootGroup={false}
        history
        components={{
          ...defaultComponents,
          HistoryControls: ({ undoButton, redoButton }) => (
            <div data-test="CustomHistoryControls">
              {redoButton}
              {undoButton}
            </div>
          ),
        }}
        onChange={onChange}
      />
    );

    expect(queryByDataTest(container, 'CustomHistoryControls')).not.toBeNull();

    fireEvent.click(getByDataTest(container, 'AddRootRule'));
    fireEvent.click(getByDataTest(container, 'Undo'));

    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ type: 'GROUP' }),
    ]);
  });

  it('Undoes and redoes root-level edits when history is enabled', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        singleRootGroup={false}
        history
        onChange={onChange}
      />
    );

    fireEvent.click(getByDataTest(container, 'Undo'));

    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(getByDataTest(container, 'AddRootRule'));

    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ type: 'GROUP' }),
      expect.objectContaining({ field: '' }),
    ]);

    fireEvent.click(getByDataTest(container, 'Undo'));

    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ type: 'GROUP' }),
    ]);

    fireEvent.click(getByDataTest(container, 'Redo'));

    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ type: 'GROUP' }),
      expect.objectContaining({ field: '' }),
    ]);
  });

  it('Clears redo history after a new edit', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        singleRootGroup={false}
        history
        onChange={jest.fn()}
      />
    );

    fireEvent.click(getByDataTest(container, 'AddRootRule'));
    fireEvent.click(getByDataTest(container, 'Undo'));

    expect(getByDataTest(container, 'Redo')).not.toBeDisabled();

    fireEvent.click(getByDataTest(container, 'AddRootGroup'));

    expect(getByDataTest(container, 'Redo')).toBeDisabled();
  });

  it('Undoes and redoes rule value edits when history is enabled', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        history
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' }],
          },
        ]}
        onChange={onChange}
      />
    );

    fireEvent.change(
      container.querySelector('input[type="text"]') as HTMLInputElement,
      {
        target: { value: 'beta' },
      }
    );

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' }],
      },
    ]);

    fireEvent.click(getByDataTest(container, 'Undo'));

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' }],
      },
    ]);

    fireEvent.click(getByDataTest(container, 'Redo'));

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' }],
      },
    ]);
  });

  it('Undoes deletes when history is enabled', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        history
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
              { field: 'MOCK_NUMBER', value: 5, operator: 'NOT_EQUAL' },
            ],
          },
        ]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'MOCK_NUMBER', value: 5, operator: 'NOT_EQUAL' }],
      },
    ]);

    fireEvent.click(getByDataTest(container, 'Undo'));

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_NUMBER', value: 5, operator: 'NOT_EQUAL' },
        ],
      },
    ]);
  });

  it('Emits history state through onStateChange', async () => {
    const onStateChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        singleRootGroup={false}
        history
        onStateChange={onStateChange}
        onChange={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(onStateChange).toHaveBeenCalled();
    });

    expect(
      onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0]
    ).toMatchObject({
      canUndo: false,
      canRedo: false,
    });

    fireEvent.click(getByDataTest(container, 'AddRootRule'));

    await waitFor(() => {
      expect(
        onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0]
      ).toMatchObject({
        canUndo: true,
        canRedo: false,
      });
    });

    fireEvent.click(getByDataTest(container, 'Undo'));

    await waitFor(() => {
      expect(
        onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0]
      ).toMatchObject({
        canUndo: false,
        canRedo: true,
      });
    });
  });

  it('Clones a rule directly below the original rule', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        cloneable
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
              { field: 'MOCK_NUMBER', value: 5, operator: 'NOT_EQUAL' },
            ],
          },
        ]}
        onChange={onChange}
      />
    );

    fireEvent.click(getAllByDataTest(container, 'CloneButton[rule]')[0]);

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            field: 'MOCK_FIELD',
            value: 'alpha',
            operator: 'EQUAL',
          },
          {
            field: 'MOCK_FIELD',
            value: 'alpha',
            operator: 'EQUAL',
          },
          {
            field: 'MOCK_NUMBER',
            value: 5,
            operator: 'NOT_EQUAL',
          },
        ],
      },
    ]);
  });

  it('Clones a group subtree directly below the original group', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        cloneable
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                type: 'GROUP',
                value: 'OR',
                isNegated: true,
                children: [
                  {
                    field: 'MOCK_FIELD',
                    value: 'nested',
                    operator: 'EQUAL',
                  },
                ],
              },
              {
                field: 'MOCK_NUMBER',
                value: 9,
                operator: 'NOT_EQUAL',
              },
            ],
          },
        ]}
        onChange={onChange}
      />
    );

    const cloneButtons = getAllByDataTest(container, 'CloneButton[group]');
    fireEvent.click(cloneButtons[cloneButtons.length - 1]);

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: true,
            children: [
              {
                field: 'MOCK_FIELD',
                value: 'nested',
                operator: 'EQUAL',
              },
            ],
          },
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: true,
            children: [
              {
                field: 'MOCK_FIELD',
                value: 'nested',
                operator: 'EQUAL',
              },
            ],
          },
          {
            field: 'MOCK_NUMBER',
            value: 9,
            operator: 'NOT_EQUAL',
          },
        ],
      },
    ]);
  });

  it('Does not render a clone control for the single root group', () => {
    const { container } = render(
      <Builder
        fields={fields}
        cloneable
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [],
          },
        ]}
        onChange={jest.fn()}
      />
    );

    expect(getAllByDataTest(container, 'CloneButton[group]')).toHaveLength(0);
  });

  it('Adds a group at the root level', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        singleRootGroup={false}
        onChange={onChange}
      />
    );

    fireEvent.click(getByDataTest(container, 'AddRootGroup'));

    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ type: 'GROUP' }),
      expect.objectContaining({ type: 'GROUP' }),
    ]);
  });

  it('Adds a rule at the root level', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        singleRootGroup={false}
        onChange={onChange}
      />
    );

    fireEvent.click(getByDataTest(container, 'AddRootRule'));

    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ type: 'GROUP' }),
      expect.objectContaining({ field: '' }),
    ]);
  });

  it('Allows deleting a group at the root level', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [],
          },
        ]}
        singleRootGroup={false}
        onChange={onChange}
      />
    );

    fireEvent.click(getByDataTest(container, 'Remove'));

    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(queryByDataTest(container, 'Remove')).toBeNull();
    expect(queryByDataTest(container, 'AddRootGroup')).not.toBeNull();
  });

  it('Omits modifiers from groups when groupTypes is without-modifiers', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        groupTypes="without-modifiers"
        singleRootGroup={false}
        onChange={onChange}
      />
    );

    fireEvent.click(getByDataTest(container, 'AddRootGroup'));

    const emittedData = onChange.mock.calls[onChange.mock.calls.length - 1][0];

    expect(emittedData).toHaveLength(2);
    expect(emittedData[0]).toMatchObject({
      type: 'GROUP',
      children: [],
    });
    expect(emittedData[1]).toMatchObject({
      type: 'GROUP',
      children: [],
    });
    expect('value' in emittedData[0]).toEqual(false);
    expect('isNegated' in emittedData[0]).toEqual(false);
    expect('value' in emittedData[1]).toEqual(false);
    expect('isNegated' in emittedData[1]).toEqual(false);
  });

  it('Renders a group-type popover when groupTypes is both', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        groupTypes="both"
        singleRootGroup={false}
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'AddRootGroup')).not.toBeNull();
    expect(queryByDataTest(container, 'AddRootGroupWithModifiers')).toBeNull();
    expect(queryByDataTest(container, 'AddRootGroupWithoutModifiers')).toBeNull();

    fireEvent.click(getByDataTest(container, 'AddRootGroup'));

    expect(
      screen.getByRole('button', { name: 'With Modifiers' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Without Modifiers' })
    ).toBeInTheDocument();
  });

  it('Does not render modifier controls for modifierless groups', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            children: [{ field: 'MOCK_FIELD', value: '', operator: 'EQUAL' }],
          },
        ]}
        groupTypes="without-modifiers"
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'Option[not]')).toBeNull();
    expect(queryByDataTest(container, 'Option[and]')).toBeNull();
    expect(queryByDataTest(container, 'Option[or]')).toBeNull();
  });

  it('Locks the builder to a single undeletable root group', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[{ field: 'MOCK_FIELD', value: '', operator: 'EQUAL' }]}
        singleRootGroup
        draggable
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'AddRootRule')).toBeNull();
    expect(queryByDataTest(container, 'AddRootGroup')).toBeNull();
    expect(getAllByDataTest(container, 'IteratorRule')).toHaveLength(1);
    expect(
      screen.getAllByRole('button', { name: 'Delete' })
    ).toHaveLength(1);
    expect(getAllByDataTest(container, 'DragHandle')).toHaveLength(1);
  });

  it('Emits numeric values for number fields', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'MOCK_NUMBER', value: 0, operator: 'EQUAL' }],
          },
        ]}
        onChange={onChange}
      />
    );

    fireEvent.change(
      container.querySelector('input[type="number"]') as HTMLInputElement,
      {
        target: { value: '42.5' },
      }
    );

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'MOCK_NUMBER', value: 42.5, operator: 'EQUAL' }],
      },
    ]);
  });

  it('Emits validation state and renders validation issues when enabled', async () => {
    const onStateChange = jest.fn();
    render(
      <Builder
        fields={[
          {
            field: 'REQUIRED_TEXT',
            label: 'Required Text',
            type: 'TEXT',
            operators: ['EQUAL'],
            validation: {
              required: true,
            },
          },
        ]}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'REQUIRED_TEXT', value: '', operator: 'EQUAL' }],
          },
        ]}
        showValidation
        onStateChange={onStateChange}
      />
    );

    await waitFor(() => {
      expect(onStateChange).toHaveBeenCalled();
    });

    expect(
      onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0]
    ).toMatchObject({
      isValid: false,
      validation: {
        isValid: false,
      },
    });
    expect(screen.getByText('This value is required')).toBeInTheDocument();
  });

  it('Does not render field validation errors for placeholder rules without a selected field', async () => {
    render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: '' }],
          },
        ]}
        showValidation
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Field "" is not defined')).not.toBeInTheDocument();
    });
  });

  it('Does not render field validation errors for placeholder rules with missing field values', async () => {
    render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{} as never],
          },
        ]}
        showValidation
      />
    );

    await waitFor(() => {
      expect(screen.queryByText(/is not defined/)).not.toBeInTheDocument();
    });
  });

  it('Disables editing and dragging for locally read-only rules', () => {
    const { container } = render(
      <Builder
        fields={fields}
        draggable
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                field: 'MOCK_FIELD',
                value: '',
                operator: 'EQUAL',
                readOnly: true,
              },
            ],
          },
        ]}
      />
    );

    const rule = getByDataTest(container, 'IteratorRule');

    expect(
      rule.querySelector('[data-test="DragHandle"]')
    ).toBeNull();
    expect(
      screen.queryByRole('button', { name: 'Delete' })
    ).not.toBeInTheDocument();
  });

  it('Allows locking and unlocking rules through the GUI when lockable is enabled', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        lockable
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                field: 'MOCK_FIELD',
                value: '',
                operator: 'EQUAL',
              },
            ],
          },
        ]}
        onChange={onChange}
      />
    );

    fireEvent.click(getAllByDataTest(container, 'LockToggle[rule]')[0]);

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            field: 'MOCK_FIELD',
            value: '',
            operator: 'EQUAL',
            readOnly: true,
          },
        ],
      },
    ]);

    fireEvent.click(getAllByDataTest(container, 'LockToggle[rule]')[0]);

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            field: 'MOCK_FIELD',
            value: '',
            operator: 'EQUAL',
          },
        ],
      },
    ]);
  });

  it('Locks group controls without inheriting read-only to descendants by default', () => {
    const { container } = render(
      <Builder
        fields={fields}
        draggable
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                type: 'GROUP',
                value: 'AND',
                isNegated: false,
                readOnly: true,
                children: [
                  {
                    field: 'MOCK_FIELD',
                    value: '',
                    operator: 'EQUAL',
                  },
                ],
              },
            ],
          },
        ]}
      />
    );

    expect(getAllByDataTest(container, 'AddRule')).toHaveLength(1);
    expect(
      screen.getAllByRole('button', { name: 'Delete' })
    ).toHaveLength(1);
    expect(getAllByDataTest(container, 'DragHandle')).toHaveLength(1);
  });

  it('Inherits read-only state to descendants when configured on a group', () => {
    const { container } = render(
      <Builder
        fields={fields}
        draggable
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                type: 'GROUP',
                value: 'AND',
                isNegated: false,
                readOnly: {
                  enabled: true,
                  inheritToChildren: true,
                },
                children: [
                  {
                    field: 'MOCK_FIELD',
                    value: '',
                    operator: 'EQUAL',
                  },
                ],
              },
            ],
          },
        ]}
      />
    );

    expect(
      screen.queryByRole('button', { name: 'Delete' })
    ).not.toBeInTheDocument();
    expect(getAllByDataTest(container, 'DragHandle')).toHaveLength(0);
  });

  it('Cycles group lock state through self, inherited, and unlocked states', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        lockable
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                type: 'GROUP',
                value: 'AND',
                isNegated: false,
                children: [],
              },
            ],
          },
        ]}
        onChange={onChange}
      />
    );

    const getLastGroupToggle = () => {
      const toggles = getAllByDataTest(container, 'LockToggle[group]');
      return toggles[toggles.length - 1];
    };

    fireEvent.click(getLastGroupToggle());

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            readOnly: true,
            children: [],
          },
        ],
      },
    ]);

    fireEvent.click(getLastGroupToggle());

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            readOnly: {
              enabled: true,
              inheritToChildren: true,
            },
            children: [],
          },
        ],
      },
    ]);

    fireEvent.click(getLastGroupToggle());

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [],
          },
        ],
      },
    ]);
  });

  it('Disables descendant lock toggles when read-only is inherited from a parent group', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        lockable
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            readOnly: {
              enabled: true,
              inheritToChildren: true,
            },
            children: [
              {
                field: 'MOCK_FIELD',
                value: '',
                operator: 'EQUAL',
              },
            ],
          },
        ]}
        onChange={onChange}
      />
    );

    fireEvent.click(getAllByDataTest(container, 'LockToggle[rule]')[0]);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('Uses a custom LockToggle component when provided', () => {
    const { container } = render(
      <Builder
        fields={fields}
        lockable
        components={{
          ...defaultComponents,
          LockToggle: ({ state, nodeType, onChange, disabled }) => (
            <button
              type="button"
              data-test={`CustomLockToggle[${nodeType}]`}
              disabled={disabled}
              onClick={() => onChange?.(state === 'unlocked' ? 'self' : 'unlocked')}
            >
              custom
            </button>
          ),
        }}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                field: 'MOCK_FIELD',
                value: '',
                operator: 'EQUAL',
              },
            ],
          },
        ]}
      />
    );

    expect(getAllByDataTest(container, 'CustomLockToggle[group]')).toHaveLength(1);
    expect(getAllByDataTest(container, 'CustomLockToggle[rule]')).toHaveLength(1);
  });

  it('Keeps the boundary drop zone before a locked sibling group', () => {
    const { container } = render(
      <Builder
        fields={fields}
        draggable
        components={{
          ...defaultComponents,
          DropZone: ({ index, parentId }) => (
            <div
              data-test="DropZone"
              data-index={index}
              data-parent-id={parentId || 'root'}
            />
          ),
        }}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                type: 'GROUP',
                value: 'AND',
                isNegated: false,
                children: [],
              },
              {
                type: 'GROUP',
                value: 'AND',
                isNegated: false,
                readOnly: true,
                children: [],
              },
            ],
          },
        ]}
      />
    );

    expect(
      getAllByDataTest(container, 'DropZone').filter(
        (node) => node.getAttribute('data-index') === '1'
      )
    ).toHaveLength(1);
  });
});

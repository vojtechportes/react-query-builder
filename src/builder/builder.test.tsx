import React from 'react';
import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  Builder,
  BuilderRef,
  defaultComponents,
  IBuilderFieldProps,
  IBuilderProps,
  IBuilderRef,
  useBuilderRef,
} from './index';
import { DenormalizedQuery, INormalizedRuleNode } from '../utils/query-tree';

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

const listFields: IBuilderFieldProps[] = [
  {
    field: 'STATUS',
    label: 'Status',
    type: 'LIST',
    value: [
      { value: 'OPEN', label: 'Open' },
      { value: 'CLOSED', label: 'Closed' },
    ],
    operators: ['IN', 'NOT_IN', 'EQUAL'],
  },
];

const dependentListFields: IBuilderFieldProps[] = [
  {
    field: 'COUNTRY',
    label: 'Country',
    type: 'LIST',
    value: [
      { value: 'CZ', label: 'Czech Republic' },
      { value: 'SK', label: 'Slovakia' },
    ],
    operators: ['EQUAL'],
  },
  {
    field: 'CITY',
    label: 'City',
    type: 'LIST',
    value: [],
    operators: ['EQUAL'],
  },
];

const numericListFields: IBuilderFieldProps[] = [
  {
    field: 'PRIORITY',
    label: 'Priority',
    type: 'LIST',
    value: [
      { value: 1, label: 'Low' },
      { value: 2, label: 'Medium' },
      { value: 3, label: 'High' },
    ],
    operators: ['EQUAL'],
  },
];

const numericMultiListFields: IBuilderFieldProps[] = [
  {
    field: 'SCORES',
    label: 'Scores',
    type: 'MULTI_LIST',
    value: [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
      { value: 3, label: 'Three' },
    ],
    operators: ['ALL_IN'],
  },
];

const stringMultiListFields: IBuilderFieldProps[] = [
  {
    field: 'SEGMENTS',
    label: 'Segments',
    type: 'MULTI_LIST',
    value: [
      { value: 'A', label: 'Segment A' },
      { value: 'B', label: 'Segment B' },
      { value: 'C', label: 'Segment C' },
      { value: 'D', label: 'Segment D' },
    ],
    operators: ['ALL_IN'],
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

const CustomTextModeEditor = ({
  value,
  errorMessage,
  protectedRanges = [],
  onChange,
}: {
  value: string;
  errorMessage: string | null;
  protectedRanges?: Array<{ start: number; end: number }>;
  onChange: (value: string) => void;
}) => (
  <div data-test="CustomTextModeEditor">
    <textarea
      data-test="CustomTextModeEditorInput"
      value={value}
      onChange={event => onChange(event.target.value)}
    />
    <div data-test="CustomTextModeEditorProtectedRangeCount">
      {protectedRanges.length}
    </div>
    {errorMessage ? <div data-test="CustomTextModeEditorError">{errorMessage}</div> : null}
  </div>
);

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

  it('Switches the builder into SQL text mode', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' }],
          },
        ]}
        textMode
        onChange={jest.fn()}
      />
    );

    fireEvent.click(getByDataTest(container, 'TextModeToggle'));

    expect(
      (getByDataTest(container, 'TextModeEditor') as HTMLTextAreaElement).value
    ).toContain("MOCK_FIELD = 'alpha'");

    fireEvent.click(getByDataTest(container, 'TextModeToggle'));

    expect(getAllByDataTest(container, 'IteratorRule')).toHaveLength(1);
  });

  it('Does not crash when switching to text mode with an IN operator from the builder', () => {
    const listField: IBuilderFieldProps = {
      field: 'STATUS',
      label: 'Status',
      type: 'LIST',
      value: [
        { value: 'OPEN', label: 'Open' },
        { value: 'CLOSED', label: 'Closed' },
      ],
      operators: ['IN', 'NOT_IN', 'EQUAL'],
    };
    const { container } = render(
      <Builder
        fields={[listField]}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'STATUS', value: 'OPEN', operator: 'IN' }],
          },
        ]}
        textMode
        onChange={jest.fn()}
      />
    );

    fireEvent.click(getByDataTest(container, 'TextModeToggle'));

    expect(
      (getByDataTest(container, 'TextModeEditor') as HTMLTextAreaElement).value
    ).toContain("STATUS IN ('OPEN')");
  });

  it('Does not crash when adding a placeholder rule while text mode is enabled', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' }],
          },
        ]}
        textMode
        onChange={onChange}
      />
    );

    fireEvent.click(getByDataTest(container, 'AddRule'));

    expect(onChange).toHaveBeenCalled();
    expect(queryByDataTest(container, 'TextModeToggle')).not.toBeNull();
  });

  it('Preserves a nested single-rule group when round-tripping through text mode', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              { field: 'MOCK_NUMBER', value: 1, operator: 'EQUAL' },
              {
                type: 'GROUP',
                value: 'AND',
                isNegated: false,
                children: [{ field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' }],
              },
            ],
          },
        ]}
        textMode
        onChange={onChange}
      />
    );

    fireEvent.click(getByDataTest(container, 'TextModeToggle'));
    fireEvent.change(getByDataTest(container, 'TextModeEditor'), {
      target: { value: "(MOCK_NUMBER = 1 AND (MOCK_FIELD = 'beta'))" },
    });
    fireEvent.click(getByDataTest(container, 'TextModeToggle'));

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'MOCK_NUMBER', value: 1, operator: 'EQUAL' },
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' }],
          },
        ],
      },
    ]);
  });

  it('Does not enable text mode when singleRootGroup is false', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        singleRootGroup={false}
        textMode
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'TextModeToggle')).toBeNull();
    expect(queryByDataTest(container, 'TextModeEditor')).toBeNull();
  });

  it('Ignores defaultMode when text mode is not enabled', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' }],
          },
        ]}
        defaultMode="text"
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'TextModeEditor')).toBeNull();
    expect(getAllByDataTest(container, 'IteratorRule')).toHaveLength(1);
  });

  it('Blocks the basic text editor when the query contains locked nodes', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL', readOnly: true },
            ],
          },
        ]}
        textMode
        onChange={jest.fn()}
      />
    );

    expect(getByDataTest(container, 'TextModeToggle')).toBeDisabled();
    expect(queryByDataTest(container, 'TextModeEditor')).toBeNull();
    expect(getByDataTest(container, 'TextModeBlockedAlert').textContent).toContain(
      'not supported in the text editor'
    );
  });

  it('Allows a custom TextModeEditor when the query contains locked nodes', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL', readOnly: true },
              { field: 'MOCK_NUMBER', value: 2, operator: 'EQUAL' },
            ],
          },
        ]}
        textMode
        defaultMode="text"
        components={{
          ...defaultComponents,
          TextModeEditor: CustomTextModeEditor,
        }}
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'TextModeBlockedAlert')).toBeNull();
    expect(queryByDataTest(container, 'CustomTextModeEditor')).not.toBeNull();
    expect(
      Number(getByDataTest(container, 'CustomTextModeEditorProtectedRangeCount').textContent)
    ).toBeGreaterThan(0);
  });

  it('Protects the full text editor range when the Builder is read-only', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
              { field: 'MOCK_NUMBER', value: 2, operator: 'EQUAL' },
            ],
          },
        ]}
        textMode
        defaultMode="text"
        readOnly
        components={{
          ...defaultComponents,
          TextModeEditor: CustomTextModeEditor,
        }}
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'CustomTextModeEditor')).not.toBeNull();
    expect(getByDataTest(container, 'CustomTextModeEditorInput')).toHaveValue(
      "(MOCK_FIELD = 'alpha' AND MOCK_NUMBER = 2)"
    );
    expect(getByDataTest(container, 'CustomTextModeEditorProtectedRangeCount')).toHaveTextContent(
      '1'
    );
  });

  it('Preserves locked rules after valid text edits in a custom TextModeEditor', async () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL', readOnly: true },
              { field: 'MOCK_NUMBER', value: 2, operator: 'EQUAL' },
            ],
          },
        ]}
        textMode
        defaultMode="text"
        components={{
          ...defaultComponents,
          TextModeEditor: CustomTextModeEditor,
        }}
        onChange={onChange}
      />
    );

    fireEvent.change(getByDataTest(container, 'CustomTextModeEditorInput'), {
      target: { value: "(MOCK_FIELD = 'alpha' AND MOCK_NUMBER = 3)" },
    });

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [
            { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL', readOnly: true },
            { field: 'MOCK_NUMBER', value: 3, operator: 'EQUAL' },
          ],
        },
      ])
    );
  });

  it('Preserves self-locked groups after valid child edits in a custom TextModeEditor', async () => {
    const onChange = jest.fn();
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
                type: 'GROUP',
                value: 'AND',
                isNegated: false,
                readOnly: true,
                children: [{ field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' }],
              },
              { field: 'MOCK_NUMBER', value: 2, operator: 'EQUAL' },
            ],
          },
        ]}
        textMode
        defaultMode="text"
        components={{
          ...defaultComponents,
          TextModeEditor: CustomTextModeEditor,
        }}
        onChange={onChange}
      />
    );

    fireEvent.change(getByDataTest(container, 'CustomTextModeEditorInput'), {
      target: { value: "((MOCK_FIELD = 'beta') AND MOCK_NUMBER = 2)" },
    });

    await waitFor(() =>
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
              children: [{ field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' }],
            },
            { field: 'MOCK_NUMBER', value: 2, operator: 'EQUAL' },
          ],
        },
      ])
    );
  });

  it('Preserves inherited locked groups after valid edits outside the locked SQL fragment', async () => {
    const onChange = jest.fn();
    const inheritedLockFields: IBuilderFieldProps[] = [
      {
        field: 'COUNTRY',
        label: 'Country',
        type: 'TEXT',
        operators: ['EQUAL'],
      },
      {
        field: 'SEGMENTS',
        label: 'Segments',
        type: 'MULTI_LIST',
        operators: ['ALL_IN', 'IN'],
        value: [
          { value: 'B2B', label: 'B2B' },
          { value: 'Priority', label: 'Priority' },
        ],
      },
    ];
    const { container } = render(
      <Builder
        fields={inheritedLockFields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              { field: 'COUNTRY', value: 'CZ', operator: 'EQUAL' },
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
                    field: 'SEGMENTS',
                    value: ['B2B', 'Priority'],
                    operator: 'ALL_IN',
                  },
                ],
              },
            ],
          },
        ]}
        textMode
        defaultMode="text"
        components={{
          ...defaultComponents,
          TextModeEditor: CustomTextModeEditor,
        }}
        onChange={onChange}
      />
    );

    fireEvent.change(getByDataTest(container, 'CustomTextModeEditorInput'), {
      target: { value: "(COUNTRY = 'SK' AND (SEGMENTS IN ('B2B', 'Priority')))" },
    });

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [
            { field: 'COUNTRY', value: 'SK', operator: 'EQUAL' },
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
                  field: 'SEGMENTS',
                  value: ['B2B', 'Priority'],
                  operator: 'IN',
                },
              ],
            },
          ],
        },
      ])
    );
  });

  it('Normalizes existing modifierless groups to AND when text mode is enabled', () => {
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
                type: 'GROUP',
                children: [
                  { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
                  { field: 'MOCK_NUMBER', value: 2, operator: 'EQUAL' },
                ],
              },
            ],
          },
        ]}
        textMode
        groupTypes="both"
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'AddGroupWithoutModifiers')).toBeNull();

    fireEvent.click(getByDataTest(container, 'TextModeToggle'));

    expect(
      (getByDataTest(container, 'TextModeEditor') as HTMLTextAreaElement).value
    ).toContain("(MOCK_FIELD = 'alpha' AND MOCK_NUMBER = 2)");
  });

  it('Keeps invalid SQL text local and shows a syntax error', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        textMode
        defaultMode="text"
        onChange={onChange}
      />
    );

    fireEvent.change(getByDataTest(container, 'TextModeEditor'), {
      target: { value: "MOCK_FIELD IN ('alpha' 'beta')" },
    });

    expect(queryByDataTest(container, 'TextModeError')).not.toBeNull();
    expect(queryByDataTest(container, 'TextModeDiagnostic[0]')).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Rejects read-only negation changes in text mode and keeps the edited text visible', () => {
    const onChange = jest.fn();
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
                type: 'GROUP',
                value: 'AND',
                isNegated: true,
                readOnly: {
                  enabled: true,
                  targets: ['negation'],
                },
                children: [
                  { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
                ],
              },
            ],
          },
        ]}
        textMode
        defaultMode="text"
        components={{
          ...defaultComponents,
          TextModeEditor: CustomTextModeEditor,
        }}
        onChange={onChange}
      />
    );

    fireEvent.change(getByDataTest(container, 'CustomTextModeEditorInput'), {
      target: { value: "((MOCK_FIELD = 'alpha'))" },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(
      getByDataTest(container, 'CustomTextModeEditorInput')
    ).toHaveValue("((MOCK_FIELD = 'alpha'))");
    expect(
      getByDataTest(container, 'CustomTextModeEditorError').textContent
    ).toContain('Negation is read-only');
  });

  it('Preserves protected ranges after editing an unlocked value in text mode', async () => {
    const onChange = jest.fn();
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
                field: 'MOCK_FIELD',
                value: 'alpha',
                operator: 'EQUAL',
                readOnly: {
                  enabled: true,
                  targets: ['field', 'operator'],
                },
              },
            ],
          },
        ]}
        textMode
        defaultMode="text"
        components={{
          ...defaultComponents,
          TextModeEditor: CustomTextModeEditor,
        }}
        onChange={onChange}
      />
    );

    const initialProtectedRangeCount = getByDataTest(
      container,
      'CustomTextModeEditorProtectedRangeCount'
    ).textContent;

    expect(initialProtectedRangeCount).not.toBeNull();

    fireEvent.change(getByDataTest(container, 'CustomTextModeEditorInput'), {
      target: { value: "(MOCK_FIELD = 'beta')" },
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
      expect(
        getByDataTest(container, 'CustomTextModeEditorProtectedRangeCount')
      ).toHaveTextContent(initialProtectedRangeCount as string);
    });
  });

  it('keeps targeted read-only rules attached to the original nested group after editing another group in text mode', () => {
    const onChange = jest.fn();
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
                type: 'GROUP',
                value: 'OR',
                isNegated: false,
                children: [
                  {
                    field: 'MOCK_FIELD',
                    value: 'alpha',
                    operator: 'EQUAL',
                    readOnly: {
                      enabled: true,
                      targets: ['field', 'operator'],
                    },
                  },
                  {
                    field: 'MOCK_NUMBER',
                    value: 5,
                    operator: 'NOT_EQUAL',
                  },
                ],
              },
              {
                type: 'GROUP',
                value: 'AND',
                isNegated: false,
                children: [
                  {
                    field: 'MOCK_FIELD',
                    value: 'beta',
                    operator: 'EQUAL',
                  },
                  {
                    field: 'MOCK_NUMBER',
                    value: 8,
                    operator: 'NOT_EQUAL',
                  },
                ],
              },
            ],
          },
        ]}
        textMode
        defaultMode="text"
        components={{
          ...defaultComponents,
          TextModeEditor: CustomTextModeEditor,
        }}
        onChange={onChange}
      />
    );

    fireEvent.change(getByDataTest(container, 'CustomTextModeEditorInput'), {
      target: {
        value:
          "((MOCK_FIELD = 'alpha' OR MOCK_NUMBER != 5) AND (MOCK_FIELD = 'beta' AND MOCK_NUMBER != 9))",
      },
    });

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: false,
            children: [
              {
                field: 'MOCK_FIELD',
                value: 'alpha',
                operator: 'EQUAL',
                readOnly: {
                  enabled: true,
                  targets: ['field', 'operator'],
                },
              },
              {
                field: 'MOCK_NUMBER',
                value: 5,
                operator: 'NOT_EQUAL',
              },
            ],
          },
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                field: 'MOCK_FIELD',
                value: 'beta',
                operator: 'EQUAL',
              },
              {
                field: 'MOCK_NUMBER',
                value: 9,
                operator: 'NOT_EQUAL',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('rejects deleting a group that contains a read-only descendant in text mode', () => {
    const onChange = jest.fn();
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
                type: 'GROUP',
                value: 'OR',
                isNegated: false,
                children: [
                  {
                    field: 'MOCK_FIELD',
                    value: 'alpha',
                    operator: 'EQUAL',
                    readOnly: {
                      enabled: true,
                      targets: ['field', 'operator'],
                    },
                  },
                  {
                    field: 'MOCK_NUMBER',
                    value: 5,
                    operator: 'NOT_EQUAL',
                  },
                ],
              },
              {
                field: 'MOCK_NUMBER',
                value: 8,
                operator: 'NOT_EQUAL',
              },
            ],
          },
        ]}
        textMode
        defaultMode="text"
        components={{
          ...defaultComponents,
          TextModeEditor: CustomTextModeEditor,
        }}
        onChange={onChange}
      />
    );

    const previousTextValue = (
      getByDataTest(container, 'CustomTextModeEditorInput') as HTMLTextAreaElement
    ).value;

    fireEvent.change(getByDataTest(container, 'CustomTextModeEditorInput'), {
      target: { value: '(MOCK_NUMBER != 8)' },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(getByDataTest(container, 'CustomTextModeEditorInput')).toHaveValue(
      previousTextValue
    );
    expect(getByDataTest(container, 'CustomTextModeEditorError')).toHaveTextContent(
      'One or more read-only clauses cannot be changed or removed in text mode.'
    );
  });

  it('allows deleting a group with a read-only descendant in text mode when readOnlyProtectsDelete is false', async () => {
    const onChange = jest.fn();
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
                type: 'GROUP',
                value: 'OR',
                isNegated: false,
                children: [
                  {
                    field: 'MOCK_FIELD',
                    value: 'alpha',
                    operator: 'EQUAL',
                    readOnly: {
                      enabled: true,
                      targets: ['field', 'operator'],
                    },
                  },
                  {
                    field: 'MOCK_NUMBER',
                    value: 5,
                    operator: 'NOT_EQUAL',
                  },
                ],
              },
              {
                field: 'MOCK_NUMBER',
                value: 8,
                operator: 'NOT_EQUAL',
              },
            ],
          },
        ]}
        textMode
        defaultMode="text"
        readOnlyProtectsDelete={false}
        components={{
          ...defaultComponents,
          TextModeEditor: CustomTextModeEditor,
        }}
        onChange={onChange}
      />
    );

    fireEvent.change(getByDataTest(container, 'CustomTextModeEditorInput'), {
      target: { value: '(MOCK_NUMBER != 8)' },
    });

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [
            {
              field: 'MOCK_NUMBER',
              value: 8,
              operator: 'NOT_EQUAL',
            },
          ],
        },
      ])
    );

    expect(queryByDataTest(container, 'CustomTextModeEditorError')).toBeNull();
  });

  it('Reports a missing quote near the broken string boundary instead of a later token', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        textMode
        defaultMode="text"
        onChange={jest.fn()}
      />
    );

    fireEvent.change(getByDataTest(container, 'TextModeEditor'), {
      target: {
        value:
          "(MOCK_FIELD = 'CZ AND MOCK_NUMBER = 4 AND MOCK_FIELD LIKE '%beta%')",
      },
    });

    expect(getByDataTest(container, 'TextModeError').textContent).toContain(
      'missing quote'
    );
  });

  it('Shows a missing-token marker for a closing parenthesis at end of input', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        textMode
        defaultMode="text"
        onChange={jest.fn()}
      />
    );

    fireEvent.change(getByDataTest(container, 'TextModeEditor'), {
      target: { value: "(MOCK_FIELD = 'alpha'" },
    });

    expect(getByDataTest(container, 'TextModeError').textContent).toContain(
      'Missing closing parenthesis'
    );
    expect(
      queryByDataTest(container, 'TextModeDiagnosticMarker[0]')
    ).not.toBeNull();
  });

  it('Uses localized SQL parser messages in text mode diagnostics', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        textMode
        defaultMode="text"
        strings={{
          textMode: {
            syntaxError: 'Chyba syntaxe',
            sql: {
              missingClosingParenthesis: 'Chybi uzaviraci zavorka.',
            },
          },
        }}
        onChange={jest.fn()}
      />
    );

    fireEvent.change(getByDataTest(container, 'TextModeEditor'), {
      target: { value: "(MOCK_FIELD = 'alpha'" },
    });

    expect(getByDataTest(container, 'TextModeError').textContent).toContain(
      'Chyba syntaxe: Chybi uzaviraci zavorka.'
    );
  });

  it('Parses valid SQL text back into builder data', async () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        textMode
        defaultMode="text"
        onChange={onChange}
      />
    );

    fireEvent.change(getByDataTest(container, 'TextModeEditor'), {
      target: { value: "MOCK_FIELD = 'beta' AND MOCK_NUMBER = 4" },
    });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({
        type: 'GROUP',
        children: [
          expect.objectContaining({
            field: 'MOCK_FIELD',
            operator: 'EQUAL',
            value: 'beta',
          }),
          expect.objectContaining({
            field: 'MOCK_NUMBER',
            operator: 'EQUAL',
            value: 4,
          }),
        ],
      }),
    ]);
  });

  it('Renders SQL syntax highlighting in text mode', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        textMode
        defaultMode="text"
        onChange={jest.fn()}
      />
    );

    fireEvent.change(getByDataTest(container, 'TextModeEditor'), {
      target: { value: "MOCK_FIELD = 'beta' AND MOCK_NUMBER = 4" },
    });

    expect(getByDataTest(container, 'TextModeSyntaxLayer').innerHTML).toContain(
      'token '
    );
  });

  it('Tracks valid SQL text edits in history so they can be undone', async () => {
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
        textMode
        defaultMode="text"
        onChange={onChange}
      />
    );

    fireEvent.change(getByDataTest(container, 'TextModeEditor'), {
      target: { value: "MOCK_FIELD = 'beta'" },
    });

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [{ field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' }],
        },
      ])
    );

    fireEvent.click(getByDataTest(container, 'Undo'));

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [{ field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' }],
        },
      ])
    );
  });

  it('Uses a custom TextModeInput component when provided', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        textMode
        defaultMode="text"
        components={{
          ...defaultComponents,
          TextModeInput: ({
            value,
            onChange,
            className,
            inputClassName,
            inputDataTest,
          }) => (
            <div className={className} data-test="CustomTextModeInput">
              <textarea
                value={value}
                onChange={event => onChange(event.target.value)}
                className={inputClassName}
                data-test={inputDataTest}
              />
            </div>
          ),
        }}
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'CustomTextModeInput')).not.toBeNull();
    expect(queryByDataTest(container, 'TextModeEditor')).not.toBeNull();
  });

  it('Uses a custom TextModeEditor component when provided', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        textMode
        defaultMode="text"
        components={{
          ...defaultComponents,
          TextModeEditor: ({ value, errorMessage, onChange }) => (
            <div data-test="CustomTextModeEditor">
              <textarea
                data-test="CustomTextModeEditorInput"
                value={value}
                onChange={event => onChange(event.target.value)}
              />
              {errorMessage ? <div data-test="CustomTextModeEditorError">{errorMessage}</div> : null}
            </div>
          ),
        }}
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'CustomTextModeEditor')).not.toBeNull();
    expect(queryByDataTest(container, 'TextModeEditor')).toBeNull();
  });

  it('Keeps SQL text local when the field does not exist', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        textMode
        defaultMode="text"
        onChange={onChange}
      />
    );

    fireEvent.change(getByDataTest(container, 'TextModeEditor'), {
      target: { value: "UNKNOWN_FIELD = 'beta'" },
    });

    expect(queryByDataTest(container, 'TextModeError')).not.toBeNull();
    expect(queryByDataTest(container, 'TextModeDiagnostic[0]')).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Keeps SQL text local when the operator is not supported for the field', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[]}
        textMode
        defaultMode="text"
        onChange={onChange}
      />
    );

    fireEvent.change(getByDataTest(container, 'TextModeEditor'), {
      target: { value: "MOCK_FIELD LIKE 'beta'" },
    });

    expect(queryByDataTest(container, 'TextModeError')).not.toBeNull();
    expect(queryByDataTest(container, 'TextModeDiagnostic[0]')).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Keeps SQL text local when list values are outside the allowed options', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={listFields}
        data={[]}
        textMode
        defaultMode="text"
        onChange={onChange}
      />
    );

    fireEvent.change(getByDataTest(container, 'TextModeEditor'), {
      target: { value: "STATUS IN ('OPEN', 'INVALID')" },
    });

    expect(queryByDataTest(container, 'TextModeError')).not.toBeNull();
    expect(queryByDataTest(container, 'TextModeDiagnostic[0]')).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
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

  it('Prepends new root nodes when newNodePlacement is set to prepend', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_NUMBER', value: 5, operator: 'NOT_EQUAL' },
        ]}
        singleRootGroup={false}
        newNodePlacement="prepend"
        onChange={onChange}
      />
    );

    fireEvent.click(getByDataTest(container, 'AddRootRule'));

    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ field: '' }),
      expect.objectContaining({ field: 'MOCK_FIELD', value: 'alpha' }),
      expect.objectContaining({ field: 'MOCK_NUMBER', value: 5 }),
    ]);

    fireEvent.click(getByDataTest(container, 'AddRootGroup'));

    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ type: 'GROUP' }),
      expect.objectContaining({ field: '' }),
      expect.objectContaining({ field: 'MOCK_FIELD', value: 'alpha' }),
      expect.objectContaining({ field: 'MOCK_NUMBER', value: 5 }),
    ]);
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

  it('Keeps identical targeted read-only siblings non-deletable after locking one in controlled mode', async () => {
    const ControlledBuilder = () => {
      const [value, setValue] = React.useState<DenormalizedQuery>([
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
              readOnly: {
                enabled: true,
                targets: ['field', 'operator'],
              },
            },
          ],
        },
      ]);

      return (
        <Builder
          fields={fields}
          lockable
          data={value}
          onChange={setValue}
        />
      );
    };

    const { container } = render(<ControlledBuilder />);

    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(1);

    fireEvent.click(getAllByDataTest(container, 'LockToggle[rule]')[0]);

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: 'Delete' })
      ).not.toBeInTheDocument();
    });
  });

  it('Only toggles lock state for the targeted cloned rule in controlled mode', async () => {
    let latestData: IBuilderProps['data'] | null = null;

    const ControlledBuilder = () => {
      const [value, setValue] = React.useState<DenormalizedQuery>([
        {
          type: 'GROUP' as const,
          value: 'AND' as const,
          isNegated: false,
          children: [
            {
              field: 'MOCK_FIELD',
              value: 'alpha',
              operator: 'EQUAL' as const,
              readOnly: {
                enabled: true,
                targets: ['field', 'operator'] as ('field' | 'operator')[],
              },
            },
          ],
        },
      ]);

      latestData = value;

      return (
        <Builder
          fields={fields}
          cloneable
          lockable
          data={value}
          onChange={setValue}
        />
      );
    };

    const { container } = render(<ControlledBuilder />);

    fireEvent.click(getAllByDataTest(container, 'CloneButton[rule]')[0]);

    await waitFor(() => {
      expect(getAllByDataTest(container, 'IteratorRule')).toHaveLength(2);
    });

    fireEvent.click(getAllByDataTest(container, 'LockToggle[rule]')[0]);

    await waitFor(() => {
      expect(latestData).toEqual([
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [
            {
              field: 'MOCK_FIELD',
              value: 'alpha',
              operator: 'EQUAL',
              readOnly: {
                enabled: false,
                targets: ['field', 'operator'],
              },
            },
            {
              field: 'MOCK_FIELD',
              value: 'alpha',
              operator: 'EQUAL',
              readOnly: {
                enabled: true,
                targets: ['field', 'operator'],
              },
            },
          ],
        },
      ]);
    });
  });

  it('Preserves rule read-only targets when toggling lock state through the GUI', () => {
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
                readOnly: {
                  enabled: true,
                  targets: ['field'],
                },
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
            readOnly: {
              enabled: false,
              targets: ['field'],
            },
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
            readOnly: {
              enabled: true,
              targets: ['field'],
            },
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

  it('Preserves group read-only targets when cycling lock state through the GUI', () => {
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
                readOnly: {
                  enabled: true,
                  targets: ['combinator'],
                },
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
            readOnly: {
              enabled: true,
              targets: ['combinator'],
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
            readOnly: {
              enabled: false,
              targets: ['combinator'],
              inheritToChildren: false,
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
            readOnly: {
              enabled: true,
              targets: ['combinator'],
              inheritToChildren: false,
            },
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

  it('Exposes imperative builderRef methods for reads, mutations, and history', () => {
    const onChange = jest.fn();
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={fields}
          history
          cloneable
          lockable
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
    };

    render(<TestComponent />);

    const getBuilderRef = () => {
      const currentBuilderRef = builderRefObject?.current;
      expect(currentBuilderRef).toBeDefined();
      return currentBuilderRef as IBuilderRef;
    };
    const initialNodes = getBuilderRef().getNodes();
    const rootGroupId = initialNodes.find((node) => 'type' in node)?.id as string;
    const ruleIds = initialNodes
      .filter((node) => 'field' in node)
      .map((node) => node.id);
    const firstRuleId = ruleIds[0];
    const secondRuleId = ruleIds[1];

    expect(initialNodes).toHaveLength(3);
    expect(getBuilderRef().getData()).toEqual([
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

    expect(getBuilderRef().getNodeById(firstRuleId)).toMatchObject({
      field: 'MOCK_FIELD',
      value: 'alpha',
      operator: 'EQUAL',
    });

    act(() => {
      expect(getBuilderRef().cloneNode(firstRuleId)).toBe(true);
    });
    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_NUMBER', value: 5, operator: 'NOT_EQUAL' },
        ],
      },
    ]);

    act(() => {
      expect(
        getBuilderRef().addRule(
          { field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' },
          rootGroupId
        )
      ).toBe(true);
    });
    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_NUMBER', value: 5, operator: 'NOT_EQUAL' },
          { field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' },
        ],
      },
    ]);

    act(() => {
      expect(getBuilderRef().setNodeLock(firstRuleId, 'self')).toBe(true);
    });
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
            readOnly: true,
          },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_NUMBER', value: 5, operator: 'NOT_EQUAL' },
          { field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' },
        ],
      },
    ]);

    act(() => {
      expect(getBuilderRef().unlockNode(firstRuleId)).toBe(true);
      expect(getBuilderRef().moveNode(secondRuleId, 0, rootGroupId)).toBe(true);
    });
    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'MOCK_NUMBER', value: 5, operator: 'NOT_EQUAL' },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' },
        ],
      },
    ]);

    act(() => {
      expect(
        getBuilderRef().updateNode(secondRuleId, (node) =>
          'field' in node
            ? {
                ...node,
                value: 10,
              }
            : node
        )
      ).toBe(true);
    });
    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'MOCK_NUMBER', value: 10, operator: 'NOT_EQUAL' },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' },
        ],
      },
    ]);

    const history = getBuilderRef().getHistory();
    expect(history.past.length).toBeGreaterThan(0);

    act(() => {
      getBuilderRef().undo();
    });
    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'MOCK_NUMBER', value: 5, operator: 'NOT_EQUAL' },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' },
        ],
      },
    ]);

    act(() => {
      getBuilderRef().redo();
    });
    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'MOCK_NUMBER', value: 10, operator: 'NOT_EQUAL' },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' },
        ],
      },
    ]);

    act(() => {
      getBuilderRef().setHistory({ past: [], future: [] });
    });
    expect(getBuilderRef().getHistory()).toEqual({ past: [], future: [] });

    act(() => {
      expect(getBuilderRef().deleteNode(firstRuleId)).toBe(true);
    });
    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'MOCK_NUMBER', value: 10, operator: 'NOT_EQUAL' },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' },
        ],
      },
    ]);
  });

  it('Exposes imperative field option methods without replacing the fields prop', () => {
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={listFields}
          components={{
            ...defaultComponents,
            form: {
              ...defaultComponents.form,
              Select: ({ id, values, selectedValue }) => (
                <div
                  data-test="SelectSpy"
                  data-id={id}
                  data-values={values.map(({ value }) => value).join(',')}
                  data-selected={selectedValue || ''}
                />
              ),
            },
          }}
          data={[
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [{ field: 'STATUS', value: 'OPEN', operator: 'EQUAL' }],
            },
          ]}
        />
      );
    };

    const { container } = render(<TestComponent />);

    const getBuilderRef = () => {
      const currentBuilderRef = builderRefObject?.current;
      expect(currentBuilderRef).toBeDefined();
      return currentBuilderRef as IBuilderRef;
    };

    const getValueSelect = () => {
      const ruleId = getBuilderRef()
        .getNodes()
        .find((node) => 'field' in node)?.id;

      return ruleId
        ? (container.querySelector(
            `[data-id="query-builder-rule-${ruleId}-value"]`
          ) as HTMLElement | null)
        : null;
    };

    expect(getBuilderRef().isFieldInUse('STATUS')).toBe(true);
    expect(getBuilderRef().isFieldInUse('UNKNOWN')).toBe(false);
    expect(getBuilderRef().getFieldOptionState('STATUS')).toEqual({
      options: [
        { value: 'OPEN', label: 'Open' },
        { value: 'CLOSED', label: 'Closed' },
      ],
      status: 'idle',
    });
    expect(getValueSelect()?.getAttribute('data-values')).toBe('OPEN,CLOSED');

    act(() => {
      getBuilderRef().setFieldOptionsStatus('STATUS', 'loading');
      getBuilderRef().setFieldOptions('STATUS', [
        { value: 'ARCHIVED', label: 'Archived' },
      ]);
    });

    expect(getBuilderRef().getFieldOptionState('STATUS')).toEqual({
      options: [{ value: 'ARCHIVED', label: 'Archived' }],
      status: 'success',
    });
    expect(getValueSelect()?.getAttribute('data-values')).toBe('ARCHIVED');

    act(() => {
      getBuilderRef().invalidateFieldOptions('STATUS');
    });

    expect(getBuilderRef().getFieldOptionState('STATUS')).toEqual({
      options: [
        { value: 'OPEN', label: 'Open' },
        { value: 'CLOSED', label: 'Closed' },
      ],
      status: 'idle',
    });
    expect(getValueSelect()?.getAttribute('data-values')).toBe('OPEN,CLOSED');
  });

  it('reloadFieldOptions invalidates the runtime cache and notifies the consumer', () => {
    const onFieldOptionsReload = jest.fn();
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={listFields}
          data={[
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [{ field: 'STATUS', value: 'OPEN', operator: 'EQUAL' }],
            },
          ]}
          onFieldOptionsReload={onFieldOptionsReload}
        />
      );
    };

    render(<TestComponent />);

    const getBuilderRef = () => {
      const currentBuilderRef = builderRefObject?.current;
      expect(currentBuilderRef).toBeDefined();
      return currentBuilderRef as IBuilderRef;
    };

    act(() => {
      getBuilderRef().setFieldOptions('STATUS', [
        { value: 'ARCHIVED', label: 'Archived' },
      ]);
      getBuilderRef().reloadFieldOptions('STATUS');
    });

    expect(onFieldOptionsReload).toHaveBeenCalledWith('STATUS');
    expect(getBuilderRef().getFieldOptionState('STATUS')).toEqual({
      options: [
        { value: 'OPEN', label: 'Open' },
        { value: 'CLOSED', label: 'Closed' },
      ],
      status: 'idle',
    });
  });

  it('Notifies builderRef subscribers when the builder becomes ready and when data changes', async () => {
    let builderRefObject: BuilderRef | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={fields}
          data={[
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
              ],
            },
          ]}
          onChange={jest.fn()}
        />
      );
    };

    render(<TestComponent />);

    const builderRef = builderRefObject as BuilderRef | null;
    expect(builderRef).toBeDefined();

    const states: DenormalizedQuery[] = [];
    const unsubscribe = builderRef?.subscribe((builder) => {
      if (!builder) {
        return;
      }

      states.push(builder.getData());
    });

    expect(states[0]).toEqual([
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
        ],
      },
    ]);

    const firstRuleId = builderRef?.current
      ?.getNodes()
      .find((node) => 'field' in node)?.id;

    expect(firstRuleId).toBeDefined();

    act(() => {
      expect(
        builderRef?.current?.updateNode(firstRuleId as string, (node) => ({
          ...(node as INormalizedRuleNode),
          value: 'beta',
        }))
      ).toBe(true);
    });

    await waitFor(() => {
      expect(states.length).toBeGreaterThanOrEqual(2);
      expect(states.at(-1)).toEqual([
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [
            {
              field: 'MOCK_FIELD',
              value: 'beta',
              operator: 'EQUAL',
            },
          ],
        },
      ]);
    });

    unsubscribe?.();
  });

  it('Supports rule-scoped field options and nearest field lookup for repeated groups', () => {
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={dependentListFields}
          components={{
            ...defaultComponents,
            form: {
              ...defaultComponents.form,
              Select: ({ id, values, selectedValue }) => (
                <div
                  data-test="SelectSpy"
                  data-id={id}
                  data-values={values.map(({ value }) => value).join(',')}
                  data-selected={selectedValue || ''}
                />
              ),
            },
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
                  children: [
                    { field: 'COUNTRY', value: 'CZ', operator: 'EQUAL' },
                    { field: 'CITY', value: '', operator: 'EQUAL' },
                  ],
                },
                {
                  type: 'GROUP',
                  value: 'AND',
                  isNegated: false,
                  children: [
                    { field: 'COUNTRY', value: 'SK', operator: 'EQUAL' },
                    { field: 'CITY', value: '', operator: 'EQUAL' },
                  ],
                },
              ],
            },
          ]}
        />
      );
    };

    const { container } = render(<TestComponent />);

    const getBuilderRef = () => {
      const currentBuilderRef = builderRefObject?.current;
      expect(currentBuilderRef).toBeDefined();
      return currentBuilderRef as IBuilderRef;
    };
    const cityRules = getBuilderRef()
      .getNodes()
      .filter((node) => 'field' in node && node.field === 'CITY');
    const firstCityRuleId = cityRules[0]?.id as string;
    const secondCityRuleId = cityRules[1]?.id as string;

    expect(getBuilderRef().getNearestField(firstCityRuleId, 'COUNTRY')).toMatchObject({
      field: 'COUNTRY',
      value: 'CZ',
    });
    expect(getBuilderRef().getNearestField(secondCityRuleId, 'COUNTRY')).toMatchObject({
      field: 'COUNTRY',
      value: 'SK',
    });

    act(() => {
      getBuilderRef().setFieldOptions('CITY', [
        { value: 'SHARED', label: 'Shared City' },
      ]);
      getBuilderRef().setRuleOptions(firstCityRuleId, [
        { value: 'PRG', label: 'Prague' },
      ]);
      getBuilderRef().setRuleOptionsStatus(secondCityRuleId, 'loading');
      getBuilderRef().setRuleOptions(secondCityRuleId, [
        { value: 'BTS', label: 'Bratislava' },
      ]);
    });

    expect(getBuilderRef().getRuleOptionState(firstCityRuleId)).toEqual({
      options: [{ value: 'PRG', label: 'Prague' }],
      status: 'success',
    });
    expect(getBuilderRef().getRuleOptionState(secondCityRuleId)).toEqual({
      options: [{ value: 'BTS', label: 'Bratislava' }],
      status: 'success',
    });

    expect(
      container.querySelector(
        `[data-id="query-builder-rule-${firstCityRuleId}-value"]`
      )
    ).toHaveAttribute('data-values', 'PRG');
    expect(
      container.querySelector(
        `[data-id="query-builder-rule-${secondCityRuleId}-value"]`
      )
    ).toHaveAttribute('data-values', 'BTS');

    act(() => {
      getBuilderRef().invalidateRuleOptions(firstCityRuleId);
    });

    expect(getBuilderRef().getRuleOptionState(firstCityRuleId)).toEqual({
      options: [{ value: 'SHARED', label: 'Shared City' }],
      status: 'success',
    });
    expect(
      container.querySelector(
        `[data-id="query-builder-rule-${firstCityRuleId}-value"]`
      )
    ).toHaveAttribute('data-values', 'SHARED');
  });

  it('Subscribes to dependency snapshots for one field without manual diffing', async () => {
    let builderRefObject: BuilderRef | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={dependentListFields}
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
                  children: [
                    { field: 'COUNTRY', value: 'CZ', operator: 'EQUAL' },
                    { field: 'CITY', value: '', operator: 'EQUAL' },
                  ],
                },
                {
                  type: 'GROUP',
                  value: 'AND',
                  isNegated: false,
                  children: [
                    { field: 'COUNTRY', value: 'SK', operator: 'EQUAL' },
                    { field: 'CITY', value: '', operator: 'EQUAL' },
                  ],
                },
              ],
            },
          ]}
          onChange={jest.fn()}
        />
      );
    };

    render(<TestComponent />);

    const builderRef = builderRefObject as BuilderRef | null;
    expect(builderRef).toBeDefined();

    const snapshots: Array<Array<{ ruleId: string; countryValue?: string }>> = [];
    const unsubscribe = builderRef?.subscribeToRuleDependencies(
      'CITY',
      ['COUNTRY'],
      (entries) => {
        snapshots.push(
          entries.map(({ ruleId, dependencies }) => ({
            ruleId,
            countryValue:
              dependencies.COUNTRY && typeof dependencies.COUNTRY.value === 'string'
                ? dependencies.COUNTRY.value
                : undefined,
          }))
        );
      }
    );

    expect(snapshots).toHaveLength(1);
    expect(snapshots[0]?.map(({ countryValue }) => countryValue)).toEqual([
      'CZ',
      'SK',
    ]);

    const firstCountryRuleId = builderRef?.current
      ?.getNodes()
      .find((node) => 'field' in node && node.field === 'COUNTRY')?.id;

    expect(firstCountryRuleId).toBeDefined();

    act(() => {
      expect(
        builderRef?.current?.updateNode(firstCountryRuleId as string, (node) => ({
          ...(node as INormalizedRuleNode),
          value: 'SK',
        }))
      ).toBe(true);
    });

    await waitFor(() => {
      expect(snapshots.length).toBeGreaterThanOrEqual(2);
      expect(snapshots.at(-1)?.map(({ countryValue }) => countryValue)).toEqual([
        'SK',
        'SK',
      ]);
    });

    unsubscribe?.();
  });

  it('Binds dependency-aware rule options with automatic hydration and refresh', async () => {
    let builderRefObject: BuilderRef | null = null;

    const cityOptionsByCountry: Record<string, Array<{ value: string; label: string }>> = {
      CZ: [
        { value: 'PRG', label: 'Prague' },
        { value: 'BRN', label: 'Brno' },
      ],
      SK: [
        { value: 'BTS', label: 'Bratislava' },
        { value: 'KSC', label: 'Kosice' },
      ],
    } as const;

    const TestComponent = () => {
      const [data, setData] = React.useState<DenormalizedQuery>([
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [
                { field: 'COUNTRY', value: 'CZ', operator: 'EQUAL' },
                { field: 'CITY', value: 'PRG', operator: 'EQUAL' },
              ],
            },
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [
                { field: 'COUNTRY', value: 'SK', operator: 'EQUAL' },
                { field: 'CITY', value: 'BTS', operator: 'EQUAL' },
              ],
            },
          ],
        },
      ]);
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      React.useEffect(
        () =>
          builderRef.bindRuleOptions('CITY', {
            dependencies: ['COUNTRY'],
            resolve: async ({ dependencies }) => {
              const countryValue = dependencies.COUNTRY?.value;

              if (typeof countryValue !== 'string') {
                return [];
              }

              return cityOptionsByCountry[countryValue] ?? [];
            },
            onOptionsResolved: ({ ruleId }) => {
              builderRef.reconcileRuleValueWithOptions(ruleId, {
                strategy: 'clear-if-missing',
              });
            },
          }),
        [builderRef]
      );

      return (
        <Builder
          ref={builderRef}
          fields={dependentListFields}
          data={data}
          onChange={setData}
        />
      );
    };

    render(<TestComponent />);

    const builderRef = builderRefObject as BuilderRef | null;
    expect(builderRef).toBeDefined();

    const cityRuleIds =
      builderRef?.current
        ?.getNodes()
        .filter((node) => 'field' in node && node.field === 'CITY')
        .map((node) => node.id) || [];

    expect(cityRuleIds).toHaveLength(2);

    await waitFor(() => {
      expect(builderRef?.current?.getRuleOptionState(cityRuleIds[0] || '')).toEqual({
        options: cityOptionsByCountry.CZ,
        status: 'success',
      });
      expect(builderRef?.current?.getRuleOptionState(cityRuleIds[1] || '')).toEqual({
        options: cityOptionsByCountry.SK,
        status: 'success',
      });
    });

    const firstCountryRuleId = builderRef?.current
      ?.getNodes()
      .find((node) => 'field' in node && node.field === 'COUNTRY')?.id;

    expect(firstCountryRuleId).toBeDefined();

    act(() => {
      expect(
        builderRef?.current?.updateNode(firstCountryRuleId as string, (node) => ({
          ...(node as INormalizedRuleNode),
          value: 'SK',
        }))
      ).toBe(true);
    });

    await waitFor(() => {
      expect(builderRef?.current?.getRuleOptionState(cityRuleIds[0] || '')).toEqual({
        options: cityOptionsByCountry.SK,
        status: 'success',
      });
      expect(builderRef?.current?.getNodeById(cityRuleIds[0] || '')).not.toHaveProperty(
        'value'
      );
    });
  });

  it('Reconciles a rule value against the current rule-scoped options', () => {
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={dependentListFields}
          data={[
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [{ field: 'CITY', value: 'PRG', operator: 'EQUAL' }],
            },
          ]}
          onChange={jest.fn()}
        />
      );
    };

    render(<TestComponent />);

    const getBuilderRef = () => {
      const currentBuilderRef = builderRefObject?.current;
      expect(currentBuilderRef).toBeDefined();
      return currentBuilderRef as IBuilderRef;
    };
    const cityRuleId = getBuilderRef()
      .getNodes()
      .find((node) => 'field' in node && node.field === 'CITY')?.id as string;

    act(() => {
      getBuilderRef().setRuleOptions(cityRuleId, [
        { value: 'BTS', label: 'Bratislava' },
      ]);
      expect(
        getBuilderRef().reconcileRuleValueWithOptions(cityRuleId, {
          strategy: 'clear-if-missing',
        })
      ).toBe(true);
    });

    expect(getBuilderRef().getNodeById(cityRuleId)).not.toHaveProperty('value');
  });

  it('Reconciles numeric list values against the current rule-scoped options', () => {
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={numericListFields}
          data={[
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [{ field: 'PRIORITY', value: 2, operator: 'EQUAL' }],
            },
          ]}
          onChange={jest.fn()}
        />
      );
    };

    render(<TestComponent />);

    const getBuilderRef = () => {
      const currentBuilderRef = builderRefObject?.current;
      expect(currentBuilderRef).toBeDefined();
      return currentBuilderRef as IBuilderRef;
    };
    const ruleId = getBuilderRef()
      .getNodes()
      .find((node) => 'field' in node && node.field === 'PRIORITY')?.id as string;

    act(() => {
      getBuilderRef().setRuleOptions(ruleId, [{ value: 3, label: 'High' }]);
      expect(
        getBuilderRef().reconcileRuleValueWithOptions(ruleId, {
          strategy: 'clear-if-missing',
        })
      ).toBe(true);
    });

    expect(getBuilderRef().getNodeById(ruleId)).not.toHaveProperty('value');
  });

  it('Reconciles numeric multi-list values against the current rule-scoped options', () => {
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={numericMultiListFields}
          data={[
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [{ field: 'SCORES', value: [1, 2], operator: 'ALL_IN' }],
            },
          ]}
          onChange={jest.fn()}
        />
      );
    };

    render(<TestComponent />);

    const getBuilderRef = () => {
      const currentBuilderRef = builderRefObject?.current;
      expect(currentBuilderRef).toBeDefined();
      return currentBuilderRef as IBuilderRef;
    };
    const ruleId = getBuilderRef()
      .getNodes()
      .find((node) => 'field' in node && node.field === 'SCORES')?.id as string;

    act(() => {
      getBuilderRef().setRuleOptions(ruleId, [{ value: 2, label: 'Two' }]);
      expect(
        getBuilderRef().reconcileRuleValueWithOptions(ruleId, {
          strategy: 'clear-if-missing',
        })
      ).toBe(true);
    });

    expect(getBuilderRef().getNodeById(ruleId)).toMatchObject({
      value: [2],
    });
  });

  it('Reconciles string multi-list values with partial overlap against the current rule-scoped options', () => {
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={stringMultiListFields}
          data={[
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [
                { field: 'SEGMENTS', value: ['A', 'B', 'C'], operator: 'ALL_IN' },
              ],
            },
          ]}
          onChange={jest.fn()}
        />
      );
    };

    render(<TestComponent />);

    const getBuilderRef = () => {
      const currentBuilderRef = builderRefObject?.current;
      expect(currentBuilderRef).toBeDefined();
      return currentBuilderRef as IBuilderRef;
    };
    const ruleId = getBuilderRef()
      .getNodes()
      .find((node) => 'field' in node && node.field === 'SEGMENTS')?.id as string;

    act(() => {
      getBuilderRef().setRuleOptions(ruleId, [
        { value: 'B', label: 'Segment B' },
        { value: 'D', label: 'Segment D' },
      ]);
      expect(
        getBuilderRef().reconcileRuleValueWithOptions(ruleId, {
          strategy: 'clear-if-missing',
        })
      ).toBe(true);
    });

    expect(getBuilderRef().getNodeById(ruleId)).toMatchObject({
      value: ['B'],
    });
  });

  it('Reconciles string multi-list values to an empty array when no options overlap', () => {
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={stringMultiListFields}
          data={[
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [
                { field: 'SEGMENTS', value: ['A', 'B'], operator: 'ALL_IN' },
              ],
            },
          ]}
          onChange={jest.fn()}
        />
      );
    };

    render(<TestComponent />);

    const getBuilderRef = () => {
      const currentBuilderRef = builderRefObject?.current;
      expect(currentBuilderRef).toBeDefined();
      return currentBuilderRef as IBuilderRef;
    };
    const ruleId = getBuilderRef()
      .getNodes()
      .find((node) => 'field' in node && node.field === 'SEGMENTS')?.id as string;

    act(() => {
      getBuilderRef().setRuleOptions(ruleId, [
        { value: 'D', label: 'Segment D' },
      ]);
      expect(
        getBuilderRef().reconcileRuleValueWithOptions(ruleId, {
          strategy: 'clear-if-missing',
        })
      ).toBe(true);
    });

    expect(getBuilderRef().getNodeById(ruleId)).toMatchObject({
      value: [],
    });
  });

  it('Reconciles against shared field options after rule-scoped options are cleared', () => {
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={dependentListFields}
          data={[
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [{ field: 'CITY', value: 'BTS', operator: 'EQUAL' }],
            },
          ]}
          onChange={jest.fn()}
        />
      );
    };

    render(<TestComponent />);

    const getBuilderRef = () => {
      const currentBuilderRef = builderRefObject?.current;
      expect(currentBuilderRef).toBeDefined();
      return currentBuilderRef as IBuilderRef;
    };
    const cityRuleId = getBuilderRef()
      .getNodes()
      .find((node) => 'field' in node && node.field === 'CITY')?.id as string;

    act(() => {
      getBuilderRef().setFieldOptions('CITY', [
        { value: 'PRG', label: 'Prague' },
        { value: 'BRN', label: 'Brno' },
      ]);
      getBuilderRef().setRuleOptions(cityRuleId, [
        { value: 'BTS', label: 'Bratislava' },
      ]);
      getBuilderRef().invalidateRuleOptions(cityRuleId);
      expect(
        getBuilderRef().reconcileRuleValueWithOptions(cityRuleId, {
          strategy: 'clear-if-missing',
        })
      ).toBe(true);
    });

    expect(getBuilderRef().getRuleOptionState(cityRuleId)).toEqual({
      options: [
        { value: 'PRG', label: 'Prague' },
        { value: 'BRN', label: 'Brno' },
      ],
      status: 'success',
    });
    expect(getBuilderRef().getNodeById(cityRuleId)).not.toHaveProperty('value');
  });

  it('Subscribes to reactive field option state updates', () => {
    let builderRefObject: BuilderRef | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={listFields}
          data={[
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [{ field: 'STATUS', value: 'OPEN', operator: 'EQUAL' }],
            },
          ]}
          onChange={jest.fn()}
        />
      );
    };

    render(<TestComponent />);

    const builderRef = builderRefObject as BuilderRef | null;
    expect(builderRef).toBeDefined();

    const states: Array<{ status: string; optionCount: number }> = [];
    const unsubscribe = builderRef?.subscribeToFieldOptionState('STATUS', (state) => {
      states.push({
        status: state.status,
        optionCount: state.options.length,
      });
    });

    expect(states[0]).toEqual({
      status: 'idle',
      optionCount: 2,
    });

    act(() => {
      builderRef?.current?.setFieldOptionsStatus('STATUS', 'loading');
      builderRef?.current?.setFieldOptions('STATUS', [
        { value: 'ACTIVE', label: 'Active' },
      ]);
    });

    expect(states).toContainEqual({
      status: 'loading',
      optionCount: 0,
    });
    expect(states.at(-1)).toEqual({
      status: 'success',
      optionCount: 1,
    });

    unsubscribe?.();
  });

  it('Subscribes to reactive rule option state updates', () => {
    let builderRefObject: BuilderRef | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={dependentListFields}
          data={[
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [
                { field: 'COUNTRY', value: 'CZ', operator: 'EQUAL' },
                { field: 'CITY', value: '', operator: 'EQUAL' },
              ],
            },
          ]}
          onChange={jest.fn()}
        />
      );
    };

    render(<TestComponent />);

    const builderRef = builderRefObject as BuilderRef | null;
    expect(builderRef).toBeDefined();

    const cityRuleId = builderRef?.current
      ?.getNodes()
      .find((node) => 'field' in node && node.field === 'CITY')?.id;

    expect(cityRuleId).toBeDefined();

    const states: Array<{ status: string; optionCount: number }> = [];
    const unsubscribe = builderRef?.subscribeToRuleOptionState(
      cityRuleId as string,
      (state) => {
        states.push({
          status: state.status,
          optionCount: state.options.length,
        });
      }
    );

    expect(states[0]).toEqual({
      status: 'idle',
      optionCount: 0,
    });

    act(() => {
      builderRef?.current?.setRuleOptionsStatus(cityRuleId as string, 'loading');
      builderRef?.current?.setRuleOptions(cityRuleId as string, [
        { value: 'PRG', label: 'Prague' },
      ]);
    });

    expect(states).toContainEqual({
      status: 'loading',
      optionCount: 0,
    });
    expect(states.at(-1)).toEqual({
      status: 'success',
      optionCount: 1,
    });

    unsubscribe?.();
  });

  it('reloadRuleOptions invalidates the runtime cache and notifies the consumer', () => {
    const onRuleOptionsReload = jest.fn();
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={dependentListFields}
          data={[
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [{ field: 'CITY', value: '', operator: 'EQUAL' }],
            },
          ]}
          onRuleOptionsReload={onRuleOptionsReload}
        />
      );
    };

    render(<TestComponent />);

    const getBuilderRef = () => {
      const currentBuilderRef = builderRefObject?.current;
      expect(currentBuilderRef).toBeDefined();
      return currentBuilderRef as IBuilderRef;
    };
    const cityRuleId = getBuilderRef()
      .getNodes()
      .find((node) => 'field' in node && node.field === 'CITY')?.id as string;

    act(() => {
      getBuilderRef().setRuleOptions(cityRuleId, [
        { value: 'PRG', label: 'Prague' },
      ]);
      getBuilderRef().reloadRuleOptions(cityRuleId);
    });

    expect(onRuleOptionsReload).toHaveBeenCalledWith(cityRuleId);
    expect(getBuilderRef().getRuleOptionState(cityRuleId)).toEqual({
      options: [],
      status: 'idle',
    });
  });

  it('Emits field changes with node context', () => {
    const onFieldChange = jest.fn();
    const { container } = render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [{ field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' }],
          },
        ]}
        onFieldChange={onFieldChange}
        onChange={jest.fn()}
      />
    );

    const input = container.querySelector(
      'input[id^="query-builder-rule-"][id$="-value"]'
    ) as HTMLInputElement | null;

    expect(input).not.toBeNull();

    fireEvent.change(input as HTMLInputElement, {
      target: { value: 'beta' },
    });

    expect(onFieldChange).toHaveBeenCalledWith(
      expect.objectContaining({
        field: 'MOCK_FIELD',
        previousValue: 'alpha',
        value: 'beta',
        data: [
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              { field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' },
            ],
          },
        ],
      })
    );
    expect(onFieldChange.mock.calls[0][0].nodeId).toEqual(expect.any(String));
  });

  it('Uses newNodePlacement for imperative add methods when index is omitted', () => {
    const onChange = jest.fn();
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={fields}
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
          newNodePlacement="prepend"
          onChange={onChange}
        />
      );
    };

    render(<TestComponent />);

    const getBuilderRef = () => {
      const currentBuilderRef = builderRefObject?.current;
      expect(currentBuilderRef).toBeDefined();
      return currentBuilderRef as IBuilderRef;
    };
    const rootGroupId = getBuilderRef()
      .getNodes()
      .find((node) => 'type' in node)?.id as string;

    act(() => {
      expect(
        getBuilderRef().addRule(
          { field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' },
          rootGroupId
        )
      ).toBe(true);
    });

    expect(onChange).toHaveBeenLastCalledWith([
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'MOCK_FIELD', value: 'beta', operator: 'EQUAL' },
          { field: 'MOCK_FIELD', value: 'alpha', operator: 'EQUAL' },
          { field: 'MOCK_NUMBER', value: 5, operator: 'NOT_EQUAL' },
        ],
      },
    ]);
  });

  it('Blocks imperative deleteNode for read-only-targeted nodes', () => {
    const onChange = jest.fn();
    let builderRefObject: React.MutableRefObject<IBuilderRef | null> | null = null;

    const TestComponent = () => {
      const builderRef = useBuilderRef();
      builderRefObject = builderRef;

      return (
        <Builder
          ref={builderRef}
          fields={fields}
          data={[
            {
              type: 'GROUP',
              value: 'AND',
              isNegated: false,
              children: [
                {
                  field: 'MOCK_FIELD',
                  value: 'alpha',
                  operator: 'EQUAL',
                  readOnly: {
                    enabled: true,
                    targets: ['field'],
                  },
                },
              ],
            },
          ]}
          onChange={onChange}
        />
      );
    };

    render(<TestComponent />);

    const builderRef = builderRefObject as React.MutableRefObject<IBuilderRef | null> | null;
    const protectedRuleId = builderRef?.current
      ?.getNodes()
      .find((node: ReturnType<IBuilderRef['getNodes']>[number]) => 'field' in node)?.id;

    expect(protectedRuleId).toBeDefined();

    act(() => {
      expect(
        builderRef?.current?.deleteNode(protectedRuleId as string)
      ).toBe(false);
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('Hides root-group delete when removing the group would remove a protected descendant', () => {
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
                field: 'MOCK_FIELD',
                value: 'alpha',
                operator: 'EQUAL',
                readOnly: {
                  enabled: true,
                  targets: ['field'],
                },
              },
              {
                field: 'MOCK_NUMBER',
                value: 5,
                operator: 'NOT_EQUAL',
              },
            ],
          },
        ]}
        singleRootGroup={false}
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'Remove')).toBeNull();
  });

  it('shows only the editable rule delete button when a sibling rule is read-only-protected', () => {
    render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                field: 'MOCK_FIELD',
                value: 'alpha',
                operator: 'EQUAL',
                readOnly: {
                  enabled: true,
                  targets: ['field', 'operator'],
                },
              },
              {
                field: 'MOCK_NUMBER',
                value: 5,
                operator: 'NOT_EQUAL',
              },
            ],
          },
        ]}
        singleRootGroup={false}
        onChange={jest.fn()}
      />
    );

    expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(1);
  });

  it('hides nested group delete when removing the group would remove a protected direct child rule', () => {
    render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                type: 'GROUP',
                value: 'OR',
                isNegated: false,
                children: [
                  {
                    field: 'MOCK_FIELD',
                    value: 'alpha',
                    operator: 'EQUAL',
                    readOnly: {
                      enabled: true,
                      targets: ['field', 'operator'],
                    },
                  },
                  {
                    field: 'MOCK_NUMBER',
                    value: 5,
                    operator: 'NOT_EQUAL',
                  },
                ],
              },
            ],
          },
        ]}
        onChange={jest.fn()}
      />
    );

    expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(1);
  });

  it('keeps only editable nested rule deletes visible when both outer and nested groups contain protected rules', () => {
    render(
      <Builder
        fields={fields}
        data={[
          {
            type: 'GROUP',
            value: 'AND',
            isNegated: false,
            children: [
              {
                field: 'MOCK_FIELD',
                value: 'root-protected',
                operator: 'EQUAL',
                readOnly: {
                  enabled: true,
                  targets: ['field', 'operator'],
                },
              },
              {
                type: 'GROUP',
                value: 'OR',
                isNegated: false,
                children: [
                  {
                    field: 'MOCK_FIELD',
                    value: 'nested-protected',
                    operator: 'EQUAL',
                    readOnly: {
                      enabled: true,
                      targets: ['field', 'operator'],
                    },
                  },
                  {
                    field: 'MOCK_NUMBER',
                    value: 5,
                    operator: 'NOT_EQUAL',
                  },
                ],
              },
            ],
          },
        ]}
        onChange={jest.fn()}
      />
    );

    expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(1);
  });

  it('Allows disabling read-only delete protection on Builder', () => {
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
                field: 'MOCK_FIELD',
                value: 'alpha',
                operator: 'EQUAL',
                readOnly: {
                  enabled: true,
                  targets: ['field'],
                },
              },
              {
                field: 'MOCK_NUMBER',
                value: 5,
                operator: 'NOT_EQUAL',
              },
            ],
          },
        ]}
        singleRootGroup={false}
        readOnlyProtectsDelete={false}
        onChange={jest.fn()}
      />
    );

    expect(queryByDataTest(container, 'Remove')).not.toBeNull();
  });
});

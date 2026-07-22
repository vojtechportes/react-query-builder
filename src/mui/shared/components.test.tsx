import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Builder, IBuilderFieldProps, IStrings } from '../../index';
import { BuilderContext, IBuilderContextProps } from '../../builder-context';
import { strings } from '../../locales/en-us';
import { components as muiV7Components } from '../v7';
import { components as muiV9Components } from '../v9';
import { MuiSelect } from './components/mui-select';
import { MuiSelectMulti } from './components/mui-select-multi';
import { MuiSwitch } from './components/mui-switch';

const fields: IBuilderFieldProps[] = [
  {
    field: 'status',
    label: 'Order manual review threshold requiring attention',
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

const nestedGroupData = [
  {
    type: 'GROUP' as const,
    value: 'AND' as const,
    isNegated: false,
    children: [
      {
        type: 'GROUP' as const,
        value: 'OR' as const,
        isNegated: false,
        children: [],
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

const muiComponentContext = { strings } as IBuilderContextProps;

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

    const inputRoot = screen
      .getByDisplayValue('active')
      .closest('.MuiInputBase-root');
    const deleteButton = screen.getByRole('button', { name: 'Delete' });

    expect(inputRoot).toHaveClass('MuiInputBase-sizeSmall');
    expect(inputRoot).toHaveStyle({ height: '32px' });
    expect(screen.getByDisplayValue('active')).toHaveStyle({
      fontSize: '14px',
    });
    expect(deleteButton).toHaveClass('MuiButton-sizeSmall');
    expect(deleteButton).toHaveStyle({ height: '32px', fontSize: '14px' });
  });

  it('uses 32px controls, 14px type, and a primary toggle group', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={muiV9Components}
        onChange={jest.fn()}
      />
    );

    const inputRoot = screen
      .getByDisplayValue('active')
      .closest('.MuiInputBase-root');
    const selectTrigger = screen.getAllByRole('combobox')[0];
    const selectRoot = selectTrigger.closest('.MuiInputBase-root');
    const toggleGroup = screen.getByRole('group');
    const andToggle = screen.getByRole('button', { name: /and/i });

    expect(inputRoot).toHaveClass('MuiInputBase-sizeSmall');
    expect(inputRoot).toHaveStyle({ height: '32px' });
    expect(screen.getByDisplayValue('active')).toHaveStyle({
      fontSize: '14px',
    });
    expect(selectRoot).toHaveStyle({ height: '32px', fontSize: '14px' });
    expect(selectTrigger).toHaveStyle({
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    });
    expect(screen.getByRole('button', { name: 'Add Rule' })).toHaveClass(
      'MuiButton-sizeSmall'
    );
    expect(screen.getByRole('button', { name: 'Add Rule' })).toHaveStyle({
      height: '32px',
      fontSize: '14px',
    });
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(
      'MuiButton-sizeSmall'
    );
    expect(toggleGroup).toHaveClass('MuiToggleButtonGroup-root');
    expect(toggleGroup).toHaveStyle({ height: '32px', fontSize: '14px' });
    expect(andToggle).toHaveClass(
      'MuiToggleButton-sizeSmall',
      'MuiToggleButton-primary'
    );
    expect(andToggle).toHaveStyle({ height: '32px', fontSize: '14px' });
    expect(andToggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('clips a long single-select label with an ellipsis', () => {
    render(
      <BuilderContext.Provider value={muiComponentContext}>
        <div style={{ width: 160 }}>
          <MuiSelect
            values={[
              {
                value: 'review',
                label: 'Order manual review threshold requiring attention',
              },
            ]}
            selectedValue="review"
            onChange={jest.fn()}
          />
        </div>
      </BuilderContext.Provider>
    );

    expect(screen.getByRole('combobox')).toHaveStyle({
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    });
  });

  it('truncates multiselect text while reserving room for its badge', () => {
    const { container } = render(
      <BuilderContext.Provider value={muiComponentContext}>
        <div style={{ width: 160 }}>
          <MuiSelectMulti
            values={[
              { value: 'first', label: 'First very long selected option' },
              { value: 'second', label: 'Second selected option' },
              { value: 'third', label: 'Third selected option' },
            ]}
            selectedValue={['first', 'second', 'third']}
            onChange={jest.fn()}
            onDelete={jest.fn()}
          />
        </div>
      </BuilderContext.Provider>
    );

    const summary = container.querySelector(
      '.MuiBox-root[data-test="SelectMultiTrigger"]'
    );
    const summaryText = summary?.querySelector('.MuiTypography-root');
    const badge = container.querySelector(
      '[data-test="SelectMultiSummaryBadge"]'
    );

    expect(summaryText).toHaveStyle({
      flex: '1 1 auto',
      minWidth: '0',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });
    expect(badge).toHaveStyle({ flex: '0 0 32px' });
    expect(badge?.firstElementChild).not.toBeNull();
    expect(badge).toHaveTextContent('+2');
  });
  it('uses integer vertical positioning for root and nested group headers', () => {
    const { container } = render(
      <Builder
        fields={fields}
        data={nestedGroupData}
        components={muiV9Components}
        onChange={jest.fn()}
      />
    );

    const groupBodies = container.querySelectorAll(
      '[data-test="MuiGroupBody"]'
    );
    const groupHeaders = container.querySelectorAll(
      '[data-test="MuiGroupHeader"]'
    );
    const groupHeaderActions = container.querySelectorAll(
      '[data-test="MuiGroupHeaderActions"]'
    );

    expect(groupBodies).toHaveLength(2);
    expect(groupHeaders).toHaveLength(2);
    expect(groupHeaderActions).toHaveLength(2);
    groupBodies.forEach((groupBody) => {
      expect(groupBody).toHaveStyle({ padding: '12px' });
    });
    groupHeaders.forEach((groupHeader) => {
      expect(groupHeader).toHaveStyle({ alignItems: 'center' });
    });
    groupHeaderActions.forEach((groupHeaderAction) => {
      expect(groupHeaderAction).toHaveStyle({ alignItems: 'center' });
    });
  });

  it('preserves the native dimensions of the small MUI switch', () => {
    render(
      <MuiSwitch switched={false} onChange={jest.fn()} disabled={false} />
    );

    const switchRoot = screen.getByRole('switch').closest('.MuiSwitch-root');

    expect(switchRoot).toHaveClass('MuiSwitch-root', 'MuiSwitch-sizeSmall');
    expect(switchRoot).toHaveStyle({ height: '24px', width: '40px' });
    expect(switchRoot?.querySelector('.MuiSwitch-track')).not.toBeNull();
    expect(switchRoot?.querySelector('.MuiSwitch-thumb')).not.toBeNull();
  });
  it('disables group toggles when the builder is read-only', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={muiV9Components}
        readOnly
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /not/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /and/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /or/i })).toBeDisabled();
  });
  it('keeps negation independent from the selected combinator', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { rerender } = render(
      <Builder
        fields={fields}
        data={data}
        components={muiV9Components}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /or/i }));

    const queryWithOr = onChange.mock.calls.at(-1)?.[0];
    expect(queryWithOr[0]).toMatchObject({ value: 'OR', isNegated: false });

    rerender(
      <Builder
        fields={fields}
        data={queryWithOr}
        components={muiV9Components}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /not/i }));

    const negatedQueryWithOr = onChange.mock.calls.at(-1)?.[0];
    expect(negatedQueryWithOr[0]).toMatchObject({
      value: 'OR',
      isNegated: true,
    });
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

  it('renders history and text-mode toolbar actions with the MUI button adapter', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={muiV9Components}
        history
        textMode
        onChange={jest.fn()}
      />
    );

    const textModeToggle = screen.getByRole('button', {
      name: 'Switch to text mode',
    });

    expect(textModeToggle).toHaveClass('MuiButton-root');
    expect(textModeToggle.querySelector('.MuiSvgIcon-root')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveClass(
      'MuiButton-root'
    );
    expect(screen.getByRole('button', { name: 'Redo' })).toHaveClass(
      'MuiButton-root'
    );
  });

  it('renders the SQL text editor with the MUI text-mode input adapter', () => {
    render(
      <Builder
        fields={fields}
        data={data}
        components={muiV9Components}
        textMode
        defaultMode="text"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole('textbox')).toHaveClass(
      'builder-text-mode-input-field'
    );
  });

  it('renders the locked text-mode warning with the MUI alert adapter', () => {
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
        components={muiV9Components}
        textMode
        onChange={jest.fn()}
      />
    );

    expect(
      container.querySelector('[data-test="TextModeBlockedAlert"]')
    ).toHaveClass('MuiAlert-root');
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
    expect(screen.getByRole('button', { name: 'Duplicate rule' })).toHaveStyle({
      height: '32px',
      width: '32px',
      fontSize: '14px',
    });
    expect(screen.getByRole('button', { name: 'Protect group' })).toHaveStyle({
      height: '32px',
      width: '32px',
      fontSize: '14px',
    });
  });
});

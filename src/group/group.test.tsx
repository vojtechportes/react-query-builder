import React, { ReactElement } from 'react';
import '@testing-library/jest-dom';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../builder';
import { BuilderContext } from '../builder-context';
import { strings } from '../locales/en-us';
import { Group } from './group';
import { Group as GroupContainer } from './components/group-container';
import groupContainerStyles from './components/group-container/group-container.module.css';
import { Option, IOptionProps } from './components/option';
import optionStyles from './components/option/option.module.css';

const components: IBuilderComponentsProps = defaultComponents;
const fields: IBuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'TEXT',
  },
];
const data: any[] = [
  {
    type: 'GROUP',
    value: 'AND',
    id: 'test-1',
    isNegated: false,
    children: ['test-2'],
  },
  {
    type: 'GROUP',
    value: 'AND',
    id: 'test-2',
    isNegated: false,
    parent: 'test-1',
    children: [],
  },
];

const getByDataTest = (container: HTMLElement, value: string): HTMLElement => {
  const element = container.querySelector(`[data-test="${value}"]`);

  if (!element) {
    throw new Error(`Unable to find element with data-test="${value}"`);
  }

  return element as HTMLElement;
};

const queryByDataTest = (
  container: HTMLElement,
  value: string
): HTMLElement | null => container.querySelector(`[data-test="${value}"]`);

const renderWithContext = (
  element: ReactElement,
  overrides?: Partial<
    React.ComponentProps<typeof BuilderContext.Provider>['value']
  >
) =>
  render(
    <BuilderContext.Provider
      value={{
        components,
        fields,
        data,
        strings,
        setData: jest.fn(),
        onChange: jest.fn(),
        dispatchAction: jest.fn(),
        readOnly: false,
        ...overrides,
      }}
    >
      {element}
    </BuilderContext.Provider>
  );

const getGroupContainerCss = () =>
  readFileSync(
    join(
      __dirname,
      'components',
      'group-container',
      'group-container.module.css'
    ),
    'utf8'
  );

const getOptionCss = () =>
  readFileSync(
    join(__dirname, 'components', 'option', 'option.module.css'),
    'utf8'
  );

describe('#components/Group', () => {
  it('renders in editable and read-only modes', () => {
    const editable = renderWithContext(
      <Group id="test" isRoot value="AND" isNegated={false} />
    );
    const readOnly = renderWithContext(
      <Group id="test" isRoot value="AND" isNegated={false} />,
      { readOnly: true }
    );

    expect(editable.container.firstChild).toBeTruthy();
    expect(readOnly.container.firstChild).toBeTruthy();
  });

  it('invokes actions for group controls', () => {
    const dispatchAction = jest.fn();
    const { container } = renderWithContext(
      <Group id="test-2" isRoot={false} value="AND" isNegated={false} />,
      { dispatchAction }
    );

    fireEvent.click(getByDataTest(container, 'AddRule'));
    fireEvent.click(getByDataTest(container, 'AddGroup'));
    fireEvent.click(getByDataTest(container, 'Remove'));

    expect(dispatchAction).toHaveBeenCalled();
  });

  it('invokes root actions for the root group', () => {
    const dispatchAction = jest.fn();
    const { container } = renderWithContext(
      <Group id="test-1" isRoot value="AND" isNegated={false} />,
      { dispatchAction }
    );

    fireEvent.click(getByDataTest(container, 'AddRule'));
    fireEvent.click(getByDataTest(container, 'AddGroup'));

    expect(dispatchAction).toHaveBeenCalled();
  });

  it('prepends new nodes when newNodePlacement is set to prepend', () => {
    const dispatchAction = jest.fn();
    const { container } = renderWithContext(
      <Group id="test-1" isRoot value="AND" isNegated={false} />,
      { dispatchAction, newNodePlacement: 'prepend' }
    );

    fireEvent.click(getByDataTest(container, 'AddRule'));
    fireEvent.click(getByDataTest(container, 'AddGroup'));

    expect(dispatchAction).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'insert-subtree',
        parentId: 'test-1',
        index: 0,
      })
    );
    expect(dispatchAction).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'insert-subtree',
        parentId: 'test-1',
        index: 0,
      })
    );
  });

  it('hides group controls when the group is locally read-only', () => {
    const { container } = renderWithContext(
      <Group
        id="test-2"
        isRoot={false}
        value="AND"
        isNegated={false}
        readOnly
      />
    );

    expect(queryByDataTest(container, 'AddRule')).toBeNull();
    expect(queryByDataTest(container, 'AddGroup')).toBeNull();
    expect(queryByDataTest(container, 'Remove')).toBeNull();
  });

  it('hides the delete control when the group contains a protected descendant', () => {
    const protectedData: any = [
      {
        type: 'GROUP',
        value: 'AND',
        id: 'test-1',
        isNegated: false,
        children: ['test-2'],
      },
      {
        type: 'GROUP',
        value: 'AND',
        id: 'test-2',
        isNegated: false,
        parent: 'test-1',
        children: ['test-3'],
      },
      {
        field: 'MOCK_FIELD',
        value: 'alpha',
        operator: 'EQUAL',
        id: 'test-3',
        parent: 'test-2',
        readOnly: { enabled: true, targets: ['field'] },
      },
    ];
    const { container } = renderWithContext(
      <Group id="test-2" isRoot={false} value="AND" isNegated={false} />,
      { data: protectedData }
    );

    expect(queryByDataTest(container, 'Remove')).toBeNull();
  });

  it('keeps targeted group controls visible but blocks their actions', () => {
    const dispatchAction = jest.fn();
    const { container, getByText } = renderWithContext(
      <Group
        id="test-2"
        isRoot={false}
        value="AND"
        isNegated={false}
        readOnlyTargets={['negation', 'combinator']}
      />,
      { dispatchAction }
    );

    fireEvent.click(getByText(strings.group?.not || 'NOT'));
    fireEvent.click(getByText(strings.group?.and || 'AND'));
    fireEvent.click(getByText(strings.group?.or || 'OR'));

    expect(queryByDataTest(container, 'AddRule')).not.toBeNull();
    expect(dispatchAction).not.toHaveBeenCalled();
  });

  it('hides the negation control when allowGroupNegation is false', () => {
    const { container } = renderWithContext(
      <Group id="test-2" isRoot={false} value="AND" isNegated={false} />,
      { allowGroupNegation: false }
    );

    expect(queryByDataTest(container, 'Option[not]')).toBeNull();
  });

  it('uses semantic option state classes when group negation is hidden', () => {
    const { container, getByText } = renderWithContext(
      <Group id="test-2" isRoot={false} value="AND" isNegated={false} />,
      { allowGroupNegation: false }
    );

    expect(queryByDataTest(container, 'Option[not]')).toBeNull();

    const andOption = getByText(strings.group?.and || 'AND');
    const orOption = getByText(strings.group?.or || 'OR');
    const leftContainer = andOption.parentElement;

    expect(leftContainer).toHaveClass(groupContainerStyles.left);
    expect(leftContainer?.children).toHaveLength(2);
    expect(andOption).toHaveClass(optionStyles.option, optionStyles.selected);
    expect(andOption).toHaveAttribute('data-selected', 'true');
    expect(orOption).toHaveClass(optionStyles.option);
    expect(orOption).not.toHaveClass(optionStyles.selected);
    expect(orOption).toHaveAttribute('data-selected', 'false');
  });
  it('renders nothing when strings are unavailable', () => {
    const { container } = renderWithContext(<Group id="test-1" isRoot />, {
      strings: {},
    });

    expect(container.firstChild).toBeNull();
  });

  it('disables add rule when all fields are exhausted for the current group', () => {
    const limitedFields: IBuilderFieldProps[] = [
      {
        field: 'MOCK_FIELD',
        label: 'Mock Field',
        type: 'TEXT',
        usageLimit: { max: 1, scope: 'parent' },
      },
    ];
    const limitedData: any[] = [
      {
        type: 'GROUP',
        value: 'AND',
        id: 'test-1',
        isNegated: false,
        children: ['test-2'],
      },
      {
        field: 'MOCK_FIELD',
        value: 'alpha',
        operator: 'EQUAL',
        id: 'test-2',
        parent: 'test-1',
      },
    ];
    const { container } = renderWithContext(
      <Group id="test-1" isRoot value="AND" isNegated={false} />,
      {
        data: limitedData,
        fields: limitedFields,
      }
    );

    expect(getByDataTest(container, 'AddRule')).toHaveProperty(
      'disabled',
      true
    );
  });
  it.each([
    [false, false],
    [true, false],
    [false, true],
    [true, true],
  ])(
    'maps option selected=%s disabled=%s to finite state classes',
    (isSelected, disabled) => {
      const onClick = jest.fn();
      const { getByText } = render(
        <Option
          value="next"
          onClick={onClick}
          disabled={disabled}
          isSelected={isSelected}
          className="incoming-option"
        >
          Mode
        </Option>
      );
      const option = getByText('Mode');

      expect(option).toHaveClass(optionStyles.option, 'incoming-option');
      expect(option.classList.contains(optionStyles.selected)).toBe(isSelected);
      expect(option.classList.contains(optionStyles.disabled)).toBe(disabled);
      expect(option).toHaveAttribute('data-selected', String(isSelected));
      expect(option).toHaveAttribute('data-disabled', String(disabled));
      expect(option).not.toHaveAttribute('style');

      fireEvent.click(option);

      expect(onClick).toHaveBeenCalledTimes(disabled ? 0 : 1);
      if (!disabled) {
        expect(onClick).toHaveBeenCalledWith('next');
      }
    }
  );

  it('maps container drag-handle and control layouts to semantic state', () => {
    const { container, rerender } = render(
      <GroupContainer
        dragHandle={<span data-test="drag-handle" />}
        controlsLeft={<div>Left</div>}
        controlsRight={<div>Right</div>}
        contentOverlay={<span data-test="overlay" />}
        className="incoming-group"
      >
        <span>Content</span>
      </GroupContainer>
    );
    const group = container.firstElementChild as HTMLElement;
    const header = group.querySelector(
      '[data-group-controls-left]'
    ) as HTMLElement;

    expect(group).toHaveClass(
      groupContainerStyles.group,
      groupContainerStyles.withDragHandle,
      'incoming-group'
    );
    expect(group).toHaveAttribute('data-group-has-drag-handle', 'true');
    expect(group).toHaveAttribute('data-group-has-header', 'true');
    expect(header).toHaveClass(
      groupContainerStyles.header,
      groupContainerStyles.withLeftControls,
      groupContainerStyles.withRightControls
    );
    expect(header).toHaveAttribute('data-group-controls-left', 'true');
    expect(header).toHaveAttribute('data-group-controls-right', 'true');
    expect(group.querySelector('[data-test="drag-handle"]')).toBeTruthy();
    expect(group.querySelector('[data-test="overlay"]')).toBeTruthy();

    rerender(
      <GroupContainer>
        <span>Content</span>
      </GroupContainer>
    );

    expect(group).toHaveClass(groupContainerStyles.group);
    expect(group).not.toHaveClass(groupContainerStyles.withDragHandle);
    expect(group).toHaveAttribute('data-group-has-drag-handle', 'false');
    expect(group).toHaveAttribute('data-group-has-header', 'false');
    expect(group.querySelector(`.${groupContainerStyles.header}`)).toBeNull();

    rerender(
      <GroupContainer controlsLeft={<div>Left only</div>}>
        <span>Content</span>
      </GroupContainer>
    );

    const leftOnlyHeader = group.querySelector(
      '[data-group-controls-left]'
    ) as HTMLElement;

    expect(leftOnlyHeader).toHaveClass(
      groupContainerStyles.header,
      groupContainerStyles.withLeftControls
    );
    expect(leftOnlyHeader).not.toHaveClass(
      groupContainerStyles.withRightControls
    );
    expect(leftOnlyHeader).toHaveAttribute('data-group-controls-left', 'true');
    expect(leftOnlyHeader).toHaveAttribute(
      'data-group-controls-right',
      'false'
    );

    rerender(
      <GroupContainer controlsRight={<div>Right only</div>}>
        <span>Content</span>
      </GroupContainer>
    );

    const rightOnlyHeader = group.querySelector(
      '[data-group-controls-right]'
    ) as HTMLElement;

    expect(rightOnlyHeader).toHaveClass(
      groupContainerStyles.header,
      groupContainerStyles.withRightControls
    );
    expect(rightOnlyHeader).not.toHaveClass(
      groupContainerStyles.withLeftControls
    );
    expect(rightOnlyHeader).toHaveAttribute(
      'data-group-controls-left',
      'false'
    );
    expect(rightOnlyHeader).toHaveAttribute(
      'data-group-controls-right',
      'true'
    );
  });

  it('preserves custom group and read-only option contracts', () => {
    const CustomGroup = jest.fn(
      ({
        controlsLeft,
        controlsRight,
        children,
      }: React.ComponentProps<typeof GroupContainer>) => (
        <section>
          {controlsLeft}
          {controlsRight}
          {children}
        </section>
      )
    );
    const CustomOption = jest.fn(
      ({ children, disabled, isSelected }: IOptionProps) => (
        <span
          data-custom-option="true"
          data-disabled={disabled}
          data-selected={isSelected}
        >
          {children}
        </span>
      )
    );

    renderWithContext(
      <Group
        id="test-2"
        isRoot={false}
        value="AND"
        isNegated={false}
        readOnlyTargets={['negation', 'combinator']}
      >
        Nested content
      </Group>,
      {
        components: {
          ...defaultComponents,
          Group: CustomGroup,
          GroupHeaderOption: CustomOption,
        },
      }
    );

    expect(CustomGroup).toHaveBeenCalled();
    expect(CustomOption).toHaveBeenCalledTimes(3);
    expect(CustomOption.mock.calls.map(([props]) => props.disabled)).toEqual([
      true,
      true,
      true,
    ]);
    expect(CustomOption.mock.calls.map(([props]) => props.isSelected)).toEqual([
      false,
      true,
      false,
    ]);
  });

  it('renders root and nested group containers with the same public class contract', () => {
    const root = renderWithContext(
      <Group id="test-1" isRoot value="AND" isNegated={false} />
    );
    const nested = renderWithContext(
      <Group id="test-2" isRoot={false} value="OR" isNegated />
    );

    expect(root.container.firstElementChild).toHaveClass(
      groupContainerStyles.group
    );
    expect(nested.container.firstElementChild).toHaveClass(
      groupContainerStyles.group
    );
    expect(root.container.firstElementChild).toHaveAttribute(
      'data-group-has-header',
      'true'
    );
    expect(nested.container.firstElementChild).toHaveAttribute(
      'data-group-has-header',
      'true'
    );
  });

  it('renders group modules on the server without styled-components output', () => {
    const markup = renderToString(
      <BuilderContext.Provider
        value={{
          components,
          fields,
          data,
          strings,
          setData: jest.fn(),
          onChange: jest.fn(),
          dispatchAction: jest.fn(),
          readOnly: false,
        }}
      >
        <Group id="test-1" isRoot value="AND" isNegated={false} />
      </BuilderContext.Provider>
    );

    expect(markup).toContain('data-group-has-header="true"');
    expect(markup).toContain('data-selected="true"');
    expect(markup).not.toContain('data-styled');
    expect(markup).not.toContain('$theme');
  });

  it('exposes every CSS Module class used by the group components', () => {
    expect(optionStyles.option).toBe('option');
    expect(optionStyles.selected).toBe('selected');
    expect(optionStyles.disabled).toBe('disabled');
    expect(groupContainerStyles.group).toBe('group');
    expect(groupContainerStyles.withDragHandle).toBe('withDragHandle');
    expect(groupContainerStyles.body).toBe('body');
    expect(groupContainerStyles.header).toBe('header');
    expect(groupContainerStyles.withLeftControls).toBe('withLeftControls');
    expect(groupContainerStyles.withRightControls).toBe('withRightControls');
    expect(groupContainerStyles.left).toBe('left');
    expect(groupContainerStyles.right).toBe('right');
  });

  it('defines extracted token, joined-option, and responsive layout rules', () => {
    const groupCss = getGroupContainerCss();
    const optionCss = getOptionCss();

    expect(groupCss).toMatch(
      /box-shadow: var\(\s+--query-builder-shadow-group/
    );
    expect(groupCss).toContain(
      'padding: var(--query-builder-group-padding, 0.7rem)'
    );
    expect(groupCss).toContain('.left > div:first-child');
    expect(groupCss).toContain('.left > div + div');
    expect(groupCss).toContain('.left > div:last-child');
    expect(groupCss).toContain('@media (max-width: 900px)');
    expect(groupCss).toContain(
      'grid-template-columns: repeat(3, minmax(0, max-content))'
    );
    expect(optionCss).toContain(
      'color: var(--query-builder-color-primary-contrast-text)'
    );
    expect(optionCss).toContain('.disabled.selected');
  });
});

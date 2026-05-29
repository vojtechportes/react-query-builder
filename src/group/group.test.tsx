import React, { ReactElement } from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  defaultComponents,
} from '../builder';
import { BuilderContext } from '../builder-context';
import { strings } from '../constants/strings';
import { Group } from './group';

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
): HTMLElement | null =>
  container.querySelector(`[data-test="${value}"]`);

const renderWithContext = (
  element: ReactElement,
  overrides?: Partial<React.ComponentProps<typeof BuilderContext.Provider>['value']>
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
      <Group id="test-2" isRoot={false} value="AND" isNegated={false} readOnly />
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

  it('renders nothing when strings are unavailable', () => {
    const { container } = renderWithContext(<Group id="test-1" isRoot />, {
      strings: {},
    });

    expect(container.firstChild).toBeNull();
  });
});

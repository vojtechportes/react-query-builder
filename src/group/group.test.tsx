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

const getStyleRules = (): CSSStyleRule[] => {
  const rules: CSSStyleRule[] = [];

  const appendRules = (cssRules: CSSRuleList) => {
    Array.from(cssRules).forEach(rule => {
      if (rule instanceof CSSStyleRule) {
        rules.push(rule);
        return;
      }

      if (rule instanceof CSSMediaRule) {
        appendRules(rule.cssRules);
      }
    });
  };

  Array.from(document.styleSheets).forEach(styleSheet => {
    appendRules(styleSheet.cssRules);
  });

  return rules;
};

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

  it('hides the negation control when allowGroupNegation is false', () => {
    const { container } = renderWithContext(
      <Group id="test-2" isRoot={false} value="AND" isNegated={false} />,
      { allowGroupNegation: false }
    );

    expect(queryByDataTest(container, 'Option[not]')).toBeNull();
  });

  it('uses sibling-aware header join styles when group negation is hidden', () => {
    const { container, getByText } = renderWithContext(
      <Group id="test-2" isRoot={false} value="AND" isNegated={false} />,
      { allowGroupNegation: false }
    );

    expect(queryByDataTest(container, 'Option[not]')).toBeNull();

    const leftContainer = getByText(strings.group?.and || 'AND').parentElement;

    expect(leftContainer).toBeTruthy();
    expect(leftContainer?.children).toHaveLength(2);

    const classNames = Array.from(leftContainer?.classList || []);
    const rules = getStyleRules();
    const normalizeSelector = (selector: string) => selector.replace(/\s+/g, '');
    const hasRule = (suffix: string) =>
      classNames.some(className =>
        rules.some(
          rule =>
            normalizeSelector(rule.selectorText) ===
            normalizeSelector(`.${className}${suffix}`)
        )
      );

    expect(hasRule('>div:first-child')).toBe(true);
    expect(hasRule('>div+div')).toBe(true);
    expect(hasRule('>div:last-child')).toBe(true);
    expect(hasRule('>div:nth-child(2)')).toBe(false);
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

    expect(getByDataTest(container, 'AddRule')).toHaveProperty('disabled', true);
  });
});

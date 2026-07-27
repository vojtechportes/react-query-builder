import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DragPreview } from './drag-preview';
import { NormalizedQuery } from '../../../../shared/query/model/types/query-tree';
import styles from './drag-preview.module.css';

jest.mock('../../../components/rule/rule', () => ({
  Rule: jest.fn(({ field, value, operator, id }) => (
    <div
      data-test="RulePreview"
      data-field={field}
      data-value={value}
      data-operator={operator}
      data-id={id}
    />
  )),
}));

jest.mock('../../../components/group/group', () => ({
  Group: jest.fn(({ id, value, isNegated, isRoot, children }) => (
    <div
      data-test="GroupPreview"
      data-id={id}
      data-value={value}
      data-negated={String(isNegated)}
      data-root={String(isRoot)}
    >
      {children}
    </div>
  )),
}));

jest.mock('../iterator/iterator', () => ({
  Iterator: jest.fn(() => <div data-test="IteratorPreview" />),
}));

const { Iterator } = jest.requireMock('../iterator/iterator') as {
  Iterator: jest.Mock;
};

const data: NormalizedQuery = [
  {
    type: 'GROUP' as const,
    value: 'AND' as const,
    isNegated: false,
    id: 'root',
    children: ['rule-1', 'group-1'],
  },
  {
    field: 'name',
    value: 'Ada',
    operator: 'CONTAINS' as const,
    id: 'rule-1',
    parent: 'root',
  },
  {
    type: 'GROUP' as const,
    value: 'OR' as const,
    isNegated: true,
    id: 'group-1',
    parent: 'root',
    children: ['rule-2', 'missing-child'],
  },
  {
    field: 'age',
    value: 42,
    operator: 'LARGER' as const,
    id: 'rule-2',
    parent: 'group-1',
  },
];

describe('#components/DragPreview', () => {
  beforeEach(() => {
    Iterator.mockClear();
  });

  it('renders null when the active id is not found', () => {
    const { container } = render(
      <DragPreview activeId="missing" data={data} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders a rule preview with mapped rule props', () => {
    const { container } = render(<DragPreview activeId="rule-1" data={data} />);
    const preview = container.firstElementChild as HTMLElement;
    const rule = preview.firstElementChild as HTMLElement;

    expect(preview).toHaveClass(styles.previewContainer);
    expect(rule).toHaveAttribute('data-test', 'RulePreview');
    expect(rule).toHaveAttribute('data-field', 'name');
    expect(rule).toHaveAttribute('data-value', 'Ada');
    expect(rule).toHaveAttribute('data-operator', 'CONTAINS');
    expect(rule).toHaveAttribute('data-id', 'rule-1');
  });

  it('renders a root group preview and configures the overlay iterator', () => {
    const { container } = render(<DragPreview activeId="root" data={data} />);
    const group = container.querySelector(
      '[data-test="GroupPreview"]'
    ) as HTMLElement;

    expect(group).toHaveAttribute('data-id', 'root');
    expect(group).toHaveAttribute('data-value', 'AND');
    expect(group).toHaveAttribute('data-negated', 'false');
    expect(group).toHaveAttribute('data-root', 'true');
    expect(Iterator.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        originalData: data,
        filteredData: [data[1], data[2]],
        containerId: 'root',
        isRoot: false,
        activeDragId: null,
        isDragging: false,
        isOverlay: true,
      })
    );
  });

  it('renders a nested group preview and filters missing children', () => {
    render(<DragPreview activeId="group-1" data={data} />);

    expect(Iterator.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        filteredData: [data[3]],
        containerId: 'group-1',
      })
    );
  });

  it('renders on the server without styled-components runtime output', () => {
    const markup = renderToString(
      <DragPreview activeId="rule-1" data={data} />
    );

    expect(markup).toContain('class="previewContainer"');
    expect(markup).not.toContain('data-styled');
  });

  it('exposes every CSS Module class used by the component', () => {
    expect(styles.previewContainer).toBe('previewContainer');
  });
});

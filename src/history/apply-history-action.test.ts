import { applyHistoryAction } from './apply-history-action';
import { createInsertSubtreeAction } from './create-insert-subtree-action';
import { createMoveNodeAction } from './create-move-node-action';
import { createRemoveSubtreeAction } from './create-remove-subtree-action';
import { createReplaceNodeAction } from './create-replace-node-action';
import { NormalizedQuery } from '../utils/query-tree';

const createQuery = (): NormalizedQuery => [
  {
    id: 'group-root',
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: ['rule-1', 'group-2'],
  },
  {
    id: 'rule-1',
    parent: 'group-root',
    field: 'status',
    operator: 'EQUAL',
    value: 'open',
  },
  {
    id: 'group-2',
    parent: 'group-root',
    type: 'GROUP',
    value: 'OR',
    isNegated: false,
    children: ['rule-2'],
  },
  {
    id: 'rule-2',
    parent: 'group-2',
    field: 'priority',
    operator: 'NOT_EQUAL',
    value: 'low',
  },
];

describe('#history/applyHistoryAction', () => {
  it('round-trips inserted subtrees through the generated inverse action', () => {
    const data = createQuery();
    const action = createInsertSubtreeAction(
      [
        {
          id: 'rule-3',
          parent: 'group-root',
          field: 'team',
          operator: 'EQUAL',
          value: 'platform',
        },
      ],
      1,
      'group-root'
    );

    const appliedAction = applyHistoryAction(data, action);

    expect(appliedAction).not.toBeNull();
    expect(appliedAction?.data[0]).toMatchObject({
      children: ['rule-1', 'rule-3', 'group-2'],
    });

    const revertedAction = applyHistoryAction(
      appliedAction!.data,
      appliedAction!.inverse
    );

    expect(revertedAction?.data).toEqual(data);
  });

  it('round-trips removed subtrees through the generated inverse action', () => {
    const data = createQuery();
    const appliedAction = applyHistoryAction(
      data,
      createRemoveSubtreeAction('group-2')
    );

    expect(appliedAction).not.toBeNull();
    expect(appliedAction?.data).toEqual([
      {
        id: 'group-root',
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: ['rule-1'],
      },
      {
        id: 'rule-1',
        parent: 'group-root',
        field: 'status',
        operator: 'EQUAL',
        value: 'open',
      },
    ]);

    const revertedAction = applyHistoryAction(
      appliedAction!.data,
      appliedAction!.inverse
    );

    expect(revertedAction?.data).toEqual(data);
  });

  it('round-trips replaced nodes through the generated inverse action', () => {
    const data = createQuery();
    const appliedAction = applyHistoryAction(
      data,
      createReplaceNodeAction('rule-1', {
        id: 'rule-1',
        parent: 'group-root',
        field: 'status',
        operator: 'NOT_EQUAL',
        value: 'closed',
        readOnly: true,
      })
    );

    expect(appliedAction).not.toBeNull();
    expect(appliedAction?.data[1]).toMatchObject({
      operator: 'NOT_EQUAL',
      value: 'closed',
      readOnly: true,
    });

    const revertedAction = applyHistoryAction(
      appliedAction!.data,
      appliedAction!.inverse
    );

    expect(revertedAction?.data).toEqual(data);
  });

  it('round-trips moved nodes through the generated inverse action', () => {
    const data = createQuery();
    const appliedAction = applyHistoryAction(
      data,
      createMoveNodeAction('rule-1', 1, 'group-2')
    );

    expect(appliedAction).not.toBeNull();
    expect(appliedAction?.data[0]).toMatchObject({
      children: ['group-2'],
    });

    const movedGroup = appliedAction?.data.find((item) => item.id === 'group-2');
    const movedRule = appliedAction?.data.find((item) => item.id === 'rule-1');

    expect(movedGroup).toMatchObject({
      children: ['rule-2', 'rule-1'],
    });
    expect(movedRule).toMatchObject({
      id: 'rule-1',
      parent: 'group-2',
    });

    const revertedAction = applyHistoryAction(
      appliedAction!.data,
      appliedAction!.inverse
    );

    expect(revertedAction?.data).toEqual(data);
  });

  it('undoes same-parent upward moves with the correct inverse index', () => {
    const data: NormalizedQuery = [
      {
        id: 'group-root',
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: ['rule-1', 'rule-2', 'rule-3'],
      },
      {
        id: 'rule-1',
        parent: 'group-root',
        field: 'first',
        operator: 'EQUAL',
        value: 'a',
      },
      {
        id: 'rule-2',
        parent: 'group-root',
        field: 'second',
        operator: 'EQUAL',
        value: 'b',
      },
      {
        id: 'rule-3',
        parent: 'group-root',
        field: 'third',
        operator: 'EQUAL',
        value: 'c',
      },
    ];

    const appliedAction = applyHistoryAction(
      data,
      createMoveNodeAction('rule-3', 0, 'group-root')
    );

    expect(appliedAction?.data[0]).toMatchObject({
      children: ['rule-3', 'rule-1', 'rule-2'],
    });

    const revertedAction = applyHistoryAction(
      appliedAction!.data,
      appliedAction!.inverse
    );

    expect(revertedAction?.data).toEqual(data);
  });

  it('does not allow moving a node into its own descendant subtree', () => {
    const data = createQuery();

    expect(
      applyHistoryAction(data, createMoveNodeAction('group-root', 0, 'group-2'))
    ).toBeNull();
  });
});

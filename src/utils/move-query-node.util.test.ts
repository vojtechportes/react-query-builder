import { moveQueryNode } from './move-query-node.util';
import { NormalizedQuery } from './query-tree';

describe('#utils/moveQueryNode', () => {
  it('moves a rule into another group container', () => {
    const data: NormalizedQuery = [
      {
        id: 'group-1',
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: ['rule-1'],
      },
      {
        id: 'rule-1',
        field: 'A',
        parent: 'group-1',
      },
      {
        id: 'group-2',
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [],
      },
    ];

    expect(moveQueryNode(data, 'rule-1', 'drop-zone:group-2:0')).toEqual([
      {
        id: 'group-1',
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [],
      },
      {
        id: 'group-2',
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: ['rule-1'],
      },
      {
        id: 'rule-1',
        field: 'A',
        parent: 'group-2',
      },
    ]);
  });

  it('reorders root items before another root item', () => {
    const data: NormalizedQuery = [
      {
        id: 'rule-1',
        field: 'A',
      },
      {
        id: 'rule-2',
        field: 'B',
      },
      {
        id: 'rule-3',
        field: 'C',
      },
    ];

    expect(moveQueryNode(data, 'rule-3', 'drop-zone:root:0')).toEqual([
      {
        id: 'rule-3',
        field: 'C',
      },
      {
        id: 'rule-1',
        field: 'A',
      },
      {
        id: 'rule-2',
        field: 'B',
      },
    ]);
  });

  it('does not move a group into its own descendant container', () => {
    const data: NormalizedQuery = [
      {
        id: 'group-1',
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: ['group-2'],
      },
      {
        id: 'group-2',
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        parent: 'group-1',
        children: [],
      },
    ];

    expect(moveQueryNode(data, 'group-1', 'drop-zone:group-2:0')).toEqual(data);
  });
});

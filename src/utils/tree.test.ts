import { appendToGroup, removeItem, updateItem } from './tree';
import { NormalizedQuery } from './query-tree';

describe('#utils/tree', () => {
  it('Updates a single item', () => {
    const data: NormalizedQuery = [{ id: 'rule-1', value: 'before', field: '' }];

    expect(
      updateItem(data, 'rule-1', item => {
        item.value = 'after';
      })
    ).toEqual([{ id: 'rule-1', field: '', value: 'after' }]);
  });

  it('Appends after the last descendant in a nested group', () => {
    const data: NormalizedQuery = [
      {
        type: 'GROUP',
        id: 'group-1',
        value: 'AND',
        isNegated: false,
        children: ['group-2'],
      },
      {
        type: 'GROUP',
        id: 'group-2',
        parent: 'group-1',
        value: 'AND',
        isNegated: false,
        children: ['rule-1'],
      },
      {
        id: 'rule-1',
        parent: 'group-2',
        field: 'NAME',
      },
    ];

    expect(
      appendToGroup(data, 'group-1', {
        id: 'rule-2',
        parent: 'group-1',
        field: 'STATUS',
      })
    ).toEqual([
      {
        type: 'GROUP',
        id: 'group-1',
        value: 'AND',
        isNegated: false,
        children: ['group-2', 'rule-2'],
      },
      {
        type: 'GROUP',
        id: 'group-2',
        parent: 'group-1',
        value: 'AND',
        isNegated: false,
        children: ['rule-1'],
      },
      {
        id: 'rule-1',
        parent: 'group-2',
        field: 'NAME',
      },
      {
        id: 'rule-2',
        parent: 'group-1',
        field: 'STATUS',
      },
    ]);
  });

  it('Removes a group together with all descendants', () => {
    const data: NormalizedQuery = [
      {
        type: 'GROUP',
        id: 'group-1',
        value: 'AND',
        isNegated: false,
        children: ['group-2', 'rule-2'],
      },
      {
        type: 'GROUP',
        id: 'group-2',
        parent: 'group-1',
        value: 'AND',
        isNegated: false,
        children: ['rule-1'],
      },
      {
        id: 'rule-1',
        parent: 'group-2',
        field: 'NAME',
      },
      {
        id: 'rule-2',
        parent: 'group-1',
        field: 'STATUS',
      },
    ];

    expect(removeItem(data, 'group-2')).toEqual([
      {
        type: 'GROUP',
        id: 'group-1',
        value: 'AND',
        isNegated: false,
        children: ['rule-2'],
      },
      {
        id: 'rule-2',
        parent: 'group-1',
        field: 'STATUS',
      },
    ]);
  });
});

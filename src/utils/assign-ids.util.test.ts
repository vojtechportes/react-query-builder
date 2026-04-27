import type { DenormalizedQuery } from './query-tree';
import { assignIds } from './assign-ids.util';

const data: DenormalizedQuery = [
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
];

describe('#utils/assignIds', () => {
  it('Test assignIds', () => {
    expect(assignIds(data)).toBeDefined();
  });

  it('Preserves existing ids', () => {
    const dataWithIds: DenormalizedQuery = [
      {
        id: 'group-1',
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            id: 'rule-1',
            field: 'MOCK_FIELD',
            value: '',
          },
        ],
      },
    ];

    expect(assignIds(dataWithIds)).toEqual(dataWithIds);
  });
});

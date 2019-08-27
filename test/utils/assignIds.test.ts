import { assignIds } from '../../src/utils/assignIds';

const data: any[] = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
      },
    ],
  },
];

describe('#utils/assignIds', () => {
  it('Test assignIds', () => {
    expect(assignIds(data)).toBeDefined();
  });
});

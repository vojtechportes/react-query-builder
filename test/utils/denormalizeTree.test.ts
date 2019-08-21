import { denormalizeTree } from '../../src/utils/denormalizeTree'

const data: any[] = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    id: 'test-1',
    children: ['test-2', 'test-3'],
  },
  { field: 'MOCK_FIELD', value: '', id: 'test-2', parent: 'test-1' },
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    id: 'test-3',
    children: ['test-4'],
  },
  { field: 'MOCK_FIELD', value: '', id: 'test-4', parent: 'test-3', children: [] },
];

describe('#utils/denormalizeTree', () => {
  it('Test denormalizeTree', () => {
    expect(denormalizeTree(data)).toBeDefined()
  })
})
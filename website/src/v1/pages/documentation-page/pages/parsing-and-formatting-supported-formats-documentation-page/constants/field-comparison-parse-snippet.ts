export const fieldComparisonParseSnippet = `import { parseQuery } from '@vojtechportes/react-query-builder/parseQuery';

const result = parseQuery(
  'WHERE ORDER_TOTAL >= ORDER_APPROVAL_LIMIT',
  'SQL'
);

console.log(result.data[0]);
// {
//   type: 'GROUP',
//   value: 'AND',
//   isNegated: false,
//   children: [
//     {
//       field: 'ORDER_TOTAL',
//       operator: 'LARGER_EQUAL',
//       valueSource: 'field',
//       valueField: 'ORDER_APPROVAL_LIMIT',
//     },
//   ],
// }`;

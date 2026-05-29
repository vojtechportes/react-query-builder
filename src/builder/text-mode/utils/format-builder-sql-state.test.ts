import { formatBuilderSqlState } from './format-builder-sql-state';
import { IBuilderFieldProps } from '../../types';
import { DenormalizedQuery } from '../../../utils/query-tree';

const fields: IBuilderFieldProps[] = [
  {
    field: 'MOCK_FIELD',
    label: 'Mock Field',
    type: 'TEXT',
    operators: ['EQUAL'],
  },
  {
    field: 'MOCK_NUMBER',
    label: 'Mock Number',
    type: 'NUMBER',
    operators: ['NOT_EQUAL'],
  },
];

const getProtectedSegments = (
  value: string,
  protectedRanges: Array<{ start: number; end: number }>
) => protectedRanges.map((range) => value.slice(range.start, range.end));

describe('formatBuilderSqlState', () => {
  it('protects only non-root group brackets plus targeted rule fragments for groups with protected descendants', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: false,
            children: [
              {
                field: 'MOCK_FIELD',
                value: 'alpha',
                operator: 'EQUAL',
                readOnly: {
                  enabled: true,
                  targets: ['field', 'operator'],
                },
              },
              {
                field: 'MOCK_NUMBER',
                value: 5,
                operator: 'NOT_EQUAL',
              },
            ],
          },
        ],
      },
    ];

    const textState = formatBuilderSqlState(query, fields);
    const protectedSegments = getProtectedSegments(
      textState.value,
      textState.protectedRanges
    );

    expect(textState.value).toContain("(MOCK_FIELD = 'alpha' OR MOCK_NUMBER <> 5)");
    expect(protectedSegments).toEqual(
      expect.arrayContaining(['(', ')', 'MOCK_FIELD', '='])
    );
    expect(textState.protectedRanges).not.toContainEqual({
      start: 0,
      end: textState.value.length,
    });
  });

  it('does not protect non-root group brackets when delete protection is disabled', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: false,
            children: [
              {
                field: 'MOCK_FIELD',
                value: 'alpha',
                operator: 'EQUAL',
                readOnly: {
                  enabled: true,
                  targets: ['field', 'operator'],
                },
              },
              {
                field: 'MOCK_NUMBER',
                value: 5,
                operator: 'NOT_EQUAL',
              },
            ],
          },
        ],
      },
    ];

    const textState = formatBuilderSqlState(query, fields, {
      protectGroupDeletionBoundaries: false,
    });
    const protectedSegments = getProtectedSegments(
      textState.value,
      textState.protectedRanges
    );

    expect(protectedSegments).toEqual(
      expect.arrayContaining(['MOCK_FIELD', '='])
    );
    expect(protectedSegments).not.toEqual(expect.arrayContaining(['(', ')']));
  });

  it('protects the whole group when inherited full read-only is enabled', () => {
    const query: DenormalizedQuery = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          {
            type: 'GROUP',
            value: 'OR',
            isNegated: false,
            readOnly: {
              enabled: true,
              inheritToChildren: true,
            },
            children: [
              {
                field: 'MOCK_FIELD',
                value: 'alpha',
                operator: 'EQUAL',
              },
              {
                field: 'MOCK_NUMBER',
                value: 5,
                operator: 'NOT_EQUAL',
              },
            ],
          },
        ],
      },
    ];

    const textState = formatBuilderSqlState(query, fields);

    expect(textState.protectedRanges).toContainEqual({
      start: 0,
      end: textState.value.length,
    });
  });
});

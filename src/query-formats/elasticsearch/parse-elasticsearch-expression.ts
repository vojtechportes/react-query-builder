import type {
  DenormalizedNode,
} from '../../utils/query-tree';
import { inferWildcardOperator } from './shared';

type ElasticsearchDocument = Record<string, unknown>;

const isPlainObject = (value: unknown): value is ElasticsearchDocument =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const wrapAndGroup = (children: DenormalizedNode[]): DenormalizedNode => ({
  type: 'GROUP',
  value: 'AND',
  isNegated: false,
  children,
});

const createGroup = (
  combinator: 'AND' | 'OR',
  children: DenormalizedNode[],
  isNegated = false
): DenormalizedNode => ({
  type: 'GROUP',
  value: combinator,
  isNegated,
  children,
});

const parseTermExpression = (value: ElasticsearchDocument): DenormalizedNode[] => {
  const [field, fieldValue] = Object.entries(value)[0] ?? [];

  if (!field) {
    throw new Error('Elasticsearch term query must contain a field.');
  }

  return [
    {
      field,
      operator: 'EQUAL',
      value: fieldValue as never,
    },
  ];
};

const parseTermsExpression = (value: ElasticsearchDocument): DenormalizedNode[] => {
  const [field, fieldValue] = Object.entries(value)[0] ?? [];

  if (!field || !Array.isArray(fieldValue)) {
    throw new Error('Elasticsearch terms query must contain an array field value.');
  }

  return [
    {
      field,
      operator: 'IN',
      value: fieldValue as never,
    },
  ];
};

const parseRangeExpression = (value: ElasticsearchDocument): DenormalizedNode[] => {
  const [field, fieldValue] = Object.entries(value)[0] ?? [];

  if (!field || !isPlainObject(fieldValue)) {
    throw new Error('Elasticsearch range query must contain a field object.');
  }

  const keys = Object.keys(fieldValue);

  if (keys.length === 2 && keys.includes('gte') && keys.includes('lte')) {
    return [
      {
        field,
        operator: 'BETWEEN',
        value: [fieldValue.gte, fieldValue.lte] as string[] | number[],
      },
    ];
  }

  if (keys.length === 1) {
    const [key] = keys;

    switch (key) {
      case 'gt':
        return [{ field, operator: 'LARGER', value: fieldValue.gt as never }];
      case 'gte':
        return [{ field, operator: 'LARGER_EQUAL', value: fieldValue.gte as never }];
      case 'lt':
        return [{ field, operator: 'SMALLER', value: fieldValue.lt as never }];
      case 'lte':
        return [{ field, operator: 'SMALLER_EQUAL', value: fieldValue.lte as never }];
      default:
        break;
    }
  }

  throw new Error(`Unsupported Elasticsearch range query for field "${field}".`);
};

const parseExistsExpression = (value: ElasticsearchDocument, negated = false): DenormalizedNode[] => {
  const field = value.field;

  if (typeof field !== 'string') {
    throw new Error('Elasticsearch exists query must contain a string "field".');
  }

  return [{ field, operator: negated ? 'IS_NULL' : 'IS_NOT_NULL' }];
};

const parsePrefixExpression = (value: ElasticsearchDocument): DenormalizedNode[] => {
  const [field, fieldValue] = Object.entries(value)[0] ?? [];

  if (!field || typeof fieldValue !== 'string') {
    throw new Error('Elasticsearch prefix query must contain a string field value.');
  }

  return [{ field, operator: 'STARTS_WITH', value: fieldValue }];
};

const parseWildcardFieldValue = (
  field: string,
  fieldValue: unknown,
  negated = false
): DenormalizedNode[] => {
  const value =
    isPlainObject(fieldValue) && typeof fieldValue.value === 'string'
      ? fieldValue.value
      : fieldValue;

  if (typeof value !== 'string') {
    throw new Error(`Elasticsearch wildcard query for field "${field}" must be a string.`);
  }

  return [
    {
      field,
      ...inferWildcardOperator(value, negated),
    },
  ];
};

const parseWildcardExpression = (
  value: ElasticsearchDocument,
  negated = false
): DenormalizedNode[] => {
  const [field, fieldValue] = Object.entries(value)[0] ?? [];

  if (!field) {
    throw new Error('Elasticsearch wildcard query must contain a field.');
  }

  return parseWildcardFieldValue(field, fieldValue, negated);
};

const parseBoolClauseArray = (value: unknown): DenormalizedNode[] => {
  if (!Array.isArray(value)) {
    throw new Error('Elasticsearch bool clauses must be arrays.');
  }

  return value.flatMap(item => parseElasticsearchExpression(item));
};

const parseMustNotClause = (value: unknown): DenormalizedNode[] => {
  if (!Array.isArray(value)) {
    throw new Error('Elasticsearch bool.must_not must be an array.');
  }

  if (value.length === 1 && isPlainObject(value[0]) && 'exists' in value[0]) {
    return parseExistsExpression(value[0].exists as ElasticsearchDocument, true);
  }

  if (value.length === 1 && isPlainObject(value[0]) && 'wildcard' in value[0]) {
    return parseWildcardExpression(value[0].wildcard as ElasticsearchDocument, true);
  }

  if (value.length === 1 && isPlainObject(value[0]) && 'term' in value[0]) {
    const parsed = parseTermExpression(value[0].term as ElasticsearchDocument)[0];
    return [{ ...parsed, operator: 'NOT_EQUAL' }];
  }

  if (value.length === 1 && isPlainObject(value[0]) && 'terms' in value[0]) {
    const parsed = parseTermsExpression(value[0].terms as ElasticsearchDocument)[0];
    return [{ ...parsed, operator: 'NOT_IN' }];
  }

  return [createGroup('AND', parseBoolClauseArray(value), true)];
};

const parseBoolExpression = (value: ElasticsearchDocument): DenormalizedNode[] => {
  const hasMust = Array.isArray(value.must);
  const hasShould = Array.isArray(value.should);
  const hasMustNot = Array.isArray(value.must_not);

  if (!hasMust && !hasShould && !hasMustNot) {
    throw new Error('Elasticsearch bool query must contain must, should, or must_not.');
  }

  const children: DenormalizedNode[] = [];

  if (hasMust) {
    children.push(...parseBoolClauseArray(value.must));
  }

  if (hasShould) {
    children.push(createGroup('OR', parseBoolClauseArray(value.should)));
  }

  if (hasMustNot) {
    children.push(...parseMustNotClause(value.must_not));
  }

  if (children.length === 1) {
    return children;
  }

  return [wrapAndGroup(children)];
};

const unwrapQueryContainer = (value: ElasticsearchDocument): ElasticsearchDocument => {
  if ('query' in value && isPlainObject(value.query)) {
    return value.query;
  }

  return value;
};

export const parseElasticsearchExpression = (value: unknown): DenormalizedNode[] => {
  if (!isPlainObject(value)) {
    throw new Error('Elasticsearch query must be a JSON object.');
  }

  const document = unwrapQueryContainer(value);

  if ('bool' in document) {
    if (!isPlainObject(document.bool)) {
      throw new Error('Elasticsearch bool query must be an object.');
    }

    return parseBoolExpression(document.bool);
  }

  if ('term' in document && isPlainObject(document.term)) {
    return parseTermExpression(document.term);
  }

  if ('terms' in document && isPlainObject(document.terms)) {
    return parseTermsExpression(document.terms);
  }

  if ('range' in document && isPlainObject(document.range)) {
    return parseRangeExpression(document.range);
  }

  if ('exists' in document && isPlainObject(document.exists)) {
    return parseExistsExpression(document.exists);
  }

  if ('prefix' in document && isPlainObject(document.prefix)) {
    return parsePrefixExpression(document.prefix);
  }

  if ('wildcard' in document && isPlainObject(document.wildcard)) {
    return parseWildcardExpression(document.wildcard);
  }

  throw new Error('Unsupported Elasticsearch query structure.');
};

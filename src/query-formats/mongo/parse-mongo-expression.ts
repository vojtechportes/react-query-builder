import type {
  DenormalizedNode,
  IDenormalizedRuleNode,
} from '../../utils/query-tree';
import {
  inferRegexOperator,
  isMongoDocument,
  parseMongoFieldReference,
} from './shared';

type MongoDocument = Record<string, unknown>;

const parseRegexExpression = (
  field: string,
  value: MongoDocument,
  negated = false
): IDenormalizedRuleNode => {
  const pattern = value.$regex;

  if (typeof pattern !== 'string') {
    throw new Error(`Mongo regex for field "${field}" must be a string pattern.`);
  }

  return {
    field,
    ...inferRegexOperator(pattern, negated),
  };
};

const parseExprExpression = (value: MongoDocument): IDenormalizedRuleNode => {
  const operatorKeys = Object.keys(value);

  if (operatorKeys.length !== 1) {
    throw new Error('Mongo $expr must contain exactly one comparison operator.');
  }

  const [operatorKey] = operatorKeys;
  const operands = value[operatorKey];

  if (!Array.isArray(operands) || operands.length != 2) {
    throw new Error(`Mongo $expr operator "${operatorKey}" must contain two operands.`);
  }

  const leftField = parseMongoFieldReference(operands[0]);
  const rightField = parseMongoFieldReference(operands[1]);

  if (!leftField || !rightField) {
    throw new Error(
      'Mongo $expr field-to-field comparisons must use field references on both sides.'
    );
  }

  switch (operatorKey) {
    case '$eq':
      return {
        field: leftField,
        operator: 'EQUAL',
        valueSource: 'field',
        valueField: rightField,
      };
    case '$ne':
      return {
        field: leftField,
        operator: 'NOT_EQUAL',
        valueSource: 'field',
        valueField: rightField,
      };
    case '$gt':
      return {
        field: leftField,
        operator: 'LARGER',
        valueSource: 'field',
        valueField: rightField,
      };
    case '$gte':
      return {
        field: leftField,
        operator: 'LARGER_EQUAL',
        valueSource: 'field',
        valueField: rightField,
      };
    case '$lt':
      return {
        field: leftField,
        operator: 'SMALLER',
        valueSource: 'field',
        valueField: rightField,
      };
    case '$lte':
      return {
        field: leftField,
        operator: 'SMALLER_EQUAL',
        valueSource: 'field',
        valueField: rightField,
      };
    default:
      throw new Error(`Unsupported Mongo $expr operator "${operatorKey}".`);
  }
};

const parseFieldOperatorExpression = (
  field: string,
  value: MongoDocument
): DenormalizedNode[] => {
  const operatorKeys = Object.keys(value);

  if (operatorKeys.length === 0) {
    throw new Error(`Mongo field expression for "${field}" cannot be empty.`);
  }

  if (
    operatorKeys.length === 2 &&
    operatorKeys.includes('$gte') &&
    operatorKeys.includes('$lte')
  ) {
    return [
      {
        field,
        operator: 'BETWEEN',
        value: [value.$gte, value.$lte] as string[] | number[],
      },
    ];
  }

  if (operatorKeys.length === 1) {
    const [operatorKey] = operatorKeys;

    switch (operatorKey) {
      case '$eq':
        if (value.$eq === null) {
          return [{ field, operator: 'IS_NULL' }];
        }
        return [{ field, operator: 'EQUAL', value: value.$eq as never }];
      case '$ne':
        if (value.$ne === null) {
          return [{ field, operator: 'IS_NOT_NULL' }];
        }
        return [{ field, operator: 'NOT_EQUAL', value: value.$ne as never }];
      case '$gt':
        return [{ field, operator: 'LARGER', value: value.$gt as never }];
      case '$gte':
        return [{ field, operator: 'LARGER_EQUAL', value: value.$gte as never }];
      case '$lt':
        return [{ field, operator: 'SMALLER', value: value.$lt as never }];
      case '$lte':
        return [{ field, operator: 'SMALLER_EQUAL', value: value.$lte as never }];
      case '$in':
        return [{ field, operator: 'IN', value: value.$in as never }];
      case '$nin':
        return [{ field, operator: 'NOT_IN', value: value.$nin as never }];
      case '$all':
        return [{ field, operator: 'ALL_IN', value: value.$all as never }];
      case '$regex':
        return [parseRegexExpression(field, value)];
      case '$not':
        if (!isMongoDocument(value.$not)) {
          throw new Error(`Mongo $not for field "${field}" must wrap an object.`);
        }

        if ('$regex' in value.$not) {
          return [parseRegexExpression(field, value.$not, true)];
        }

        if (
          '$gte' in value.$not &&
          '$lte' in value.$not &&
          Object.keys(value.$not).length === 2
        ) {
          return [
            {
              field,
              operator: 'NOT_BETWEEN',
              value: [value.$not.$gte, value.$not.$lte] as string[] | number[],
            },
          ];
        }

        throw new Error(`Unsupported Mongo $not expression for field "${field}".`);
      default:
        throw new Error(`Unsupported Mongo operator "${operatorKey}" for field "${field}".`);
    }
  }

  return operatorKeys.flatMap(operatorKey =>
    parseFieldOperatorExpression(field, { [operatorKey]: value[operatorKey] })
  );
};

const buildAndGroup = (children: DenormalizedNode[]): DenormalizedNode => ({
  type: 'GROUP',
  value: 'AND',
  isNegated: false,
  children,
});

const isSameFieldRangeBoundaryGroup = (
  items: unknown[]
): items is Array<Record<string, { $lt?: unknown; $gt?: unknown }>> => {
  if (items.length !== 2) {
    return false;
  }

  const [first, second] = items;

  if (!isMongoDocument(first) || !isMongoDocument(second)) {
    return false;
  }

  const [firstField] = Object.keys(first);
  const [secondField] = Object.keys(second);

  if (!firstField || !secondField || firstField !== secondField) {
    return false;
  }

  return (
    isMongoDocument(first[firstField]) &&
    isMongoDocument(second[secondField]) &&
    '$lt' in first[firstField] &&
    '$gt' in second[secondField]
  );
};

const createLogicalGroup = (
  combinator: 'AND' | 'OR',
  items: unknown[],
  negated = false
): DenormalizedNode => {
  const children = items.flatMap(item => parseMongoExpression(item));

  if (negated && children.length === 1 && 'type' in children[0]) {
    const [child] = children;

    if (child.type === 'GROUP') {
      if ('value' in child && typeof child.value !== 'undefined') {
        return {
          type: 'GROUP',
          value: child.value,
          isNegated: !child.isNegated,
          children: child.children,
        };
      }

      return {
        type: 'GROUP',
        value: 'AND',
        isNegated: true,
        children: child.children,
      };
    }
  }

  return {
    type: 'GROUP',
    value: combinator,
    isNegated: negated,
    children,
  };
};

const parseRootDocument = (document: MongoDocument): DenormalizedNode[] =>
  Object.entries(document).flatMap(([key, value]) => {
    if (key === '$and') {
      if (!Array.isArray(value)) {
        throw new Error('Mongo $and must be an array.');
      }

      return [createLogicalGroup('AND', value)];
    }

    if (key === '$or') {
      if (!Array.isArray(value)) {
        throw new Error('Mongo $or must be an array.');
      }

      if (isSameFieldRangeBoundaryGroup(value)) {
        const field = Object.keys(value[0])[0];
        const lowerBound = (value[0][field] as { $lt: unknown }).$lt;
        const upperBound = (value[1][field] as { $gt: unknown }).$gt;

        return [
          {
            field,
            operator: 'NOT_BETWEEN',
            value: [lowerBound, upperBound] as string[] | number[],
          },
        ];
      }

      return [createLogicalGroup('OR', value)];
    }

    if (key === '$nor') {
      if (!Array.isArray(value)) {
        throw new Error('Mongo $nor must be an array.');
      }

      return [createLogicalGroup('OR', value, true)];
    }

    if (key === '$expr') {
      if (!isMongoDocument(value)) {
        throw new Error('Mongo $expr must be an object.');
      }

      return [parseExprExpression(value)];
    }

    if (isMongoDocument(value)) {
      return parseFieldOperatorExpression(key, value);
    }

    return [
      {
        field: key,
        operator: 'EQUAL',
        value: value as never,
      },
    ];
  });

export const parseMongoExpression = (value: unknown): DenormalizedNode[] => {
  if (!isMongoDocument(value)) {
    throw new Error('Mongo query must be a JSON object.');
  }

  const nodes = parseRootDocument(value);

  if (nodes.length <= 1) {
    return nodes;
  }

  return [buildAndGroup(nodes)];
};

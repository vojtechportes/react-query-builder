export const queryOperators = {
  LARGER: 'LARGER',
  SMALLER: 'SMALLER',
  LARGER_EQUAL: 'LARGER_EQUAL',
  SMALLER_EQUAL: 'SMALLER_EQUAL',
  EQUAL: 'EQUAL',
  NOT_EQUAL: 'NOT_EQUAL',
  ALL_IN: 'ALL_IN',
  /**
   * @deprecated Use `IN` instead. This alias will be removed in 2.0.0.
   */
  ANY_IN: 'ANY_IN',
  IN: 'IN',
  NOT_IN: 'NOT_IN',
  BETWEEN: 'BETWEEN',
  NOT_BETWEEN: 'NOT_BETWEEN',
  IS_NULL: 'IS_NULL',
  IS_NOT_NULL: 'IS_NOT_NULL',
  /**
   * @deprecated Use `CONTAINS` instead. This alias will be removed in 2.0.0.
   */
  LIKE: 'LIKE',
  /**
   * @deprecated Use `NOT_CONTAINS` instead. This alias will be removed in 2.0.0.
   */
  NOT_LIKE: 'NOT_LIKE',
  CONTAINS: 'CONTAINS',
  NOT_CONTAINS: 'NOT_CONTAINS',
  STARTS_WITH: 'STARTS_WITH',
  ENDS_WITH: 'ENDS_WITH',
} as const;

export type QueryOperator = keyof typeof queryOperators;

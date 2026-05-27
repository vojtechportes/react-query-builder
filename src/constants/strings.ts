export interface IStrings {
  textMode?: {
    toggleToBuilder?: string;
    toggleToText?: string;
    syntaxError?: string;
    locksUnsupported?: string;
    lockedRangesHover?: string;
    sql?: {
      possibleMissingQuote?: string;
      missingClosingQuote?: string;
      missingClosingIdentifierQuote?: string;
      unexpectedTokenInExpression?: string;
      missingClosingParenthesis?: string;
      missingOpeningParenthesis?: string;
      missingComma?: string;
      missingSqlOperator?: string;
      missingFieldIdentifier?: string;
      missingStringValue?: string;
      missingNumericValue?: string;
      missingToken?: string;
      missingAndKeyword?: string;
      missingOrKeyword?: string;
      missingNotKeyword?: string;
      missingInKeyword?: string;
      missingLikeKeyword?: string;
      missingIsKeyword?: string;
      missingNullKeyword?: string;
      missingBetweenKeyword?: string;
      missingKeyword?: string;
      expectedToken?: string;
      expectedKeyword?: string;
      unexpectedTokenAfterNot?: string;
      sqlInListsSupportOnlyStringAndNumberValues?: string;
      sqlBetweenSupportsOnlyStringAndNumberValues?: string;
      sqlArraysMustContainSameScalarType?: string;
      expectedScalarValue?: string;
      expectedFieldIdentifier?: string;
      unsupportedSqlOperator?: string;
      unknownSqlParseError?: string;
    };
  };
  history?: {
    undo?: string;
    redo?: string;
  };
  group?: {
    not?: string;
    or?: string;
    and?: string;
    addRule?: string;
    addGroup?: string;
    addGroupWithModifiers?: string;
    addGroupWithoutModifiers?: string;
    delete?: string;
    clone?: string;
    lock?: string;
    lockDescendants?: string;
    unlockDescendants?: string;
  };
  rule?: {
    delete?: string;
    clone?: string;
    lock?: string;
    unlock?: string;
  };
  form?: {
    selectYourValue?: string;
  };
  operators?: {
    LARGER?: string;
    SMALLER?: string;
    LARGER_EQUAL?: string;
    SMALLER_EQUAL?: string;
    EQUAL?: string;
    NOT_EQUAL?: string;
    ALL_IN?: string;
    /**
     * @deprecated Use `IN` instead. This alias will be removed in 2.0.0.
     */
    ANY_IN?: string;
    IN?: string;
    NOT_IN?: string;
    BETWEEN?: string;
    NOT_BETWEEN?: string;
    IS_NULL?: string;
    IS_NOT_NULL?: string;
    /**
     * @deprecated Use `CONTAINS` instead. This alias will be removed in 2.0.0.
     */
    LIKE?: string;
    /**
     * @deprecated Use `NOT_CONTAINS` instead. This alias will be removed in 2.0.0.
     */
    NOT_LIKE?: string;
    CONTAINS?: string;
    NOT_CONTAINS?: string;
    STARTS_WITH?: string;
    ENDS_WITH?: string;
  };
  validation?: {
    operatorNotAllowed?: string;
    valueNotAllowed?: string;
    required?: string;
    minLength?: string;
    maxLength?: string;
    matches?: string;
    min?: string;
    max?: string;
    integer?: string;
    positive?: string;
    negative?: string;
    minDate?: string;
    maxDate?: string;
    boolean?: string;
    oneOf?: string;
    minItems?: string;
    maxItems?: string;
    custom?: string;
    rangeOrder?: string;
    rangeOrderAllowEqual?: string;
    rangeCustom?: string;
    fieldNotFound?: string;
    invalidTree?: string;
  };
}

export const strings: IStrings = {
  textMode: {
    toggleToBuilder: 'Switch to builder mode',
    toggleToText: 'Switch to text mode',
    syntaxError: 'Syntax error',
    locksUnsupported:
      'Locked rules or groups are not supported in the text editor under this configuration.',
    lockedRangesHover: 'This SQL fragment is locked and cannot be edited.',
    sql: {
      possibleMissingQuote: 'Possible missing quote before this string boundary.',
      missingClosingQuote: 'Missing closing quote.',
      missingClosingIdentifierQuote: 'Missing closing identifier quote.',
      unexpectedTokenInExpression: 'Unexpected token "{token}" in SQL expression.',
      missingClosingParenthesis: 'Missing closing parenthesis.',
      missingOpeningParenthesis: 'Missing opening parenthesis.',
      missingComma: 'Missing comma.',
      missingSqlOperator: 'Missing SQL operator.',
      missingFieldIdentifier: 'Missing field identifier.',
      missingStringValue: 'Missing string value.',
      missingNumericValue: 'Missing numeric value.',
      missingToken: 'Missing token "{token}".',
      missingAndKeyword: 'Missing AND keyword.',
      missingOrKeyword: 'Missing OR keyword.',
      missingNotKeyword: 'Missing NOT keyword.',
      missingInKeyword: 'Missing IN keyword.',
      missingLikeKeyword: 'Missing LIKE keyword.',
      missingIsKeyword: 'Missing IS keyword.',
      missingNullKeyword: 'Missing NULL keyword.',
      missingBetweenKeyword: 'Missing BETWEEN keyword.',
      missingKeyword: 'Missing keyword "{keyword}".',
      expectedToken: 'Expected token "{token}" but found "{value}".',
      expectedKeyword: 'Expected keyword "{keyword}" but found "{value}".',
      unexpectedTokenAfterNot: 'Unexpected token "{value}" after NOT.',
      sqlInListsSupportOnlyStringAndNumberValues:
        'SQL IN lists currently support only string and number values.',
      sqlBetweenSupportsOnlyStringAndNumberValues:
        'SQL BETWEEN currently supports only string and number values.',
      sqlArraysMustContainSameScalarType:
        'SQL arrays must contain values of the same scalar type.',
      expectedScalarValue: 'Expected a scalar value but found "{value}".',
      expectedFieldIdentifier: 'Expected a field identifier but found "{value}".',
      unsupportedSqlOperator: 'Unsupported SQL operator "{operator}".',
      unknownSqlParseError: 'Unknown SQL parse error.',
    },
  },
  history: {
    undo: 'Undo',
    redo: 'Redo',
  },
  group: {
    not: 'Not',
    or: 'Or',
    and: 'And',
    addRule: 'Add Rule',
    addGroup: 'Add Group',
    addGroupWithModifiers: 'With Modifiers',
    addGroupWithoutModifiers: 'Without Modifiers',
    delete: 'Delete',
    clone: 'Clone group',
    lock: 'Lock group',
    lockDescendants: 'Lock group and descendants',
    unlockDescendants: 'Unlock group and descendants',
  },
  rule: {
    delete: 'Delete',
    clone: 'Clone rule',
    lock: 'Lock rule',
    unlock: 'Unlock rule',
  },
  form: {
    selectYourValue: 'Select your value',
  },
  operators: {
    LARGER: 'Larger',
    SMALLER: 'Smaller',
    LARGER_EQUAL: 'Larger or equal',
    SMALLER_EQUAL: 'Smaller or equal',
    EQUAL: 'Equal',
    NOT_EQUAL: 'Not equal',
    ALL_IN: 'All in',
    ANY_IN: 'Any in',
    IN: 'In',
    NOT_IN: 'Not in',
    BETWEEN: 'Between',
    NOT_BETWEEN: 'Not between',
    IS_NULL: 'Is null',
    IS_NOT_NULL: 'Is not null',
    LIKE: 'Like',
    NOT_LIKE: 'Not like',
    CONTAINS: 'Contains',
    NOT_CONTAINS: 'Does not contain',
    STARTS_WITH: 'Starts with',
    ENDS_WITH: 'Ends with',
  },
  validation: {
    operatorNotAllowed: 'Operator "{operator}" is not allowed for field "{field}"',
    valueNotAllowed: 'This operator must not have a value',
    required: 'This value is required',
    minLength: 'Value must be at least {min} characters long',
    maxLength: 'Value must be at most {max} characters long',
    matches: 'Value has invalid format',
    min: 'Value must be greater than or equal to {min}',
    max: 'Value must be less than or equal to {max}',
    integer: 'Value must be an integer',
    positive: 'Value must be positive',
    negative: 'Value must be negative',
    minDate: 'Date is earlier than allowed',
    maxDate: 'Date is later than allowed',
    boolean: 'Value must be boolean',
    oneOf: 'Value must be one of the allowed options',
    minItems: 'Select at least {min} values',
    maxItems: 'Select at most {max} values',
    custom: 'Value is invalid',
    rangeOrder: 'Range start must be less than range end',
    rangeOrderAllowEqual: 'Range start must be less than or equal to range end',
    rangeCustom: 'Range is invalid',
    fieldNotFound: 'Field "{field}" is not defined',
    invalidTree: 'Input data tree is in invalid format',
  },
};

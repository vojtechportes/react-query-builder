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
    compareToValue?: string;
    compareToField?: string;
    selectField?: string;
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
    negationNotAllowed?: string;
    usageLimitExceeded?: string;
    invalidTree?: string;
    valueFieldRequired?: string;
    valueFieldNotFound?: string;
    fieldComparisonNotAllowed?: string;
    fieldComparisonDisabled?: string;
    fieldComparisonOperatorNotAllowed?: string;
    fieldComparisonIncompatible?: string;
  };
}

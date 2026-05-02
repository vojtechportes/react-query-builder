export interface IStrings {
  group?: {
    not?: string;
    or?: string;
    and?: string;
    addRule?: string;
    addGroup?: string;
    addGroupWithModifiers?: string;
    addGroupWithoutModifiers?: string;
    delete?: string;
  };
  rule?: {
    delete?: string;
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
}

export const strings: IStrings = {
  group: {
    not: 'Not',
    or: 'Or',
    and: 'And',
    addRule: 'Add Rule',
    addGroup: 'Add Group',
    addGroupWithModifiers: 'With Modifiers',
    addGroupWithoutModifiers: 'Without Modifiers',
    delete: 'Delete',
  },
  rule: {
    delete: 'Delete',
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
};

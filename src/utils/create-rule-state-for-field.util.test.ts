import { IBuilderFieldProps } from '../builder';
import { createRuleStateForField } from './create-rule-state-for-field.util';

describe('#utils/createRuleStateForField', () => {
  it('Creates a boolean rule state', () => {
    const field: IBuilderFieldProps = {
      field: 'IS_ACTIVE',
      label: 'Is active',
      type: 'BOOLEAN',
    };

    expect(createRuleStateForField(field)).toEqual({
      field: 'IS_ACTIVE',
      value: false,
    });
  });

  it('Creates a between text rule state', () => {
    const field: IBuilderFieldProps = {
      field: 'NAME',
      label: 'Name',
      type: 'TEXT',
      operators: ['BETWEEN'],
    };

    expect(createRuleStateForField(field)).toEqual({
      field: 'NAME',
      operator: 'BETWEEN',
      operators: ['BETWEEN'],
      value: ['', ''],
    });
  });

  it('Creates a list rule state from the first option', () => {
    const field: IBuilderFieldProps = {
      field: 'STATUS',
      label: 'Status',
      type: 'LIST',
      operators: ['EQUAL'],
      value: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
      ],
    };

    expect(createRuleStateForField(field)).toEqual({
      field: 'STATUS',
      operator: 'EQUAL',
      operators: ['EQUAL'],
      value: 'draft',
    });
  });

  it('Creates a numeric rule state with numeric defaults', () => {
    const field: IBuilderFieldProps = {
      field: 'PRICE',
      label: 'Price',
      type: 'NUMBER',
      operators: ['EQUAL'],
    };

    expect(createRuleStateForField(field)).toEqual({
      field: 'PRICE',
      operator: 'EQUAL',
      operators: ['EQUAL'],
      value: 0,
    });
  });

  it('Creates a between numeric rule state with numeric defaults', () => {
    const field: IBuilderFieldProps = {
      field: 'PRICE_RANGE',
      label: 'Price Range',
      type: 'NUMBER',
      operators: ['BETWEEN'],
    };

    expect(createRuleStateForField(field)).toEqual({
      field: 'PRICE_RANGE',
      operator: 'BETWEEN',
      operators: ['BETWEEN'],
      value: [0, 0],
    });
  });

  it('Creates a valueless rule state for IS_NULL', () => {
    const field: IBuilderFieldProps = {
      field: 'DELETED_AT',
      label: 'Deleted At',
      type: 'DATE',
      operators: ['IS_NULL'],
    };

    expect(createRuleStateForField(field)).toEqual({
      field: 'DELETED_AT',
      operator: 'IS_NULL',
      operators: ['IS_NULL'],
    });
  });

  it('Creates a statement rule state', () => {
    const field: IBuilderFieldProps = {
      field: 'NOTE',
      label: 'Note',
      type: 'STATEMENT',
      value: 'Read only text',
    };

    expect(createRuleStateForField(field)).toEqual({
      field: 'NOTE',
      value: 'Read only text',
    });
  });
});

import { BuilderFieldProps } from '../builder';
import { createRuleStateForField } from './create-rule-state-for-field.util';

describe('#utils/createRuleStateForField', () => {
  it('Creates a boolean rule state', () => {
    const field: BuilderFieldProps = {
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
    const field: BuilderFieldProps = {
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
    const field: BuilderFieldProps = {
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

  it('Creates a statement rule state', () => {
    const field: BuilderFieldProps = {
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

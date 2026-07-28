import { IBuilderFieldProps, IBuilderValidationMessageContext } from '../..';
import { getBuilderValidationMessage } from './get-builder-validation-message.util';

const field: IBuilderFieldProps = {
  field: 'NAME',
  label: 'Name',
  type: 'TEXT',
};
const context: IBuilderValidationMessageContext = {
  field,
  value: 'Alice',
};

describe('getBuilderValidationMessage', () => {
  it('resolves fallback, static, and context-based messages', () => {
    expect(getBuilderValidationMessage(undefined, 'Fallback', context)).toBe(
      'Fallback'
    );
    expect(
      getBuilderValidationMessage('Static message', 'Fallback', context)
    ).toBe('Static message');
    expect(
      getBuilderValidationMessage(
        (messageContext) =>
          `${messageContext.field.label}: ${messageContext.value}`,
        'Fallback',
        context
      )
    ).toBe('Name: Alice');
  });
});

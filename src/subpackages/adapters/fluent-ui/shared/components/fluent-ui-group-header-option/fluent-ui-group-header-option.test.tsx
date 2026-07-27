import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { FluentUiGroupHeaderOption } from './fluent-ui-group-header-option';
import styles from './fluent-ui-group-header-option.module.css';

describe('#fluentui/components/FluentUiGroupHeaderOption', () => {
  it.each([
    [false, false],
    [true, false],
    [false, true],
    [true, true],
  ])(
    'maps selected=%s disabled=%s to finite state classes',
    (isSelected, disabled) => {
      const onClick = jest.fn();
      const { getByRole } = render(
        <FluentUiGroupHeaderOption
          value="AND"
          onClick={onClick}
          disabled={disabled}
          isSelected={isSelected}
          className="incoming-option"
        >
          AND
        </FluentUiGroupHeaderOption>
      );
      const option = getByRole('button', { name: 'AND' });

      expect(option).toHaveClass(styles.option, 'incoming-option');
      expect(option.classList.contains(styles.selected)).toBe(isSelected);
      expect(option.classList.contains(styles.disabled)).toBe(disabled);
      expect(option).toHaveProperty('disabled', disabled);

      fireEvent.click(option);

      expect(onClick).toHaveBeenCalledTimes(disabled ? 0 : 1);
      if (!disabled) {
        expect(onClick).toHaveBeenCalledWith('AND');
      }
    }
  );
});

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import optionStyles from '../../widgets/select-multi/components/option/option.module.css';
import triggerStyles from '../../widgets/select-multi/components/trigger/trigger.module.css';
import { Select } from './select';
import styles from './select.module.css';

const mockValues = [{ value: 'test', label: 'test' }];

const getByDataTest = (container: HTMLElement, value: string): HTMLElement => {
  const element = container.querySelector(`[data-test="${value}"]`);

  if (!element) {
    throw new Error(`Unable to find element with data-test="${value}"`);
  }

  return element as HTMLElement;
};

describe('#components/Select', () => {
  it('renders the select trigger', () => {
    const { container } = render(
      <Select
        disabled={false}
        onChange={jest.fn()}
        selectedValue="Test"
        values={mockValues}
      />
    );
    const trigger = getByDataTest(container, 'SelectMultiTrigger');

    expect(trigger).toBeTruthy();
    expect(trigger.classList.contains(triggerStyles.trigger)).toBe(true);
    expect(
      container.firstElementChild?.classList.contains(styles.container)
    ).toBe(true);
  });

  it('emits a selected value and closes the list', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select
        disabled={false}
        onChange={onChange}
        selectedValue="Test"
        values={mockValues}
      />
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[test]'));

    expect(onChange).toHaveBeenCalledWith('test');
    expect(
      container.querySelector('[data-test="SelectMultiPopover"]')
    ).toBeNull();
  });

  it('maps selected option state', () => {
    const { container } = render(
      <Select
        disabled={false}
        onChange={jest.fn()}
        selectedValue="test"
        values={mockValues}
      />
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));

    expect(
      getByDataTest(container, 'SelectMultiOption[test]').classList.contains(
        optionStyles.selected
      )
    ).toBe(true);
  });

  it('does not emit a disabled option', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select
        disabled={false}
        onChange={onChange}
        selectedValue="Test"
        values={[{ value: 'test', label: 'test', disabled: true }]}
      />
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    const option = getByDataTest(container, 'SelectMultiOption[test]');

    expect((option as HTMLButtonElement).disabled).toBe(true);
    expect(option.classList.contains(optionStyles.disabled)).toBe(true);
    fireEvent.click(option);

    expect(onChange).not.toHaveBeenCalled();
  });
});

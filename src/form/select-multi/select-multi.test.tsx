import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import inputStyles from '../../styles/input.module.css';
import optionStyles from '../../widgets/select-multi/components/option/option.module.css';
import triggerStyles from '../../widgets/select-multi/components/trigger/trigger.module.css';
import { SelectMulti } from './select-multi';
import styles from './select-multi.module.css';

const mockValues = [
  { value: 'test', label: 'test' },
  { value: 'another', label: 'another' },
];

const getByDataTest = (container: HTMLElement, value: string): HTMLElement => {
  const element = container.querySelector(`[data-test="${value}"]`);

  if (!element) {
    throw new Error(`Unable to find element with data-test="${value}"`);
  }

  return element as HTMLElement;
};

describe('#components/SelectMulti', () => {
  it('renders the selected values trigger', () => {
    const { container } = render(
      <SelectMulti
        disabled={false}
        onChange={jest.fn()}
        onDelete={jest.fn()}
        selectedValue={['test']}
        values={mockValues}
      />
    );

    expect(getByDataTest(container, 'SelectMultiTrigger')).toBeTruthy();
    expect(
      container.firstElementChild?.classList.contains(styles.container)
    ).toBe(true);
  });

  it('applies shared input and trigger module classes to the trigger', () => {
    const { container } = render(
      <SelectMulti
        disabled={false}
        onChange={jest.fn()}
        onDelete={jest.fn()}
        selectedValue={['test']}
        values={mockValues}
      />
    );
    const trigger = getByDataTest(container, 'SelectMultiTrigger');

    expect(trigger.classList.contains(inputStyles.control)).toBe(true);
    expect(trigger.classList.contains(inputStyles.typography)).toBe(true);
    expect(trigger.classList.contains(triggerStyles.trigger)).toBe(true);
    expect(
      trigger.style.getPropertyValue('--query-builder-color-grey-500')
    ).toBe('');
  });

  it('maps expanded trigger, popover, selected option, and callback state', () => {
    const onChange = jest.fn();
    const onDelete = jest.fn();
    const { container } = render(
      <SelectMulti
        disabled={false}
        onChange={onChange}
        onDelete={onDelete}
        selectedValue={['test']}
        values={mockValues}
      />
    );
    const trigger = getByDataTest(container, 'SelectMultiTrigger');

    fireEvent.click(trigger);
    const selectedOption = getByDataTest(container, 'SelectMultiOption[test]');
    const availableOption = getByDataTest(
      container,
      'SelectMultiOption[another]'
    );

    fireEvent.click(selectedOption);
    fireEvent.click(availableOption);

    expect(trigger.classList.contains(triggerStyles.expanded)).toBe(true);
    expect(getByDataTest(container, 'SelectMultiPopover')).toBeTruthy();
    expect(selectedOption.classList.contains(optionStyles.selected)).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('preserves Escape and outside-click close behavior', () => {
    const { container } = render(
      <SelectMulti
        disabled={false}
        onChange={jest.fn()}
        onDelete={jest.fn()}
        selectedValue={[]}
        values={mockValues}
      />
    );
    const trigger = getByDataTest(container, 'SelectMultiTrigger');

    fireEvent.click(trigger);

    expect(getByDataTest(container, 'SelectMultiPopover')).toBeTruthy();
    expect(trigger.classList.contains(triggerStyles.expanded)).toBe(true);

    fireEvent.keyDown(trigger, { key: 'Escape', code: 'Escape' });

    expect(
      container.querySelector('[data-test="SelectMultiPopover"]')
    ).toBeNull();

    fireEvent.click(trigger);

    expect(getByDataTest(container, 'SelectMultiPopover')).toBeTruthy();

    fireEvent.mouseDown(document.body);

    expect(
      container.querySelector('[data-test="SelectMultiPopover"]')
    ).toBeNull();
  });

  it('does not open the list when disabled', () => {
    const { container } = render(
      <SelectMulti
        disabled={true}
        onChange={jest.fn()}
        onDelete={jest.fn()}
        selectedValue={['test']}
        values={mockValues}
      />
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));

    expect(
      container.querySelector('[data-test="SelectMultiPopover"]')
    ).toBeNull();
  });

  it('shows a summary badge for hidden values', () => {
    const { container } = render(
      <SelectMulti
        disabled={false}
        onChange={jest.fn()}
        onDelete={jest.fn()}
        selectedValue={['test', 'another', 'third', 'fourth']}
        values={[
          { value: 'test', label: 'Retail' },
          { value: 'another', label: 'Priority' },
          { value: 'third', label: 'Enterprise' },
          { value: 'fourth', label: 'Wholesale' },
        ]}
      />
    );

    expect(
      getByDataTest(container, 'SelectMultiSummaryBadge').textContent
    ).toEqual('+1');
  });
});

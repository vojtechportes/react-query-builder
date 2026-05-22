import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Select } from './select';

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

    expect(getByDataTest(container, 'SelectMultiTrigger')).toBeTruthy();
  });

  it('emits a selected value', () => {
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

    expect(onChange).toHaveBeenCalled();
  });
});

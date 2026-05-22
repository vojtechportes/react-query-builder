import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { SelectMulti } from './select-multi';

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
  });

  it('emits add and delete actions from the options list', () => {
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

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[test]'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[another]'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
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

    expect(getByDataTest(container, 'SelectMultiSummaryBadge').textContent).toEqual(
      '+1'
    );
  });
});

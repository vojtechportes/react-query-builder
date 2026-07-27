import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import optionStyles from '../../rule-controls/select-multi/components/option/option.module.css';
import triggerStyles from '../../rule-controls/select-multi/components/trigger/trigger.module.css';
import * as selectMultiHook from '../../rule-controls/select-multi/hooks/use-select-multi';
import { Select } from './select';
import styles from './select.module.css';

const mockValues = [
  { value: 'test', label: 'Test' },
  { value: 'disabled', label: 'Disabled', disabled: true },
];

const getByDataTest = (container: HTMLElement, value: string): HTMLElement => {
  const element = container.querySelector(`[data-test="${value}"]`);

  if (!element) {
    throw new Error(`Unable to find element with data-test="${value}"`);
  }

  return element as HTMLElement;
};

describe('#components/Select', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('assigns hook refs and composes the root class', () => {
    const rootRef = { current: null as HTMLDivElement | null };
    const triggerRef = { current: null as HTMLButtonElement | null };

    jest.spyOn(selectMultiHook, 'useSelectMulti').mockReturnValueOnce({
      close: jest.fn(),
      isOpen: false,
      rootRef,
      toggle: jest.fn(),
      triggerRef,
    });

    const { container } = render(
      <Select
        className="consumer-select"
        onChange={jest.fn()}
        selectedValue="test"
        values={mockValues}
      />
    );
    const root = container.firstElementChild as HTMLDivElement;
    const trigger = getByDataTest(container, 'SelectMultiTrigger');

    expect(root).toBe(rootRef.current);
    expect(trigger).toBe(triggerRef.current);
    expect(root.classList.contains(styles.container)).toBe(true);
    expect(root.classList.contains('consumer-select')).toBe(true);
    expect(trigger.classList.contains(triggerStyles.trigger)).toBe(true);
  });

  it('preserves hidden input form attributes and controlled values', () => {
    const { container, rerender } = render(
      <form>
        <Select
          id="status"
          name="status"
          onChange={jest.fn()}
          selectedValue="test"
          values={mockValues}
        />
      </form>
    );
    const input = container.querySelector(
      'input[type="hidden"]'
    ) as HTMLInputElement;

    expect(input.id).toBe('status');
    expect(input.name).toBe('status');
    expect(input.value).toBe('test');
    expect(input.readOnly).toBe(true);
    expect(input.classList.contains(styles.hiddenInput)).toBe(true);
    expect(new FormData(container.querySelector('form')!).get('status')).toBe(
      'test'
    );
    expect(getByDataTest(container, 'SelectMultiTrigger').id).toBe(
      'status-trigger'
    );
    expect(
      getByDataTest(container, 'SelectMultiTrigger').textContent
    ).toContain('Test');

    rerender(
      <form>
        <Select
          emptyValue="Choose status"
          id="status"
          name="status"
          onChange={jest.fn()}
          selectedValue=""
          values={mockValues}
        />
      </form>
    );

    expect(input.value).toBe('');
    expect(new FormData(container.querySelector('form')!).get('status')).toBe(
      ''
    );
    expect(
      getByDataTest(container, 'SelectMultiTrigger').textContent
    ).toContain('Choose status');
  });

  it('emits a selected value and closes the list', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select onChange={onChange} selectedValue="" values={mockValues} />
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[test]'));

    expect(onChange).toHaveBeenCalledWith('test');
    expect(
      container.querySelector('[data-test="SelectMultiPopover"]')
    ).toBeNull();
  });

  it('maps selected and disabled option state', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select onChange={onChange} selectedValue="test" values={mockValues} />
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiTrigger'));
    const selectedOption = getByDataTest(container, 'SelectMultiOption[test]');
    const disabledOption = getByDataTest(
      container,
      'SelectMultiOption[disabled]'
    ) as HTMLButtonElement;

    expect(selectedOption.classList.contains(optionStyles.selected)).toBe(true);
    expect(disabledOption.disabled).toBe(true);
    expect(disabledOption.classList.contains(optionStyles.disabled)).toBe(true);

    fireEvent.click(disabledOption);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('preserves disabled and close interactions', () => {
    const { container, rerender } = render(
      <Select disabled onChange={jest.fn()} values={mockValues} />
    );
    const disabledTrigger = getByDataTest(
      container,
      'SelectMultiTrigger'
    ) as HTMLButtonElement;

    expect(disabledTrigger.disabled).toBe(true);
    fireEvent.click(disabledTrigger);
    expect(
      container.querySelector('[data-test="SelectMultiPopover"]')
    ).toBeNull();

    rerender(<Select onChange={jest.fn()} values={mockValues} />);
    const trigger = getByDataTest(container, 'SelectMultiTrigger');

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(
      container.querySelector('[data-test="SelectMultiPopover"]')
    ).toBeNull();
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);
    fireEvent.mouseDown(document.body);

    expect(
      container.querySelector('[data-test="SelectMultiPopover"]')
    ).toBeNull();
  });

  it('renders on the server with the root and hidden input classes', () => {
    const markup = renderToString(
      <Select
        className="server-select"
        id="server-status"
        name="status"
        onChange={jest.fn()}
        selectedValue="test"
        values={mockValues}
      />
    );

    expect(markup).toContain(styles.container);
    expect(markup).toContain(styles.hiddenInput);
    expect(markup).toContain('server-select');
    expect(markup).toContain('value="test"');
  });
});

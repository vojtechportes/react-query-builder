import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import inputStyles from '../../styles/input.module.css';
import optionStyles from '../../widgets/select-multi/components/option/option.module.css';
import triggerStyles from '../../widgets/select-multi/components/trigger/trigger.module.css';
import * as selectMultiHook from '../../widgets/select-multi/hooks/use-select-multi';
import { SelectMulti } from './select-multi';
import styles from './select-multi.module.css';

const mockValues = [
  { value: 'test', label: 'Test' },
  { value: 'another', label: 'Another' },
];

const getByDataTest = (container: HTMLElement, value: string): HTMLElement => {
  const element = container.querySelector(`[data-test="${value}"]`);

  if (!element) {
    throw new Error(`Unable to find element with data-test="${value}"`);
  }

  return element as HTMLElement;
};

describe('#components/SelectMulti', () => {
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
      <SelectMulti
        className="consumer-select-multi"
        onChange={jest.fn()}
        onDelete={jest.fn()}
        selectedValue={['test']}
        values={mockValues}
      />
    );
    const root = container.firstElementChild as HTMLDivElement;
    const trigger = getByDataTest(container, 'SelectMultiTrigger');

    expect(root).toBe(rootRef.current);
    expect(trigger).toBe(triggerRef.current);
    expect(root.classList.contains(styles.container)).toBe(true);
    expect(root.classList.contains('consumer-select-multi')).toBe(true);
  });

  it('preserves hidden input form attributes and controlled values', () => {
    const { container, rerender } = render(
      <form>
        <SelectMulti
          id="segments"
          name="segments"
          onChange={jest.fn()}
          onDelete={jest.fn()}
          selectedValue={['test', 'another']}
          values={mockValues}
        />
      </form>
    );
    const input = container.querySelector(
      'input[type="hidden"]'
    ) as HTMLInputElement;
    const trigger = getByDataTest(container, 'SelectMultiTrigger');

    expect(input.id).toBe('segments');
    expect(input.name).toBe('segments');
    expect(input.value).toBe('test,another');
    expect(input.readOnly).toBe(true);
    expect(input.classList.contains(styles.hiddenInput)).toBe(true);
    expect(new FormData(container.querySelector('form')!).get('segments')).toBe(
      'test,another'
    );
    expect(trigger.id).toBe('segments-trigger');
    expect(trigger.classList.contains(inputStyles.control)).toBe(true);
    expect(trigger.classList.contains(inputStyles.typography)).toBe(true);
    expect(trigger.classList.contains(triggerStyles.trigger)).toBe(true);

    rerender(
      <form>
        <SelectMulti
          emptyValue="Choose segments"
          id="segments"
          name="segments"
          onChange={jest.fn()}
          onDelete={jest.fn()}
          selectedValue={[]}
          values={mockValues}
        />
      </form>
    );

    expect(input.value).toBe('');
    expect(new FormData(container.querySelector('form')!).get('segments')).toBe(
      ''
    );
    expect(
      getByDataTest(container, 'SelectMultiTrigger').textContent
    ).toContain('Choose segments');
  });

  it('maps selection state and emits deletion before addition', () => {
    const callbacks: string[] = [];
    const onChange = jest.fn((value: string) => callbacks.push(`add:${value}`));
    const onDelete = jest.fn((value: string) =>
      callbacks.push(`delete:${value}`)
    );
    const { container } = render(
      <SelectMulti
        onChange={onChange}
        onDelete={onDelete}
        selectedValue={['test']}
        values={mockValues}
      />
    );
    const trigger = getByDataTest(container, 'SelectMultiTrigger');

    fireEvent.click(trigger);
    const selectedOption = getByDataTest(container, 'SelectMultiOption[test]');

    expect(selectedOption.classList.contains(optionStyles.selected)).toBe(true);

    fireEvent.click(selectedOption);
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[another]'));

    expect(callbacks).toEqual(['delete:test', 'add:another']);
    expect(getByDataTest(container, 'SelectMultiPopover')).toBeTruthy();
  });

  it('preserves Escape and outside-click close behavior', () => {
    const { container } = render(
      <SelectMulti
        onChange={jest.fn()}
        onDelete={jest.fn()}
        selectedValue={[]}
        values={mockValues}
      />
    );
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

  it('does not open or emit callbacks when disabled', () => {
    const onChange = jest.fn();
    const onDelete = jest.fn();
    const { container } = render(
      <SelectMulti
        disabled
        onChange={onChange}
        onDelete={onDelete}
        selectedValue={['test']}
        values={mockValues}
      />
    );
    const trigger = getByDataTest(
      container,
      'SelectMultiTrigger'
    ) as HTMLButtonElement;

    expect(trigger.disabled).toBe(true);
    fireEvent.click(trigger);

    expect(
      container.querySelector('[data-test="SelectMultiPopover"]')
    ).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('shows summary content and preserves the full title', () => {
    const { container } = render(
      <SelectMulti
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
    const trigger = getByDataTest(container, 'SelectMultiTrigger');

    expect(
      getByDataTest(container, 'SelectMultiSummaryBadge').textContent
    ).toBe('+1');
    expect(trigger.textContent).toContain('Retail, Priority, Enterprise');
    expect(trigger.title).toBe('Retail, Priority, Enterprise, Wholesale');
  });

  it('renders on the server with the root and hidden input classes', () => {
    const markup = renderToString(
      <SelectMulti
        className="server-select-multi"
        id="server-segments"
        name="segments"
        onChange={jest.fn()}
        onDelete={jest.fn()}
        selectedValue={['test', 'another']}
        values={mockValues}
      />
    );

    expect(markup).toContain(styles.container);
    expect(markup).toContain(styles.hiddenInput);
    expect(markup).toContain('server-select-multi');
    expect(markup).toContain('value="test,another"');
  });
});

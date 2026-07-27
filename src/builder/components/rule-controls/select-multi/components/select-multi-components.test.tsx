import React, { createRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Popover } from '../../../form-controls/popover';
import popoverStyles from '../../../form-controls/popover/popover.module.css';
import { Option } from './option';
import optionStyles from './option/option.module.css';
import { Tag } from './tag';
import tagStyles from './tag/tag.module.css';
import { Trigger } from './trigger';
import triggerStyles from './trigger/trigger.module.css';

const getByDataTest = (container: HTMLElement, value: string): HTMLElement => {
  const element = container.querySelector(`[data-test="${value}"]`);

  if (!element) {
    throw new Error(`Unable to find element with data-test="${value}"`);
  }

  return element as HTMLElement;
};

describe('#components/Widgets/SelectMulti/components', () => {
  it('maps trigger state, shared ref, labels, and summary classes', () => {
    const onClick = jest.fn();
    const triggerRef = createRef<HTMLButtonElement>();
    const { container } = render(
      <Trigger
        badgeContent="+2"
        disabled={false}
        expanded={true}
        id="mock-trigger"
        label="Retail, Priority"
        onClick={onClick}
        title="Retail, Priority, Enterprise"
        triggerRef={triggerRef}
      />
    );
    const trigger = getByDataTest(container, 'SelectMultiTrigger');

    fireEvent.click(trigger);

    expect(triggerRef.current).toBe(trigger);
    expect(trigger.getAttribute('id')).toBe('mock-trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('title')).toBe('Retail, Priority, Enterprise');
    expect(trigger.classList.contains(triggerStyles.trigger)).toBe(true);
    expect(trigger.classList.contains(triggerStyles.expanded)).toBe(true);
    expect(
      container.querySelector(`.${triggerStyles.label}`)?.textContent
    ).toBe('Retail, Priority');
    expect(
      getByDataTest(container, 'SelectMultiSummaryBadge').classList.contains(
        triggerStyles.summaryBadge
      )
    ).toBe(true);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('maps option selected and disabled states without leaking transient props', () => {
    const onClick = jest.fn();
    const { container } = render(
      <Option
        disabled={true}
        label="Retail"
        selected={true}
        value="retail"
        onClick={onClick}
      />
    );
    const option = getByDataTest(container, 'SelectMultiOption[retail]');

    fireEvent.click(option);

    expect(option.getAttribute('role')).toBe('option');
    expect(option.getAttribute('aria-selected')).toBe('true');
    expect(option.hasAttribute('disabled')).toBe(true);
    expect(option.classList.contains(optionStyles.option)).toBe(true);
    expect(option.classList.contains(optionStyles.disabled)).toBe(true);
    expect(option.classList.contains(optionStyles.selected)).toBe(true);
    expect(option.hasAttribute('$disabled')).toBe(false);
    expect(option.hasAttribute('$selected')).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('emits option callbacks for enabled options and renders the selected indicator', () => {
    const onClick = jest.fn();
    const { container } = render(
      <Option label="Retail" selected={true} value="retail" onClick={onClick} />
    );

    fireEvent.click(getByDataTest(container, 'SelectMultiOption[retail]'));

    expect(onClick).toHaveBeenCalledWith('retail');
    expect(
      container
        .querySelector(`.${optionStyles.indicator}`)
        ?.classList.contains(optionStyles.selectedIndicator)
    ).toBe(true);
  });

  it('keeps long option labels unwrapped and composes mixed selected disabled classes', () => {
    const { container } = render(
      <Option
        disabled={true}
        label="A very long customer segment label that should stay on one line"
        selected={true}
        value="long-label"
        onClick={jest.fn()}
      />
    );
    const option = getByDataTest(container, 'SelectMultiOption[long-label]');

    expect(option.classList.contains(optionStyles.disabled)).toBe(true);
    expect(option.classList.contains(optionStyles.selected)).toBe(true);
    expect(container.querySelector(`.${optionStyles.label}`)?.textContent).toBe(
      'A very long customer segment label that should stay on one line'
    );
    expect(
      container
        .querySelector(`.${optionStyles.label}`)
        ?.classList.contains(optionStyles.label)
    ).toBe(true);
  });

  it('maps all-disabled option lists without enabling callbacks', () => {
    const onClick = jest.fn();
    const { container } = render(
      <>
        <Option
          disabled={true}
          label="Retail"
          selected={false}
          value="retail"
          onClick={onClick}
        />
        <Option
          disabled={true}
          label="Priority"
          selected={true}
          value="priority"
          onClick={onClick}
        />
      </>
    );
    const options = container.querySelectorAll('[role="option"]');

    fireEvent.click(getByDataTest(container, 'SelectMultiOption[retail]'));
    fireEvent.click(getByDataTest(container, 'SelectMultiOption[priority]'));

    expect(options).toHaveLength(2);
    expect(
      Array.from(options).every((option) =>
        option.classList.contains(optionStyles.disabled)
      )
    ).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });
  it('maps removable tag state and emits remove callbacks after the label is rendered', () => {
    const onRemove = jest.fn();
    const { container } = render(
      <Tag
        disabled={false}
        label="Enterprise"
        value="enterprise"
        onRemove={onRemove}
      />
    );
    const tag = getByDataTest(container, 'SelectMultiTag');

    fireEvent.click(getByDataTest(container, 'Delete'));

    expect(tag.classList.contains(tagStyles.tag)).toBe(true);
    expect(tag.classList.contains(tagStyles.removable)).toBe(true);
    expect(container.querySelector(`.${tagStyles.label}`)?.textContent).toBe(
      'Enterprise'
    );
    expect(onRemove).toHaveBeenCalledWith('enterprise');
  });

  it('omits the remove action when a tag is disabled', () => {
    const { container } = render(
      <Tag
        disabled={true}
        label="Enterprise"
        value="enterprise"
        onRemove={jest.fn()}
      />
    );
    const tag = getByDataTest(container, 'SelectMultiTag');

    expect(tag.classList.contains(tagStyles.removable)).toBe(false);
    expect(container.querySelector('[data-test="Delete"]')).toBeNull();
  });

  it('renders the form popover listbox with its module class and SSR markup', () => {
    const { container } = render(
      <Popover>
        <span>Option</span>
      </Popover>
    );
    const popover = getByDataTest(container, 'SelectMultiPopover');

    expect(popover.getAttribute('role')).toBe('listbox');
    expect(popover.classList.contains(popoverStyles.popover)).toBe(true);
    expect(renderToString(<Popover>Option</Popover>)).toContain(
      'SelectMultiPopover'
    );
  });
});

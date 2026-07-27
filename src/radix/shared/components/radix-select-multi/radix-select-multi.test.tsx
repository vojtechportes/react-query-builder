import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Theme } from '@radix-ui/themes';
import React from 'react';
import { BuilderContext } from '../../../../builder-context';
import { strings } from '../../../../shared/localization/locales/en-us';
import { RadixSelectMulti } from './radix-select-multi';
import styles from './radix-select-multi.module.css';

const values = [
  { value: 'one', label: 'A very long first selected label' },
  { value: 'two', label: 'A second selected label' },
  { value: 'three', label: 'A third selected label' },
];

describe('#radix/components/RadixSelectMulti', () => {
  it('renders the hidden value and selected summary with scoped classes', () => {
    const { container } = render(
      <Theme>
        <BuilderContext.Provider
          value={
            { strings } as React.ComponentProps<
              typeof BuilderContext.Provider
            >['value']
          }
        >
          <RadixSelectMulti
            values={values}
            selectedValue={values.map(({ value }) => value)}
            onChange={jest.fn()}
            onDelete={jest.fn()}
            className="incoming-select"
            id="status"
            name="status"
          />
        </BuilderContext.Provider>
      </Theme>
    );
    const hiddenInput = container.querySelector('input[type="hidden"]');
    const trigger = container.querySelector('[data-test="SelectMultiTrigger"]');
    const badge = container.querySelector(
      '[data-test="SelectMultiSummaryBadge"]'
    );

    expect(hiddenInput).toHaveClass(styles.hiddenInput);
    expect(hiddenInput).toHaveValue('one,two,three');
    expect(trigger).toHaveClass('incoming-select');
    expect(trigger).toHaveAttribute(
      'title',
      values.map((v) => v.label).join(', ')
    );
    expect(badge).toHaveClass(styles.badge);
    expect(badge).toHaveTextContent('+2');
  });
});

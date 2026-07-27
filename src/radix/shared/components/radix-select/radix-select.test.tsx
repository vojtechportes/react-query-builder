import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Theme } from '@radix-ui/themes';
import React from 'react';
import { BuilderContext } from '../../../../builder/context';
import { strings } from '../../../../shared/localization/locales/en-us';
import { RadixSelect } from './radix-select';
import styles from './radix-select.module.css';
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;

describe('#radix/components/RadixSelect', () => {
  it('preserves the hidden value, translated placeholder, and incoming class', () => {
    const { container } = render(
      <Theme>
        <BuilderContext.Provider
          value={
            { strings } as React.ComponentProps<
              typeof BuilderContext.Provider
            >['value']
          }
        >
          <RadixSelect
            values={[{ value: 'active', label: 'Active' }]}
            selectedValue=""
            emptyValue="Choose status"
            onChange={jest.fn()}
            className="incoming-select"
            id="status"
            name="status"
          />
        </BuilderContext.Provider>
      </Theme>
    );
    const hiddenInput = container.querySelector('input[type="hidden"]');
    const trigger = screen.getByRole('combobox');

    expect(hiddenInput).toHaveClass(styles.hiddenInput);
    expect(hiddenInput).toHaveAttribute('id', 'status');
    expect(hiddenInput).toHaveValue('');
    expect(trigger).toHaveClass('incoming-select');
    expect(trigger).toHaveTextContent('Choose status');
  });
});

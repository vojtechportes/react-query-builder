import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { BuilderContext } from '../../../../builder/context';
import { strings } from '../../../../shared/localization/locales/en-us';
import { FluentUiSelectMulti } from './fluent-ui-select-multi';
import styles from './fluent-ui-select-multi.module.css';

const values = [
  { value: 'one', label: 'A very long first selected label' },
  { value: 'two', label: 'A second selected label' },
  { value: 'three', label: 'A third selected label' },
];

describe('#fluentui/components/FluentUiSelectMulti', () => {
  it('renders the selected summary badge and preserves incoming classes', () => {
    const { container } = render(
      <BuilderContext.Provider
        value={
          { strings } as React.ComponentProps<
            typeof BuilderContext.Provider
          >['value']
        }
      >
        <FluentUiSelectMulti
          values={values}
          selectedValue={values.map(({ value }) => value)}
          onChange={jest.fn()}
          onDelete={jest.fn()}
          className="incoming-select"
        />
      </BuilderContext.Provider>
    );
    const root = container.firstElementChild as HTMLElement;
    const badge = container.querySelector(
      '[data-test="SelectMultiSummaryBadge"]'
    );

    expect(root).toHaveClass('incoming-select');
    expect(badge).toHaveClass(styles.badge);
    expect(badge).toHaveTextContent('+2');
  });
});

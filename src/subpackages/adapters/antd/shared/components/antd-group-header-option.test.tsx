import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { AntdGroupHeaderOption } from './antd-group-header-option';

describe('#adapters/antd/shared/components/antd-group-header-option', () => {
  it('renders its adapter behavior', () => {
    const onClick = jest.fn();

    render(
      <AntdGroupHeaderOption
        value="AND"
        onClick={onClick}
        disabled={false}
        isSelected
      >
        AND
      </AntdGroupHeaderOption>
    );
    fireEvent.click(screen.getByRole('button', { name: 'AND' }));

    expect(onClick).toHaveBeenCalledWith('AND');
  });
});

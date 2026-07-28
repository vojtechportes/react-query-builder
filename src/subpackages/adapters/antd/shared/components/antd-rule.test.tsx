import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { AntdRule } from './antd-rule';

describe('#adapters/antd/shared/components/antd-rule', () => {
  it('renders its adapter behavior', () => {
    render(
      <AntdRule controls={<button type="button">Delete</button>}>
        Rule content
      </AntdRule>
    );

    expect(screen.getByText('Rule content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });
});

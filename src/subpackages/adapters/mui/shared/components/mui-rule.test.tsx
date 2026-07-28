import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MuiRule } from './mui-rule';

describe('#adapters/mui/shared/components/mui-rule', () => {
  it('renders its adapter behavior', () => {
    render(
      <MuiRule controls={<button type="button">Delete</button>}>
        Rule content
      </MuiRule>
    );

    expect(screen.getByText('Rule content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });
});

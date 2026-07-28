import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BootstrapRule } from './bootstrap-rule';

describe('#adapters/bootstrap/shared/components/bootstrap-rule', () => {
  it('renders its adapter behavior', () => {
    render(
      <BootstrapRule controls={<button type="button">Delete</button>}>
        Rule content
      </BootstrapRule>
    );

    expect(screen.getByText('Rule content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });
});

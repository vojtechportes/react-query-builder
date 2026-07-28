import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BootstrapText } from './bootstrap-text';

describe('#adapters/bootstrap/shared/components/bootstrap-text', () => {
  it('renders its adapter behavior', () => {
    render(<BootstrapText>Adapter text</BootstrapText>);

    expect(screen.getByText('Adapter text')).toBeInTheDocument();
  });
});

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BootstrapTextModeToggleContent } from './bootstrap-text-mode-toggle-content';

describe('#adapters/bootstrap/shared/components/bootstrap-text-mode-toggle-content', () => {
  it('renders its adapter behavior', () => {
    render(<BootstrapTextModeToggleContent mode="builder" label="Text mode" />);

    expect(screen.getByText('Text mode')).toBeInTheDocument();
  });
});

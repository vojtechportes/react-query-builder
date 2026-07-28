import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MuiText } from './mui-text';

describe('#adapters/mui/shared/components/mui-text', () => {
  it('renders its adapter behavior', () => {
    render(<MuiText>Adapter text</MuiText>);

    expect(screen.getByText('Adapter text')).toBeInTheDocument();
  });
});

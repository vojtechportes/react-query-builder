import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { AntdText } from './antd-text';

describe('#adapters/antd/shared/components/antd-text', () => {
  it('renders its adapter behavior', () => {
    render(<AntdText>Adapter text</AntdText>);

    expect(screen.getByText('Adapter text')).toBeInTheDocument();
  });
});

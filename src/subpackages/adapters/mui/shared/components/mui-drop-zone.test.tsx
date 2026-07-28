import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { MuiDropZone } from './mui-drop-zone';

describe('#adapters/mui/shared/components/mui-drop-zone', () => {
  it('renders its adapter behavior', () => {
    render(<MuiDropZone id="drop-zone" index={0} isActive isDragging />);

    expect(
      document.querySelector('[data-test="ActiveDropZone"]')
    ).not.toBeNull();
  });
});

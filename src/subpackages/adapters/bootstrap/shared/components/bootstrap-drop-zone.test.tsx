import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BootstrapDropZone } from './bootstrap-drop-zone';

describe('#adapters/bootstrap/shared/components/bootstrap-drop-zone', () => {
  it('renders its adapter behavior', () => {
    render(<BootstrapDropZone id="drop-zone" index={0} isActive isDragging />);

    expect(
      document.querySelector('[data-test="ActiveDropZone"]')
    ).not.toBeNull();
  });
});

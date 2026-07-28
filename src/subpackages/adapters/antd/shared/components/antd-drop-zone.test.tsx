import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { AntdDropZone } from './antd-drop-zone';

describe('#adapters/antd/shared/components/antd-drop-zone', () => {
  it('renders its adapter behavior', () => {
    render(<AntdDropZone id="drop-zone" index={0} isActive isDragging />);

    expect(
      document.querySelector('[data-test="ActiveDropZone"]')
    ).not.toBeNull();
  });
});

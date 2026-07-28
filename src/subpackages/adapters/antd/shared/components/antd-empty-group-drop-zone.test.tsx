import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { AntdEmptyGroupDropZone } from './antd-empty-group-drop-zone';

describe('#adapters/antd/shared/components/antd-empty-group-drop-zone', () => {
  it('renders its adapter behavior', () => {
    const { container } = render(
      <AntdEmptyGroupDropZone
        id="empty-drop-zone"
        index={0}
        parentId="group"
        isActive
        isDragging
      />
    );

    expect(container.firstChild).not.toBeNull();
  });
});

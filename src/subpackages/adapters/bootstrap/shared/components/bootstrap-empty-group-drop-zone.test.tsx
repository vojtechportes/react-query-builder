import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BootstrapEmptyGroupDropZone } from './bootstrap-empty-group-drop-zone';

describe('#adapters/bootstrap/shared/components/bootstrap-empty-group-drop-zone', () => {
  it('renders its adapter behavior', () => {
    const { container } = render(
      <BootstrapEmptyGroupDropZone
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

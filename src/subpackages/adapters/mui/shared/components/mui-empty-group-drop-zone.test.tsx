import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { MuiEmptyGroupDropZone } from './mui-empty-group-drop-zone';

describe('#adapters/mui/shared/components/mui-empty-group-drop-zone', () => {
  it('renders its adapter behavior', () => {
    const { container } = render(
      <MuiEmptyGroupDropZone
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

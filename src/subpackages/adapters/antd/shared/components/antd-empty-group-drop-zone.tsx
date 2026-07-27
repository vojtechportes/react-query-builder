import React, { FC } from 'react';
import {
  IEmptyGroupDropZoneProps,
  EmptyGroupDropZone,
} from '../../../../../builder/drag-and-drop/components/empty-group-drop-zone';

export const AntdEmptyGroupDropZone: FC<IEmptyGroupDropZoneProps> = (props) => (
  <EmptyGroupDropZone {...props} />
);

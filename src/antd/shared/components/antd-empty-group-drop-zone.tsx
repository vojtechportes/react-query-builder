import React, { FC } from 'react';
import { IEmptyGroupDropZoneProps, EmptyGroupDropZone } from '../../../empty-group-drop-zone';

export const AntdEmptyGroupDropZone: FC<IEmptyGroupDropZoneProps> = props => (
  <EmptyGroupDropZone {...props} />
);

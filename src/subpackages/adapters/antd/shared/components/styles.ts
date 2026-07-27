import { CSSProperties } from 'react';

export const antdControlHeight = 32;

export const antdControlStyle: CSSProperties = {
  minHeight: `${antdControlHeight}px`,
};

export const antdTextButtonStyle: CSSProperties = {
  ...antdControlStyle,
  whiteSpace: 'nowrap',
};

export const antdIconButtonStyle: CSSProperties = {
  width: `${antdControlHeight}px`,
  minWidth: `${antdControlHeight}px`,
  minHeight: `${antdControlHeight}px`,
  paddingInline: 0,
};

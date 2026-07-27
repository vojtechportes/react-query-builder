import React, { ElementType } from 'react';

export type OptionContainerProps<TElement extends ElementType = 'div'> = {
  as?: TElement;
} & Omit<React.ComponentPropsWithoutRef<TElement>, 'as'>;

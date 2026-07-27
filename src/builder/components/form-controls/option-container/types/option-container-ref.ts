import React, { ElementType } from 'react';

export type OptionContainerRef<TElement extends ElementType> =
  React.ComponentPropsWithRef<TElement>['ref'];

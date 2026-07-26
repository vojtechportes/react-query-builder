import type { ElementType, ReactElement } from 'react';
import { forwardRef } from 'react';
import { OptionContainerBase } from './components/option-container-base';
import { OptionContainerProps } from './types/option-container-props';
import { OptionContainerRef } from './types/option-container-ref';

interface IOptionContainerComponent {
  <TElement extends ElementType = 'div'>(
    props: OptionContainerProps<TElement> & {
      ref?: OptionContainerRef<TElement>;
    }
  ): ReactElement | null;
}

export const OptionContainer = forwardRef(
  OptionContainerBase
) as IOptionContainerComponent;
export type { OptionContainerProps } from './types/option-container-props';

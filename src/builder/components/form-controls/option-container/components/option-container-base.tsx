import clsx from 'clsx';
import React, { ElementType } from 'react';
import { OptionContainerProps } from '../types/option-container-props';
import styles from '../option-container.module.css';

export const OptionContainerBase = <TElement extends ElementType = 'div'>(
  { as, className, ...props }: OptionContainerProps<TElement>,
  ref: React.ForwardedRef<Element>
) => {
  const Component = as || 'div';

  return React.createElement(Component, {
    ...props,
    ref,
    className: clsx(styles.optionContainer, className),
  });
};

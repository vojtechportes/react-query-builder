import clsx from 'clsx';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Button } from '../button';
import { useThemeCssVariables } from '../theme-provider/hooks/use-theme-css-variables';
import styles from './popover.module.css';

export interface IPopoverProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  'data-test'?: string;
}

export const Popover: FC<IPopoverProps> = ({
  label,
  children,
  className,
  'data-test': dataTest,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const themeCssVariables = useThemeCssVariables();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const wrappedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const originalOnClick = child.props.onClick;

    return React.cloneElement(child, {
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        if (typeof originalOnClick === 'function') {
          originalOnClick(event);
        }

        setIsOpen(false);
      },
    });
  });

  return (
    <div
      className={clsx(styles.container, className)}
      ref={containerRef}
      style={themeCssVariables}
    >
      <Button onClick={() => setIsOpen((open) => !open)} data-test={dataTest}>
        {label}
      </Button>
      {isOpen && <div className={styles.content}>{wrappedChildren}</div>}
    </div>
  );
};

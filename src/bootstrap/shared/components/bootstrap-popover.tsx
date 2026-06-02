import React, { FC, useEffect, useRef, useState } from 'react';
import { IPopoverProps } from '../../../popover';
import { joinClassNames } from './styles';

export const BootstrapPopover: FC<IPopoverProps> = ({
  label,
  children,
  className,
  'data-test': dataTest,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const wrappedChildren = React.Children.map(children, child => {
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
    <div className={joinClassNames('position-relative d-inline-flex', className)} ref={containerRef}>
      <button
        type="button"
        className="btn btn-primary btn-sm dropdown-toggle"
        onClick={() => setIsOpen(open => !open)}
        data-test={dataTest}
        aria-expanded={isOpen}
      >
        {label}
      </button>
      {isOpen ? (
        <div
          className="dropdown-menu show mt-1"
          style={{ display: 'block', top: '100%', left: 0 }}
        >
          {wrappedChildren}
        </div>
      ) : null}
    </div>
  );
};

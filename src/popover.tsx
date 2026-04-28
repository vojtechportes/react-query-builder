import React, { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from './button';
import { useTheme } from './theme-provider/hooks/use-theme';
import { IThemeProps } from './theme-provider/theme-provider';

const Container = styled.div`
  position: relative;
  display: flex;
`;

const Content = styled.div<{ $theme: IThemeProps }>`
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  z-index: 5;
  min-width: 180px;
  background: ${({ $theme }) => $theme?.colors?.white};
  border: 1px solid ${({ $theme }) => $theme?.colors?.grey['500']};
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
`;

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
  const theme = useTheme();

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
    <Container className={className} ref={containerRef}>
      <Button onClick={() => setIsOpen(open => !open)} data-test={dataTest}>
        {label}
      </Button>
      {isOpen && <Content $theme={theme}>{wrappedChildren}</Content>}
    </Container>
  );
};

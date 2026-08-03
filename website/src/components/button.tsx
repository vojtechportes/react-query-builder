import * as React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

export interface IButtonProps {
  color?: 'primary' | 'secondary' | 'white';
  size?: 'small' | 'large';
  variant?: 'filled' | 'outlined';
  component?: 'a' | 'button';
  to?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
}

const buttonColorStyles = {
  primary: {
    filled: {
      background: '#3f51b5',
      border: '#3f51b5',
      color: '#fff',
      hoverBorder: '#303f9f',
      hoverBackground: '#303f9f',
    },
    outlined: {
      background: 'transparent',
      border: '#3f51b5',
      color: '#3f51b5',
      hoverBorder: '#303f9f',
      hoverBackground: 'transparent',
    },
  },
  secondary: {
    filled: {
      background: '#eef1ff',
      border: '#c7d1ff',
      color: '#303f9f',
      hoverBorder: '#3f51b5',
      hoverBackground: '#e4e9ff',
    },
    outlined: {
      background: 'transparent',
      border: '#c7d1ff',
      color: '#303f9f',
      hoverBorder: '#3f51b5',
      hoverBackground: 'transparent',
    },
  },
  white: {
    filled: {
      background: '#fff',
      border: '#fff',
      color: '#0f172a',
      hoverBorder: '#fff',
      hoverBackground: '#f8fafc',
    },
    outlined: {
      background: 'transparent',
      border: '#dbe4f0',
      color: '#fff',
      hoverBorder: '#fff',
      hoverBackground: 'transparent',
    },
  },
} as const;

const Root = styled.button<{
  $color: NonNullable<IButtonProps['color']>;
  $disabled: boolean;
  $size: NonNullable<IButtonProps['size']>;
  $variant: NonNullable<IButtonProps['variant']>;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: ${({ $size }) => ($size === 'large' ? '3.3rem' : '2.75rem')};
  padding: ${({ $size }) =>
    $size === 'large' ? '0.95rem 1.2rem' : '0.7rem 1rem'};
  border: 1px solid
    ${({ $color, $variant }) => buttonColorStyles[$color][$variant].border};
  border-radius: ${({ $size }) => ($size === 'large' ? '16px' : '10px')};
  background: ${({ $color, $variant }) =>
    buttonColorStyles[$color][$variant].background};
  color: ${({ $color, $variant }) => buttonColorStyles[$color][$variant].color};
  font: inherit;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition:
    background 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    transform 140ms ease;

  &:hover:not(:disabled):not([aria-disabled='true']) {
    border-color: ${({ $color, $variant }) =>
      buttonColorStyles[$color][$variant].hoverBorder};
    background: ${({ $color, $variant }) =>
      buttonColorStyles[$color][$variant].hoverBackground};
    box-shadow: 0 3px 8px rgba(63, 81, 181, 0.18);
  }

  &:focus-visible {
    outline: 3px solid rgba(117, 125, 232, 0.35);
    outline-offset: 2px;
  }

  &:active:not(:disabled):not([aria-disabled='true']) {
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(63, 81, 181, 0.16);
  }
`;

export const Button: React.FC<React.PropsWithChildren<IButtonProps>> = ({
  children,
  color = 'primary',
  size = 'large',
  variant = 'filled',
  component = 'button',
  to,
  type = 'button',
  disabled = false,
  onClick,
}) => {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ): void => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    onClick?.(event);
  };

  if (component === 'a' && disabled) {
    return (
      <Root
        as="a"
        role="link"
        aria-disabled="true"
        tabIndex={-1}
        $color={color}
        $disabled
        $size={size}
        $variant={variant}
        onClick={handleClick}
      >
        {children}
      </Root>
    );
  }

  if (component === 'a') {
    return (
      <Root
        as={Link}
        to={to ?? ''}
        $color={color}
        $disabled={false}
        $size={size}
        $variant={variant}
        onClick={handleClick}
      >
        {children}
      </Root>
    );
  }

  return (
    <Root
      type={type}
      disabled={disabled}
      $color={color}
      $disabled={disabled}
      $size={size}
      $variant={variant}
      onClick={handleClick}
    >
      {children}
    </Root>
  );
};

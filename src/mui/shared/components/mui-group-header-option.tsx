import React, { FC } from 'react';
import { ButtonBase } from '@mui/material';
import { IOptionProps } from '../../../group/option';

export const MuiGroupHeaderOption: FC<IOptionProps> = ({
  children,
  value,
  onClick,
  disabled,
  isSelected,
  className,
}) => (
  <ButtonBase
    className={className}
    onClick={() => {
      if (!disabled) {
        onClick(value);
      }
    }}
    sx={{
      px: 1.5,
      py: 1,
      minHeight: '2rem',
      border: 1,
      borderColor: isSelected ? 'primary.main' : 'grey.500',
      bgcolor: isSelected ? 'primary.main' : 'grey.500',
      color: 'primary.contrastText',
      fontWeight: 700,
      fontSize: '0.7rem',
      textTransform: 'uppercase',
      opacity: disabled ? 0.7 : 1,
    }}
  >
    {children}
  </ButtonBase>
);

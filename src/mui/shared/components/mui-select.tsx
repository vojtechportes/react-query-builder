import React, { FC } from 'react';
import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { ISelectProps } from '../../../form/select';
import { muiControlDensitySx } from '../constants/mui-control-density-sx.constant';
import { getMuiSelectPlaceholder, useMuiBuilderStrings } from './copy';
import { menuPaperSx } from './styles';

export const MuiSelect: FC<ISelectProps> = ({
  values,
  selectedValue,
  emptyValue,
  onChange,
  className,
  disabled = false,
  id,
  name,
}) => {
  const strings = useMuiBuilderStrings();
  const placeholder = getMuiSelectPlaceholder(
    emptyValue,
    strings.form?.selectYourValue
  );

  return (
    <FormControl
      fullWidth
      size="small"
      disabled={disabled}
      className={className}
    >
      <Select
        value={selectedValue || ''}
        sx={{
          ...muiControlDensitySx,
          '& .MuiSelect-select': {
            boxSizing: 'border-box',
            display: 'block',
            height: '100%',
            padding: '6px 32px 6px 14px',
            overflow: 'hidden',
            fontSize: muiControlDensitySx.fontSize,
            lineHeight: '20px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }}
        displayEmpty
        input={<OutlinedInput id={id} name={name} />}
        onChange={(event: SelectChangeEvent<string>) =>
          onChange(event.target.value)
        }
        renderValue={(selected) => {
          if (!selected) {
            return (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: muiControlDensitySx.fontSize }}
              >
                {placeholder}
              </Typography>
            );
          }

          return (
            values.find(({ value }) => value === selected)?.label || selected
          );
        }}
        inputProps={{ 'data-test': 'SelectTrigger' }}
        MenuProps={{ slotProps: { paper: { sx: menuPaperSx } } }}
      >
        {values.map(({ value, label }) => (
          <MenuItem
            key={value}
            value={value}
            data-test={`SelectOption[${value}]`}
            dense
            sx={{
              minHeight: muiControlDensitySx.height,
              fontSize: muiControlDensitySx.fontSize,
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

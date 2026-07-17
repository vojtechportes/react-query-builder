import React, { FC, useId } from 'react';
import {
  Badge,
  Box,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { ISelectMultiProps } from '../../../form/select-multi';
import { createSummary } from '../../../widgets/select-multi/utils/create-summary.util';
import { muiControlDensitySx } from '../constants/mui-control-density-sx.constant';
import { getMuiSelectPlaceholder, useMuiBuilderStrings } from './copy';
import { menuPaperSx } from './styles';

export const MuiSelectMulti: FC<ISelectMultiProps> = ({
  onChange,
  onDelete,
  selectedValue,
  emptyValue,
  values,
  className,
  disabled = false,
  id,
  name,
}) => {
  const labelId = useId();
  const strings = useMuiBuilderStrings();
  const placeholder = getMuiSelectPlaceholder(
    emptyValue,
    strings.form?.selectYourValue
  );

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const nextValues =
      typeof event.target.value === 'string'
        ? event.target.value.split(',')
        : event.target.value;

    for (const removedValue of selectedValue.filter(
      (value) => !nextValues.includes(value)
    )) {
      onDelete(removedValue);
    }

    for (const addedValue of nextValues.filter(
      (value) => !selectedValue.includes(value)
    )) {
      onChange(addedValue);
    }
  };

  const selectedLabels = values
    .filter(({ value }) => selectedValue.includes(value))
    .map(({ label }) => label);
  const summary = createSummary(selectedLabels);
  const title = summary.text ? selectedLabels.join(', ') : placeholder;

  return (
    <FormControl
      fullWidth
      size="small"
      disabled={disabled}
      className={className}
    >
      <Select
        labelId={labelId}
        multiple
        value={selectedValue}
        onChange={handleChange}
        input={<OutlinedInput id={id} name={name} />}
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
        renderValue={() => {
          if (!summary.text) {
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: 0,
                maxWidth: '100%',
              }}
              title={title}
              data-test="SelectMultiTrigger"
            >
              <Typography
                variant="body2"
                sx={{
                  flex: '1 1 auto',
                  minWidth: 0,
                  overflow: 'hidden',
                  fontSize: muiControlDensitySx.fontSize,
                  textOverflow: 'ellipsis',
                }}
                noWrap
              >
                {summary.text}
              </Typography>
              {summary.hiddenCount > 0 ? (
                <Badge
                  badgeContent={`+${summary.hiddenCount}`}
                  color="primary"
                  data-test="SelectMultiSummaryBadge"
                  sx={{
                    flex: '0 0 32px',
                    '& .MuiBadge-badge': { right: 12 },
                  }}
                >
                  <Box component="span" sx={{ width: '100%', height: 1 }} />
                </Badge>
              ) : null}
            </Box>
          );
        }}
        inputProps={{ 'data-test': 'SelectMultiTrigger' }}
        MenuProps={{ slotProps: { paper: { sx: menuPaperSx } } }}
      >
        {values.map(({ value, label }) => (
          <MenuItem
            key={value}
            value={value}
            data-test={`SelectMultiOption[${value}]`}
            dense
            sx={{
              minHeight: muiControlDensitySx.height,
              fontSize: muiControlDensitySx.fontSize,
            }}
          >
            <Checkbox size="small" checked={selectedValue.includes(value)} />
            <ListItemText
              primary={label}
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: muiControlDensitySx.fontSize,
                },
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

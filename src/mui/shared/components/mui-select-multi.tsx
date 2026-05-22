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
      value => !nextValues.includes(value)
    )) {
      onDelete(removedValue);
    }

    for (const addedValue of nextValues.filter(
      value => !selectedValue.includes(value)
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
        displayEmpty
        renderValue={() => {
          if (!summary.text) {
            return (
              <Typography variant="body2" color="text.secondary">
                {placeholder}
              </Typography>
            );
          }

          return (
            <Box
              sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
              title={title}
              data-test="SelectMultiTrigger"
            >
              <Typography variant="body2" noWrap>
                {summary.text}
              </Typography>
              {summary.hiddenCount > 0 ? (
                <Badge
                  badgeContent={`+${summary.hiddenCount}`}
                  color="primary"
                  data-test="SelectMultiSummaryBadge"
                />
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
          >
            <Checkbox checked={selectedValue.includes(value)} />
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

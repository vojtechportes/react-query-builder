import React, { FC } from 'react';
import { ISelectMultiProps } from '../../../form/select-multi';
import { useSelectMulti } from '../../../widgets/select-multi/hooks/use-select-multi';
import { createSummary } from '../../../widgets/select-multi/utils/create-summary.util';
import { getSelectedOptions } from '../../../widgets/select-multi/utils/get-selected-options.util';
import { BootstrapCheckIcon, BootstrapChevronDownIcon } from './icons';
import { bootstrapControlStyles, joinClassNames } from './styles';

export const BootstrapSelectMulti: FC<ISelectMultiProps> = ({
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
  const { isOpen, rootRef, toggle, triggerRef } = useSelectMulti({ disabled });
  const selectedOptions = getSelectedOptions(values, selectedValue);
  const selectedLabels = selectedOptions.map(({ label }) => label);
  const summary = createSummary(selectedLabels);
  const title = summary.text ? selectedLabels.join(', ') : emptyValue || 'Select value';

  const handleToggleValue = (value: string) => {
    if (selectedValue.includes(value)) {
      onDelete(value);
      return;
    }

    onChange(value);
  };

  return (
    <div
      ref={rootRef}
      className={joinClassNames('position-relative', className)}
      style={bootstrapControlStyles}
    >
      <input type="hidden" id={id} name={name} value={selectedValue.join(',')} readOnly />
      <button
        ref={triggerRef}
        type="button"
        id={id ? `${id}-trigger` : undefined}
        onClick={toggle}
        disabled={disabled}
        title={title}
        className={joinClassNames(
          'btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-between text-start',
          isOpen && 'show'
        )}
        aria-expanded={isOpen}
      >
        <span className="text-truncate">
          {summary.text || emptyValue || 'Select value'}
          {summary.hiddenCount > 0 ? ` (+${summary.hiddenCount})` : ''}
        </span>
        <span className="ms-2 d-inline-flex flex-shrink-0">
          <BootstrapChevronDownIcon />
        </span>
      </button>
      {isOpen ? (
        <div
          className="dropdown-menu show mt-1 w-100 p-1"
          style={{ display: 'block', maxHeight: '14rem', overflowY: 'auto' }}
        >
          {values.map(({ value, label }) => {
            const selected = selectedValue.includes(value);

            return (
              <button
                key={value}
                type="button"
                className={joinClassNames(
                  'dropdown-item d-flex align-items-center gap-2 rounded',
                  selected && 'active'
                )}
                onClick={() => handleToggleValue(value)}
              >
                <span
                  className="d-inline-flex align-items-center justify-content-center"
                  style={{ width: '1rem', height: '1rem' }}
                >
                  {selected ? <BootstrapCheckIcon /> : null}
                </span>
                <span className="text-truncate">{label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

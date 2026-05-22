import React, { FC, useContext } from 'react';
import { BuilderContext } from '../builder-context';
import { Switch as DefaultSwitch } from '../form/switch';
import { createReplaceNodeAction } from '../history/create-replace-node-action';
import { findNodeById } from '../history/find-node-by-id';
import { applyDataUpdate } from '../utils/apply-data-update.util';
import { updateItem } from '../utils/update-item.util';

export interface IBooleanProps {
  selectedValue: boolean;
  id: string;
  disabled?: boolean;
}

export const Boolean: FC<IBooleanProps> = ({
  selectedValue,
  id,
  disabled = false,
}) => {
  const {
    data,
    setData,
    onChange,
    updateData,
    dispatchAction,
    components,
    readOnly,
  } = useContext(BuilderContext);

  const Switch = components.form?.Switch || DefaultSwitch;

  const handleChange = (value: boolean) => {
    const currentRule = findNodeById(data, id);

    if (!currentRule || 'children' in currentRule) {
      return;
    }

    if (!dispatchAction && setData && onChange) {
      applyDataUpdate(
        data,
        setData,
        onChange,
        currentData =>
          updateItem(currentData, id, item => {
            if ('children' in item) {
              return;
            }

            item.value = value;
          }),
        updateData
      );
      return;
    }

    if (!dispatchAction) {
      return;
    }

    dispatchAction(
      createReplaceNodeAction(id, {
        ...currentRule,
        value,
      })
    );
  };

  return (
    <Switch
      onChange={handleChange}
      switched={selectedValue}
      disabled={readOnly || disabled}
    />
  );
};

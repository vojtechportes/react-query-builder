import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';
import {
  LockOutlined,
  SafetyOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { ILockToggleProps } from '../../../lock-toggle';
import {
  getNextGroupLockState,
  getNextRuleLockState,
} from '../../../utils/lock-state';
import { getAntdLockTitle, useAntdBuilderStrings } from './copy';
import { antdIconButtonStyle } from './styles';

const resolveIcon = (state: ILockToggleProps['state']) => {
  if (state === 'unlocked') {
    return <UnlockOutlined />;
  }

  if (state === 'all') {
    return <SafetyOutlined />;
  }

  return <LockOutlined />;
};

export const AntdLockToggle: FC<ILockToggleProps> = ({
  state,
  nodeType,
  disabled = false,
  onChange,
  className,
  title,
  'data-test': dataTest,
}) => {
  const strings = useAntdBuilderStrings();
  const resolvedTitle = getAntdLockTitle(title, nodeType, state, strings);

  return (
    <Tooltip title={resolvedTitle}>
      <Button
        type={state === 'unlocked' ? 'default' : 'primary'}
        icon={resolveIcon(state)}
        disabled={disabled}
        className={className}
        aria-label={resolvedTitle}
        data-test={dataTest}
        style={antdIconButtonStyle}
        onClick={() => {
          if (!onChange || disabled) {
            return;
          }

          onChange(
            nodeType === 'group'
              ? getNextGroupLockState(state)
              : getNextRuleLockState(state)
          );
        }}
      />
    </Tooltip>
  );
};

import React, { FC } from 'react';
import { AppstoreOutlined, CodeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ITextModeToggleContentProps } from '../../../builder';

const Content = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  line-height: 1;

  .anticon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  span {
    display: block;
    line-height: 1;
  }
`;

export const AntdTextModeToggleContent: FC<ITextModeToggleContentProps> = ({
  mode,
  label,
}) => (
  <Content>
    {mode === 'text' ? (
      <AppstoreOutlined aria-hidden="true" />
    ) : (
      <CodeOutlined aria-hidden="true" />
    )}
    <span>{label}</span>
  </Content>
);

import React, { FC } from 'react';
import CodeIcon from '@mui/icons-material/Code';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import styled from 'styled-components';
import { ITextModeToggleContentProps } from '../../../builder';

const Content = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  line-height: 1;

  .MuiSvgIcon-root {
    font-size: 1rem;
    flex-shrink: 0;
  }

  span {
    display: block;
    line-height: 1;
  }
`;

export const MuiTextModeToggleContent: FC<ITextModeToggleContentProps> = ({
  mode,
  label,
}) => (
  <Content>
    {mode === 'text' ? <ViewAgendaIcon aria-hidden="true" /> : <CodeIcon aria-hidden="true" />}
    <span>{label}</span>
  </Content>
);

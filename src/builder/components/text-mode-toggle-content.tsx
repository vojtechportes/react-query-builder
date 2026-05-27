import React, { FC } from 'react';
import styled from 'styled-components';
import { BuilderModeIcon } from './builder-mode-icon';
import { TextModeIcon } from './text-mode-icon';

const TextModeToggleContentContainer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  line-height: 1;

  svg {
    display: block;
    flex-shrink: 0;
  }

  span {
    display: block;
    line-height: 1;
  }
`;

export interface ITextModeToggleContentProps {
  mode: 'builder' | 'text';
  label: string;
}

export const TextModeToggleContent: FC<ITextModeToggleContentProps> = ({
  mode,
  label,
}) => (
  <TextModeToggleContentContainer>
    {mode === 'text' ? <BuilderModeIcon /> : <TextModeIcon />}
    <span>{label}</span>
  </TextModeToggleContentContainer>
);

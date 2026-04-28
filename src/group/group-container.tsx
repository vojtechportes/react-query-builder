import React, { FC } from 'react';
import styled from 'styled-components';
import { useTheme } from '../theme-provider/hooks/use-theme';
import { IThemeProps } from '../theme-provider/theme-provider';

const StyledGroup = styled.div<{
  hasDragHandle: boolean;
  $theme: Required<IThemeProps>;
}>`
  display: grid;
  grid-template-columns: ${({ hasDragHandle }) =>
    hasDragHandle ? 'auto 1fr' : '1fr'};
  background: #f4f4f4;
  border: 1px solid ${({ $theme }) => $theme.colors.grey['200']};
  box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const Body = styled.div`
  position: relative;
  padding: 0.7rem;
`;

const GroupHeader = styled.div<{ $theme: Required<IThemeProps> }>`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr;
  padding: 0 0 0.5rem;
  border-bottom: 1px solid ${({ $theme }) => $theme.colors.grey['200']};
`;

const Left = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  align-self: end;
  justify-self: start;

  > div:first-child {
    border-right: 0;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  > div:last-child {
    border-left: 0;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  > div:nth-child(2) {
    border-right: 0;
    border-left: 0;
  }
`;

const Right = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
  justify-self: end;
`;

export interface IGroupProps {
  controlsLeft?: React.ReactNode;
  controlsRight?: React.ReactNode;
  children: React.ReactNode;
  dragHandle?: React.ReactNode;
  className?: string;
  contentOverlay?: React.ReactNode;
}

export const Group: FC<IGroupProps> = ({
  controlsLeft,
  controlsRight,
  children,
  dragHandle,
  className,
  contentOverlay,
}) => {
  const theme = useTheme();

  return (
    <StyledGroup
      className={className}
      hasDragHandle={Boolean(dragHandle)}
      $theme={theme}
    >
      {dragHandle}
      <Body>
        <GroupHeader $theme={theme}>
          <Left>{controlsLeft}</Left>
          <Right>{controlsRight}</Right>
        </GroupHeader>
        {contentOverlay}
        {children}
      </Body>
    </StyledGroup>
  );
};

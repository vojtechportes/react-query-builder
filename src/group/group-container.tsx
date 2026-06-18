import React, { FC } from 'react';
import styled from 'styled-components';
import { compactBuilderMedia } from '../styles/responsive.styles';
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
  grid-template-columns: minmax(0, 1fr) auto;
  padding: 0 0 0.5rem;
  border-bottom: 1px solid ${({ $theme }) => $theme.colors.grey['200']};

  ${compactBuilderMedia`
    grid-template-columns: minmax(0, 1fr);
    grid-gap: 0.75rem;
  `}
`;

const Left = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  align-self: end;
  justify-self: start;

  > div {
    border-radius: 0;
  }

  > div:first-child {
    border-right: 0;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  > div + div {
    border-left: 0;
  }

  > div:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`;

const Right = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
  justify-self: end;

  ${compactBuilderMedia`
    justify-self: start;
    grid-auto-flow: row;
    grid-template-columns: repeat(3, minmax(0, max-content));
  `}
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
  const hasControlsLeft = React.Children.toArray(controlsLeft).length > 0;
  const hasControlsRight = React.Children.toArray(controlsRight).length > 0;
  const hasHeader = hasControlsLeft || hasControlsRight;

  return (
    <StyledGroup
      className={className}
      hasDragHandle={Boolean(dragHandle)}
      $theme={theme}
    >
      {dragHandle}
      <Body>
        {hasHeader ? (
          <GroupHeader $theme={theme}>
            {hasControlsLeft ? <Left>{controlsLeft}</Left> : null}
            {hasControlsRight ? <Right>{controlsRight}</Right> : null}
          </GroupHeader>
        ) : null}
        {contentOverlay}
        {children}
      </Body>
    </StyledGroup>
  );
};

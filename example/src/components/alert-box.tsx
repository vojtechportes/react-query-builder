import * as React from 'react';
import styled, { css } from 'styled-components';
import { siteTheme } from '../constants/site-theme';

const variants = {
  info: css`
    background: ${siteTheme.primarySurface};
    border-color: ${siteTheme.primaryBorder};
    color: ${siteTheme.primaryDark};
  `,
  tip: css`
    background: #ecfdf5;
    border-color: #a7f3d0;
    color: #166534;
  `,
  warning: css`
    background: #fff7ed;
    border-color: #fdba74;
    color: #9a3412;
  `,
};

const Root = styled.div<{ $variant: keyof typeof variants }>`
  margin-bottom: 1rem;
  padding: 1rem 1.1rem;
  border: 1px solid;
  border-radius: 16px;
  ${({ $variant }) => variants[$variant]}
`;

const Title = styled.strong`
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.95rem;
`;

const Body = styled.div`
  font-size: 0.95rem;
  line-height: 1.65;

  p {
    margin: 0;
  }
`;

export interface IAlertBoxProps {
  title: string;
  variant?: keyof typeof variants;
  children: React.ReactNode;
}

export const AlertBox: React.FC<IAlertBoxProps> = ({
  title,
  variant = 'info',
  children,
}) => (
  <Root $variant={variant}>
    <Title>{title}</Title>
    <Body>{children}</Body>
  </Root>
);

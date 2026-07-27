import * as React from 'react';
import styled from 'styled-components';
import { siteTheme } from '../constants/site-theme';

const Root = styled.details`
  min-width: 0;

  &[open] [data-icon='down'] {
    display: none;
  }

  &:not([open]) [data-icon='up'],
  &:not([open]) [data-label='expanded'],
  &[open] [data-label='collapsed'] {
    display: none;
  }
`;

const Summary = styled.summary`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid ${siteTheme.primaryBorder};
  border-radius: 8px;
  background: ${siteTheme.primarySurface};
  color: ${siteTheme.primaryDark};
  font-weight: 700;
  line-height: 1.35;
  list-style: none;
  cursor: pointer;
  user-select: none;
  transition:
    background 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    border-color: ${siteTheme.primary};
    background: ${siteTheme.primarySurfaceStrong};
  }

  &:focus-visible {
    outline: 3px solid ${siteTheme.primaryGlow};
    outline-offset: 2px;
  }
`;

const Icon = styled.svg`
  width: 1rem;
  max-width: 1rem;
  height: 1rem;
  flex: 0 0 1rem;
  fill: currentColor;
`;

const Content = styled.div`
  min-width: 0;
  margin-top: 0.5rem;
`;

export interface ICollapsibleSectionProps {
  collapsedLabel: React.ReactNode;
  expandedLabel: React.ReactNode;
  children: React.ReactNode;
}

export const CollapsibleSection: React.FC<ICollapsibleSectionProps> = ({
  collapsedLabel,
  expandedLabel,
  children,
}) => (
  <Root>
    <Summary>
      <span data-label="collapsed">{collapsedLabel}</span>
      <span data-label="expanded">{expandedLabel}</span>
      <Icon
        data-icon="down"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        aria-hidden="true"
        focusable="false"
      >
        <title>chevron-down</title>
        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
      </Icon>
      <Icon
        data-icon="up"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        aria-hidden="true"
        focusable="false"
      >
        <title>chevron-up</title>
        <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
      </Icon>
    </Summary>
    <Content>{children}</Content>
  </Root>
);

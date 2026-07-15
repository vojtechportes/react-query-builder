import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { siteTheme } from '../../constants/site-theme';

export interface ILinkProps {
  to: string;
  openInNewTab?: boolean;
  external?: boolean;
}

const linkStyles = css`
  color: ${siteTheme.primary};
  font-weight: 600;
`;

const Anchor = styled.a`
  ${linkStyles}
`;

const InternalLink = styled(RouterLink)`
  ${linkStyles}
`;

const ExternalIcon = styled.svg`
  width: 1em;
  height: 1em;
  margin-right: 0.3em;
  vertical-align: -0.125em;
  fill: currentColor;
`;

export const Link: React.FC<React.PropsWithChildren<ILinkProps>> = ({
  to,
  openInNewTab = false,
  external = false,
  children,
}) => {
  const shouldOpenInNewTab = external || openInNewTab;
  const target = shouldOpenInNewTab ? '_blank' : undefined;
  const rel = shouldOpenInNewTab ? 'noopener noreferrer' : undefined;
  const content = (
    <>
      {external ? (
        <ExternalIcon
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <title>open-in-new</title>
          <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
        </ExternalIcon>
      ) : null}
      {children}
    </>
  );

  return /^https?:\/\//i.test(to) ? (
    <Anchor href={to} target={target} rel={rel}>
      {content}
    </Anchor>
  ) : (
    <InternalLink to={to} target={target} rel={rel}>
      {content}
    </InternalLink>
  );
};

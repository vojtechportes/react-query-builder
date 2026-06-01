import * as React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { siteTheme } from '../constants/site-theme';

export interface INavigationPage {
  path: string;
  title: string;
  depth?: number;
}

export interface INavigationGroup {
  key: string;
  title: string;
  pages: INavigationPage[];
}

const Root = styled.aside`
  position: sticky;
  top: 6.7rem;
  align-self: start;
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);

  @media (max-width: 1080px) {
    position: static;
    top: auto;
  }
`;

const Group = styled.section`
  display: grid;
  gap: 0.05rem;
  padding-bottom: 0.45rem;
`;

const GroupTitle = styled.h3`
  margin: 0;
  padding: 0.1rem 0.55rem 0.25rem;
  font-size: 0.82rem;
  color: #64748b;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const LinkItem = styled(NavLink)<{ $depth?: number }>`
  display: block;
  padding: 0.38rem 0.55rem 0.38rem
    ${({ $depth = 0 }) => `calc(0.55rem + ${$depth}rem)`};
  border-radius: 14px;
  color: #475569;
  line-height: 1.3;

  &.active {
    margin: 0 -4px;
    padding-left: ${({ $depth = 0 }) => `calc(0.55rem + 4px + ${$depth}rem)`};
    padding-right: calc(0.55rem + 4px);
    background: ${siteTheme.primarySurfaceStrong};
    color: ${siteTheme.primaryDark};
    font-weight: 600;
  }
`;

export interface IDocumentationSidebarProps {
  title: string;
  overviewPage: INavigationPage;
  groups: INavigationGroup[];
}

export const DocumentationSidebar: React.FC<IDocumentationSidebarProps> = ({
  title: _title,
  overviewPage,
  groups,
}) => (
  <Root>
    <LinkItem to={overviewPage.path} end $depth={overviewPage.depth}>
      {overviewPage.title}
    </LinkItem>
    {groups.map(group => (
      <Group key={group.key}>
        <GroupTitle>{group.title}</GroupTitle>
        {group.pages.map(page => (
          <LinkItem key={page.path} to={page.path} end $depth={page.depth}>
            {page.title}
          </LinkItem>
        ))}
      </Group>
    ))}
  </Root>
);

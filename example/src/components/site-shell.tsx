import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { colors } from '../../../src';
import { GITHUB_URL, NPM_URL, SITE_NAME, TOP_LEVEL_NAV } from '../constants/site-constants';
import { siteTheme } from '../constants/site-theme';
import { CloseIcon, GithubIcon, MenuIcon, NpmIcon } from './icons';
import { HeaderSearch } from './header-search';

const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;
    font-family: "Segoe UI", "Inter", sans-serif;
    background:
      radial-gradient(circle at top left, ${siteTheme.pageGlow}, transparent 32%),
      linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
    color: #0f172a;
  }

  * {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-width: 320px;
    font-family: "Segoe UI", "Inter", sans-serif;
    line-height: 1.5;
    color: #0f172a;
    background:
      radial-gradient(circle at top left, ${siteTheme.pageGlow}, transparent 32%),
      linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  backdrop-filter: blur(18px);
  background: rgba(248, 251, 255, 0.85);
  border-bottom: 1px solid rgba(203, 213, 225, 0.85);
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  max-width: 1320px;
  margin: 0 auto;
  padding: 1rem 1.5rem;

  @media (max-width: 540px) {
    padding: 1rem 0.5rem;
  }
`;

const Brand = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  min-width: 0;
  color: #0f172a;
  white-space: nowrap;
`;

const Logo = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  background: linear-gradient(
    180deg,
    ${colors.primary.light} 0%,
    ${colors.primary.default} 100%
  );
  color: ${colors.white};
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  flex-shrink: 0;
  padding-bottom: 0.08em;
`;

const BrandText = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  line-height: 1;

  @media (max-width: 540px) {
    display: none;
  }
`;

const ReactText = styled.span`
  color: ${colors.primary.default};
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: -0.05em;
`;

const QueryBuilderText = styled.span`
  color: ${colors.grey['900']};
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.04em;
`;

const VersionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.9rem;
  margin-bottom: -2px;
  padding: 0.35rem 0.75rem;
  border: 1px solid ${siteTheme.primaryBorder};
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: ${siteTheme.primaryDark};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  justify-content: flex-end;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const UtilityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const DesktopOnly = styled.div`
  display: contents;

  @media (max-width: 1079px) {
    display: none;
  }
`;

const MobileActions = styled.div`
  display: none;
  align-items: center;
  gap: 0.7rem;

  @media (max-width: 1079px) {
    display: flex;
  }
`;

const NavItem = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 0.95rem;
  border-radius: 999px;
  color: #475569;
  font-weight: 600;
  line-height: 1;

  &.active {
    background: ${siteTheme.primarySurfaceStrong};
    color: ${siteTheme.primaryDark};
  }
`;

const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #dbe4f0;
  border-radius: 999px;
  color: #334155;
  background: #fff;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #dbe4f0;
  border-radius: 999px;
  background: #fff;
  color: #334155;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MobileMenuTrigger = styled(MenuButton)<{ $hidden: boolean }>`
  visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};
`;

const MobileOverlay = styled.button<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 110;
  border: 0;
  background: rgba(15, 23, 42, 0.28);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 180ms ease;

  @media (min-width: 1080px) {
    display: none;
  }
`;

const MobilePanel = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 120;
  width: min(360px, calc(100vw - 2rem));
  padding: 1.25rem;
  border-left: 1px solid rgba(203, 213, 225, 0.85);
  background: rgba(248, 251, 255, 0.98);
  backdrop-filter: blur(18px);
  box-shadow: -24px 0 60px rgba(15, 23, 42, 0.12);
  transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
  transition: transform 220ms ease;
  overflow-y: auto;
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};

  @media (min-width: 1080px) {
    display: none;
  }
`;

const MobilePanelContent = styled.div`
  display: grid;
  gap: 1rem;
`;

const MobilePanelHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const MobileNav = styled(Nav)`
  display: grid;
  gap: 0.35rem;
`;

const MobileNavItem = styled(NavItem)`
  justify-content: flex-start;
  border-radius: 16px;
  padding: 0.85rem 1rem;
`;

const MobileSearchWrap = styled.div`
  display: grid;
`;

const Main = styled.main`
  max-width: 1320px;
  width: 100%;
  flex: 1 0 auto;
  margin: 0 auto;
  padding: 7rem 1.5rem 3rem;

  @media (max-width: 540px) {
    padding: 6rem 0.5rem 3rem;
  }
`;

const Footer = styled.footer`
  padding: 2rem 1.5rem;
  border-top: 1px solid rgba(203, 213, 225, 0.85);
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: center;

  @media (max-width: 540px) {
    padding: 1rem 0.5rem;
  }
`;

export const SiteShell: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const year = new Date().getFullYear();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <Page>
      <GlobalStyle />
      <Header>
        <HeaderInner>
          <Brand to="/">
            <Logo aria-hidden="true">QB</Logo>
            <BrandText>
              <ReactText>React</ReactText>
              <QueryBuilderText>Query Builder</QueryBuilderText>
            </BrandText>
            <VersionBadge aria-label="Documentation version">Docs v1</VersionBadge>
          </Brand>

          <Right>
            <DesktopOnly>
              <Nav>
                {TOP_LEVEL_NAV.map(item => (
                  <NavItem key={item.to} to={item.to} end={item.to === '/'}>
                    {item.label}
                  </NavItem>
                ))}
              </Nav>

              <UtilityRow>
                <HeaderSearch />
              </UtilityRow>
            </DesktopOnly>

            <MobileActions>
              <IconLink href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GithubIcon />
              </IconLink>
              <IconLink href={NPM_URL} target="_blank" rel="noreferrer" aria-label="npm">
                <NpmIcon />
              </IconLink>
              <MobileMenuTrigger
                type="button"
                aria-label="Open menu"
                aria-expanded={false}
                aria-controls="mobile-site-panel"
                onClick={() => setMobileMenuOpen(true)}
                $hidden={mobileMenuOpen}
              >
                <MenuIcon />
              </MobileMenuTrigger>
            </MobileActions>

            <DesktopOnly>
              <IconLink href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GithubIcon />
              </IconLink>
              <IconLink href={NPM_URL} target="_blank" rel="noreferrer" aria-label="npm">
                <NpmIcon />
              </IconLink>
            </DesktopOnly>
          </Right>
        </HeaderInner>
      </Header>

      <MobileOverlay
        type="button"
        aria-label="Close menu overlay"
        $open={mobileMenuOpen}
        onClick={() => setMobileMenuOpen(false)}
      />
      <MobilePanel id="mobile-site-panel" $open={mobileMenuOpen} aria-hidden={!mobileMenuOpen}>
        <MobilePanelContent>
          <MobilePanelHeader>
            <MenuButton
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CloseIcon />
            </MenuButton>
          </MobilePanelHeader>
          <MobileSearchWrap>
            <HeaderSearch />
          </MobileSearchWrap>
          <MobileNav>
            {TOP_LEVEL_NAV.map(item => (
              <MobileNavItem key={item.to} to={item.to} end={item.to === '/'}>
                {item.label}
              </MobileNavItem>
            ))}
          </MobileNav>
        </MobilePanelContent>
      </MobilePanel>

      <Main>
        <Outlet />
      </Main>
      <Footer>
        &copy; Vojtěch Václav Porteš {year} - All library contents are available under the
        MIT license.
      </Footer>
    </Page>
  );
};

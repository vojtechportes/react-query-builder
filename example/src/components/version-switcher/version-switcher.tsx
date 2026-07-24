import * as React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { siteTheme } from '../../constants/site-theme';
import type { SiteVersion } from '../../shared/versioned-url';
import type { IVersionSwitcherProps } from './types/version-switcher-props';
import { getVersionSwitchHref } from './utils/get-version-switch-href.util';
import { getVersionSwitchRoutes } from './utils/get-version-switch-routes.util';

const versions: readonly SiteVersion[] = ['v1', 'v2'];

const Container = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 1.9rem;
  margin-bottom: -2px;
  padding: 0.35rem 0.65rem 0.35rem 0.75rem;
  border: 1px solid ${siteTheme.primaryBorder};
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: ${siteTheme.primaryDark};
  cursor: pointer;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;

  &:hover {
    background: ${siteTheme.primarySurfaceStrong};
  }

  &:focus-visible {
    outline: 3px solid ${siteTheme.primaryBorder};
    outline-offset: 2px;
  }
`;

const Chevron = styled.span<{ $open: boolean }>`
  display: inline-block;
  font-size: 0.7rem;
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0')});
  transition: transform 160ms ease;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 0.45rem);
  left: 0;
  z-index: 140;
  display: grid;
  min-width: 10rem;
  padding: 0.35rem;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.16);
`;

const MenuItem = styled.a<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.65rem 0.75rem;
  border-radius: 8px;
  background: ${({ $active }) =>
    $active ? siteTheme.primarySurfaceStrong : 'transparent'};
  color: ${({ $active }) => ($active ? siteTheme.primaryDark : '#334155')};
  font-size: 0.9rem;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  letter-spacing: normal;
  text-transform: none;

  &:hover {
    background: ${siteTheme.primarySurfaceStrong};
  }

  &:focus-visible {
    outline: 2px solid ${siteTheme.primaryBorder};
    outline-offset: -2px;
  }
`;

const CurrentLabel = styled.span`
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 600;
`;

export const VersionSwitcher: React.FC<IVersionSwitcherProps> = ({
  basename,
  currentVersion,
}) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const optionRefs = React.useRef<Array<HTMLAnchorElement | null>>([]);
  const focusIndexOnOpenRef = React.useRef(versions.indexOf(currentVersion));
  const menuId = React.useId();
  const location = useLocation();

  const hrefs = versions.map((version) =>
    getVersionSwitchHref({
      basename,
      hash: location.hash,
      pathname: location.pathname,
      search: location.search,
      targetRoutes: getVersionSwitchRoutes(version),
      targetVersion: version,
    })
  );

  const openMenu = (focusIndex: number) => {
    focusIndexOnOpenRef.current = focusIndex;
    setOpen(true);
  };

  const closeMenu = (restoreFocus = false) => {
    setOpen(false);

    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  };

  React.useEffect(() => {
    if (open) {
      optionRefs.current[focusIndexOnOpenRef.current]?.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  React.useEffect(() => {
    setOpen(false);
  }, [location.hash, location.pathname, location.search]);

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(event.key === 'ArrowDown' ? 0 : versions.length - 1);
    }
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const activeIndex = optionRefs.current.findIndex(
      (option) => option === document.activeElement
    );
    let nextIndex: number | undefined;

    if (event.key === 'ArrowDown') {
      nextIndex = (activeIndex + 1) % versions.length;
    } else if (event.key === 'ArrowUp') {
      nextIndex = (activeIndex - 1 + versions.length) % versions.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = versions.length - 1;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      optionRefs.current[activeIndex]?.click();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === 'Tab') {
      setOpen(false);
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      optionRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <Container ref={containerRef}>
      <Trigger
        ref={triggerRef}
        type="button"
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Documentation version. Current version: ${currentVersion}`}
        onClick={() =>
          open ? closeMenu() : openMenu(versions.indexOf(currentVersion))
        }
        onKeyDown={handleTriggerKeyDown}
      >
        Docs {currentVersion}
        <Chevron $open={open} aria-hidden="true">
          ▾
        </Chevron>
      </Trigger>

      {open ? (
        <Menu id={menuId} role="menu" onKeyDown={handleMenuKeyDown}>
          {versions.map((version, index) => {
            const active = version === currentVersion;

            return (
              <MenuItem
                key={version}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                href={hrefs[index]}
                role="menuitemradio"
                aria-checked={active}
                aria-label={
                  active
                    ? `Documentation ${version}, current version`
                    : `Switch to documentation ${version}`
                }
                $active={active}
                onClick={(event) => {
                  if (active) {
                    event.preventDefault();
                  }

                  closeMenu();
                }}
              >
                Documentation {version}
                {active ? <CurrentLabel>Current</CurrentLabel> : null}
              </MenuItem>
            );
          })}
        </Menu>
      ) : null}
    </Container>
  );
};

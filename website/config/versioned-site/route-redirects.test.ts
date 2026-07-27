import { describe, expect, it } from 'vitest';
import type { IRouteRedirectConfiguration } from '../../src/shared/route-redirect';
import {
  permanentRedirectStatus,
  resolveRouteRequest,
} from '../../src/shared/route-redirect';
import { v1RouteRedirectManifest } from '../../src/v1/app/constants/v1-route-redirect-manifest';
import { v2RouteRedirectManifest } from '../../src/v2/app/constants/v2-route-redirect-manifest';
import { createDeploymentPath } from './utils/create-deployment-path.util';

const configuration: IRouteRedirectConfiguration = {
  latestVersion: 'v2',
  manifests: {
    v1: v1RouteRedirectManifest,
    v2: v2RouteRedirectManifest,
  },
};

const deploymentBasenames = ['', '/react-query-builder/'] as const;

describe('versioned route redirect contract', () => {
  it('uses an explicit permanent redirect status', () => {
    expect(permanentRedirectStatus).toBe(308);
  });

  it.each(deploymentBasenames)(
    'redirects every unversioned canonical route directly to v2 under basename %s',
    (basename) => {
      for (const path of v2RouteRedirectManifest.canonicalPaths) {
        const source = createDeploymentPath(basename, path);
        const destination = createDeploymentPath(
          basename,
          path === '/' ? '/v2' : `/v2${path}`
        );

        expect(
          resolveRouteRequest(configuration, { basename, url: source })
        ).toEqual({ status: 308, location: destination });
      }
    }
  );

  it.each(deploymentBasenames)(
    'redirects every unversioned legacy route directly to its v2 canonical destination under basename %s',
    (basename) => {
      for (const redirect of v2RouteRedirectManifest.redirects) {
        const source = createDeploymentPath(basename, redirect.from);
        const destination = createDeploymentPath(basename, `/v2${redirect.to}`);

        expect(
          resolveRouteRequest(configuration, { basename, url: source })
        ).toEqual({ status: 308, location: destination });
      }
    }
  );

  it.each(deploymentBasenames)(
    'keeps every version-local redirect in its version under basename %s',
    (basename) => {
      for (const version of ['v1', 'v2'] as const) {
        const manifest = configuration.manifests[version];

        for (const redirect of manifest.redirects) {
          const source = createDeploymentPath(
            basename,
            `/${version}${redirect.from}`
          );
          const destination = createDeploymentPath(
            basename,
            `/${version}${redirect.to}`
          );

          expect(
            resolveRouteRequest(configuration, { basename, url: source })
          ).toEqual({ status: 308, location: destination });
        }
      }
    }
  );

  it.each(deploymentBasenames)(
    'does not redirect any versioned canonical route under basename %s',
    (basename) => {
      for (const version of ['v1', 'v2'] as const) {
        for (const path of configuration.manifests[version].canonicalPaths) {
          const source = createDeploymentPath(
            basename,
            path === '/' ? `/${version}` : `/${version}${path}`
          );

          expect(
            resolveRouteRequest(configuration, { basename, url: source })
          ).toEqual({ status: 200 });
        }
      }
    }
  );

  it.each(deploymentBasenames)(
    'preserves query strings and hashes byte-for-byte under basename %s',
    (basename) => {
      const source = `${createDeploymentPath(
        basename,
        '/api/builder-props'
      )}?q=a%2Fb&q=c&empty=#ref%201`;
      const destination = `${createDeploymentPath(
        basename,
        '/v2/api/builder'
      )}?q=a%2Fb&q=c&empty=#ref%201`;

      expect(
        resolveRouteRequest(configuration, { basename, url: source })
      ).toEqual({ status: 308, location: destination });
    }
  );

  it.each(deploymentBasenames)(
    'returns 404 without a Location for unknown generated routes under basename %s',
    (basename) => {
      for (const path of [
        '/route-not-owned',
        '/v1/route-not-owned',
        '/v2/route-not-owned',
      ]) {
        expect(
          resolveRouteRequest(configuration, {
            basename,
            url: createDeploymentPath(basename, path),
          })
        ).toEqual({ status: 404 });
      }
    }
  );

  it('accepts the repository basename root with or without a trailing slash', () => {
    for (const url of ['/react-query-builder', '/react-query-builder/']) {
      expect(
        resolveRouteRequest(configuration, {
          basename: '/react-query-builder/',
          url,
        })
      ).toEqual({ status: 308, location: '/react-query-builder/v2' });
    }
  });

  it.each(deploymentBasenames)(
    'preserves query strings and hashes for version-local redirects under basename %s',
    (basename) => {
      for (const version of ['v1', 'v2'] as const) {
        const source = `${createDeploymentPath(
          basename,
          `/${version}/api/builder-props`
        )}?q=a%2Fb&q=c#ref%201`;
        const destination = `${createDeploymentPath(
          basename,
          `/${version}/api/builder`
        )}?q=a%2Fb&q=c#ref%201`;

        expect(
          resolveRouteRequest(configuration, { basename, url: source })
        ).toEqual({ status: 308, location: destination });
      }
    }
  );
  it('does not claim paths outside the configured basename or basename lookalikes', () => {
    for (const url of [
      '/documentation',
      '/react-query-builderish/documentation',
    ]) {
      expect(
        resolveRouteRequest(configuration, {
          basename: '/react-query-builder',
          url,
        })
      ).toEqual({ status: 404 });
    }
  });

  it('keeps redirect sources distinct and every destination canonical', () => {
    for (const manifest of Object.values(configuration.manifests)) {
      const canonicalPaths = new Set(manifest.canonicalPaths);
      const redirectSources = manifest.redirects.map(({ from }) => from);

      expect(new Set(redirectSources).size).toBe(redirectSources.length);

      for (const redirect of manifest.redirects) {
        expect(canonicalPaths.has(redirect.from)).toBe(false);
        expect(canonicalPaths.has(redirect.to)).toBe(true);
      }
    }
  });
});

import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createVersionedSiteViteConfig } from './utils/create-versioned-site-vite-config.util';
import { resolveVersionTarget } from './utils/resolve-version-target.util';

const exampleRoot = resolve(import.meta.dirname, '../..');

describe('versioned site configuration', () => {
  it.each(['v1', 'v2'] as const)(
    'uses isolated client and SSR staging for %s',
    (target) => {
      const clientConfig = createVersionedSiteViteConfig(target, 'client');
      const ssrConfig = createVersionedSiteViteConfig(target, 'ssr');
      const stageRoot = resolve(exampleRoot, '.versioned-dist', target);

      expect(clientConfig.plugins).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: `select-${target}-client-entry` }),
        ])
      );
      expect(clientConfig.build?.outDir).toBe(stageRoot);
      expect(clientConfig.build?.emptyOutDir).toBe(true);
      expect(ssrConfig.build?.outDir).toBe(resolve(stageRoot, '.ssg'));
      expect(ssrConfig.build?.emptyOutDir).toBe(true);
      expect(ssrConfig.build?.ssr).toBe(true);
    }
  );

  it('keeps target staging roots distinct', () => {
    const v1Config = createVersionedSiteViteConfig('v1', 'client');
    const v2Config = createVersionedSiteViteConfig('v2', 'client');

    expect(v1Config.build?.outDir).not.toBe(v2Config.build?.outDir);
  });

  it('rejects a non-version Vite mode', () => {
    expect(() => resolveVersionTarget('production')).toThrow(
      'Expected a version target mode of "v1" or "v2"'
    );
  });
});

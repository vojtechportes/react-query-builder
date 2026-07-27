import type { Plugin } from 'vite';
import type { VersionTarget } from '../types/version-target';
import { getImportBoundaryViolation } from './get-import-boundary-violation.util';
import { getTargetPackageBoundaryViolation } from './get-target-package-boundary-violation.util';

export const createImportBoundaryPlugin = (target: VersionTarget): Plugin => ({
  name: 'versioned-site-import-boundaries',
  enforce: 'pre',
  resolveId(source, importer) {
    const violation =
      getTargetPackageBoundaryViolation(target, source) ??
      (importer ? getImportBoundaryViolation(importer, source) : undefined);

    if (violation) {
      this.error(`${violation}: ${importer ?? '<entry>'} -> ${source}`);
    }

    return null;
  },
});

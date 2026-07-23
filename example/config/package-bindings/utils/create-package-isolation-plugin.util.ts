import type { Plugin } from 'vite';
import type { IPackageBinding } from '../types/package-binding';

export const createPackageIsolationPlugin = (
  binding: IPackageBinding,
  oppositeBinding: IPackageBinding
): Plugin => ({
  name: `verify-${binding.target}-package-isolation`,
  generateBundle() {
    const implementationRoot = binding.implementationRoot.replaceAll('\\', '/');

    const oppositeRoot = oppositeBinding.implementationRoot.replaceAll(
      '\\',
      '/'
    );

    const moduleIds = [...this.getModuleIds()].map(
      (moduleId) => moduleId.replaceAll('\\', '/').split('?')[0]
    );

    if (
      !moduleIds.some((moduleId) => moduleId.startsWith(implementationRoot))
    ) {
      this.error(
        `${binding.target} did not load modules from ${implementationRoot}.`
      );
    }

    const oppositeModules = moduleIds.filter((moduleId) =>
      moduleId.startsWith(oppositeRoot)
    );

    if (oppositeModules.length > 0) {
      this.error(
        `${binding.target} loaded the opposite package: ${oppositeModules.join(', ')}`
      );
    }

    this.emitFile({
      type: 'asset',
      fileName: 'package-module-graph.json',
      source: JSON.stringify(
        {
          target: binding.target,
          implementationRoot,
          packageModules: moduleIds.filter((moduleId) =>
            moduleId.startsWith(implementationRoot)
          ),
          oppositeModules,
        },
        null,
        2
      ),
    });
  },
});

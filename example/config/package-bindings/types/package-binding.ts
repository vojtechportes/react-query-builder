import type { IPackageAlias } from './package-alias';
import type { PackageBindingTarget } from './package-binding-target';

export interface IPackageBinding {
  aliases: IPackageAlias[];
  implementationRoot: string;
  packageRoot: string;
  packageSpecifier: string;
  reactDomRoot: string;
  reactRoot: string;
  ssrNoExternal: (string | RegExp)[];
  target: PackageBindingTarget;
  typeScriptPaths: Record<string, string[]>;
}

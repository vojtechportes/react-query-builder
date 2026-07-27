export const resolveProductionDependencyPairs = (packageRecords) => {
  const dependencyQueue = [];
  const visitedPackagePaths = new Set();
  const productionDependencyPairs = new Set();
  const rootPackageRecord = packageRecords[''];

  if (!rootPackageRecord) {
    throw new Error('Package lock is missing its root package record');
  }

  for (const dependencyName of Object.keys(
    rootPackageRecord.dependencies ?? {}
  )) {
    dependencyQueue.push([dependencyName, '']);
  }
  for (const dependencyName of Object.keys(
    rootPackageRecord.optionalDependencies ?? {}
  )) {
    dependencyQueue.push([dependencyName, '']);
  }
  for (const dependencyName of Object.keys(
    rootPackageRecord.peerDependencies ?? {}
  )) {
    if (!rootPackageRecord.peerDependenciesMeta?.[dependencyName]?.optional) {
      dependencyQueue.push([dependencyName, '']);
    }
  }

  while (dependencyQueue.length > 0) {
    const [dependencyName, parentPackagePath] = dependencyQueue.pop();
    const resolutionCandidates = [];
    let ancestorPackagePath = parentPackagePath;

    while (ancestorPackagePath) {
      resolutionCandidates.push(
        `${ancestorPackagePath}/node_modules/${dependencyName}`
      );
      const nestedModulesIndex =
        ancestorPackagePath.lastIndexOf('/node_modules/');
      ancestorPackagePath =
        nestedModulesIndex === -1
          ? ''
          : ancestorPackagePath.slice(0, nestedModulesIndex);
    }
    resolutionCandidates.push(`node_modules/${dependencyName}`);

    const packagePath = resolutionCandidates.find(
      (candidatePath) => packageRecords[candidatePath]
    );

    if (!packagePath) {
      throw new Error(
        `Package lock cannot resolve ${dependencyName} from ${parentPackagePath || 'root'}`
      );
    }
    if (visitedPackagePaths.has(packagePath)) {
      continue;
    }

    const packageRecord = packageRecords[packagePath];
    const resolvedName = packageRecord.name ?? dependencyName;

    if (resolvedName === 'styled-components') {
      throw new Error(
        'Production dependency tree must not contain styled-components'
      );
    }

    visitedPackagePaths.add(packagePath);
    productionDependencyPairs.add(`${resolvedName}@${packageRecord.version}`);

    for (const childDependencyName of Object.keys(
      packageRecord.dependencies ?? {}
    )) {
      dependencyQueue.push([childDependencyName, packagePath]);
    }
    for (const childDependencyName of Object.keys(
      packageRecord.optionalDependencies ?? {}
    )) {
      dependencyQueue.push([childDependencyName, packagePath]);
    }
    for (const childDependencyName of Object.keys(
      packageRecord.peerDependencies ?? {}
    )) {
      if (
        !packageRecord.peerDependenciesMeta?.[childDependencyName]?.optional
      ) {
        dependencyQueue.push([childDependencyName, packagePath]);
      }
    }
  }

  return productionDependencyPairs;
};

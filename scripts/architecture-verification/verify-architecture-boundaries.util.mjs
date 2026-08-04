import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

import { getSourceOwner } from './get-source-owner.util.mjs';
import { resolveSourceModule } from './resolve-source-module.util.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultRepositoryRoot = path.resolve(scriptDirectory, '..', '..');
const sourceFilePattern = /\.(?:cts|mts|ts|tsx)$/;
const excludedSourcePattern = /(?:^|\/)(?:__mocks__)(?:\/|$)|\.test\.[^.]+$/;
const packageName = '@vojtechportes/react-query-builder';
const allowedSourceRoots = new Set([
  '__mocks__',
  'builder',
  'shared',
  'subpackages',
]);
const excludedDirectoryNamePattern = /^__(?:mocks|snapshots)__$/;
const kebabCasePathSegmentPattern =
  /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

export const verifyArchitectureBoundaries = (
  repositoryRoot = defaultRepositoryRoot
) => {
  const sourceRoot = path.join(repositoryRoot, 'src');
  const pendingPaths = [sourceRoot];
  const sourceFiles = [];
  const violations = [];

  while (pendingPaths.length > 0) {
    const currentPath = pendingPaths.pop();

    for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
      const entryPath = path.join(currentPath, entry.name);
      const sourceRelativePath = path
        .relative(sourceRoot, entryPath)
        .split(path.sep)
        .join('/');

      if (entry.isDirectory()) {
        if (currentPath === sourceRoot && !allowedSourceRoots.has(entry.name)) {
          violations.push(`${entry.name} is not a recognized source root`);
        }

        if (
          !excludedDirectoryNamePattern.test(entry.name) &&
          !kebabCasePathSegmentPattern.test(entry.name)
        ) {
          violations.push(
            `${sourceRelativePath} does not use a kebab-case directory name`
          );
        }

        pendingPaths.push(entryPath);
      } else {
        if (!kebabCasePathSegmentPattern.test(entry.name)) {
          violations.push(
            `${sourceRelativePath} does not use a kebab-case file name`
          );
        }

        if (
          sourceFilePattern.test(entry.name) &&
          !excludedSourcePattern.test(sourceRelativePath)
        ) {
          sourceFiles.push(entryPath);
        }
      }
    }
  }

  let checkedEdgeCount = 0;

  for (const sourceFilePath of sourceFiles) {
    const sourceRelativePath = path.relative(sourceRoot, sourceFilePath);
    const sourceOwner = getSourceOwner(sourceRelativePath);

    if (sourceOwner === 'unknown') {
      violations.push(
        `${sourceRelativePath.split(path.sep).join('/')} has no recognized source owner`
      );
    }

    const sourceText = fs.readFileSync(sourceFilePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      sourceFilePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );
    const pendingNodes = [sourceFile];

    while (pendingNodes.length > 0) {
      const node = pendingNodes.pop();
      let moduleSpecifier;

      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteralLike(node.moduleSpecifier)
      ) {
        moduleSpecifier = node.moduleSpecifier.text;
      } else if (
        ts.isImportEqualsDeclaration(node) &&
        ts.isExternalModuleReference(node.moduleReference) &&
        node.moduleReference.expression &&
        ts.isStringLiteralLike(node.moduleReference.expression)
      ) {
        moduleSpecifier = node.moduleReference.expression.text;
      } else if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        node.arguments.length === 1 &&
        ts.isStringLiteralLike(node.arguments[0])
      ) {
        moduleSpecifier = node.arguments[0].text;
      }

      if (moduleSpecifier) {
        if (
          moduleSpecifier === packageName ||
          moduleSpecifier.startsWith(`${packageName}/`)
        ) {
          violations.push(
            `${sourceRelativePath.split(path.sep).join('/')} imports the public package specifier ${moduleSpecifier}`
          );
        }

        const targetPath = resolveSourceModule(sourceFilePath, moduleSpecifier);

        if (targetPath && targetPath.startsWith(sourceRoot + path.sep)) {
          checkedEdgeCount += 1;

          const targetRelativePath = path.relative(sourceRoot, targetPath);
          const targetOwner = getSourceOwner(targetRelativePath);
          const allowedTargets =
            sourceOwner === 'root'
              ? ['builder', 'shared', 'subpackage:locales', 'root']
              : sourceOwner === 'builder'
                ? ['builder', 'shared']
                : sourceOwner === 'shared'
                  ? ['shared']
                  : sourceOwner.startsWith('adapter:')
                    ? [sourceOwner, 'builder', 'shared']
                    : sourceOwner === 'subpackage:monaco'
                      ? [sourceOwner, 'builder', 'shared']
                      : sourceOwner === 'subpackage:locales' ||
                          sourceOwner === 'subpackage:parse-query' ||
                          sourceOwner === 'subpackage:format-query'
                        ? [sourceOwner, 'shared']
                        : [sourceOwner];

          if (!allowedTargets.includes(targetOwner)) {
            violations.push(
              `${sourceRelativePath.split(path.sep).join('/')} (${sourceOwner}) imports ` +
                `${targetRelativePath.split(path.sep).join('/')} (${targetOwner})`
            );
          }
        }
      }

      ts.forEachChild(node, (child) => {
        pendingNodes.push(child);
      });
    }
  }

  if (violations.length > 0) {
    throw new Error(
      `Architecture or source-layout violations:\n- ${violations.sort().join('\n- ')}`
    );
  }

  return { checkedEdgeCount, sourceFileCount: sourceFiles.length };
};

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const result = verifyArchitectureBoundaries();

    console.log(
      `Architecture boundaries verified across ${result.sourceFileCount} source files ` +
        `and ${result.checkedEdgeCount} internal dependency edges.`
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

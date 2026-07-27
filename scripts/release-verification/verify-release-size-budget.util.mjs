import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { transform } from 'esbuild';
import { resolveProductionDependencyPairs } from './resolve-production-dependency-pairs.util.mjs';

const verifyReleaseSizeBudget = async () => {
  const rootDirectory = path.resolve(import.meta.dirname, '..', '..');
  const budget = JSON.parse(
    await readFile(
      path.join(import.meta.dirname, 'release-size-budget.json'),
      'utf8'
    )
  );
  const temporaryParent = path.join(rootDirectory, '.tmp');
  await mkdir(temporaryParent, { recursive: true });
  const temporaryDirectory = await mkdtemp(
    path.join(temporaryParent, 't061-release-size-')
  );
  const npmExecutable =
    process.env.npm_execpath ||
    path.join(
      path.dirname(process.execPath),
      'node_modules',
      'npm',
      'bin',
      'npm-cli.js'
    );
  const measuredArtifacts = {};

  try {
    for (const [artifactPath, artifactBudget] of Object.entries(
      budget.budget.artifacts
    )) {
      const source = await readFile(
        path.join(rootDirectory, artifactPath),
        'utf8'
      );
      const loader = artifactPath.endsWith('.css') ? 'css' : 'js';
      const minified = (
        await transform(source, {
          loader,
          minify: true,
          ...(loader === 'js' ? { target: 'es2020' } : {}),
        })
      ).code;
      const measurements = {
        rawBytes: Buffer.byteLength(source),
        minifiedBytes: Buffer.byteLength(minified),
        gzipBytes: gzipSync(minified, { level: 9 }).byteLength,
      };
      measuredArtifacts[artifactPath] = measurements;
      for (const metric of ['minifiedBytes', 'gzipBytes']) {
        if (measurements[metric] > artifactBudget[metric])
          throw new Error(
            `${artifactPath} ${metric} is ${measurements[metric]} bytes; budget is ${artifactBudget[metric]} bytes`
          );
      }
    }

    const packOutput = execFileSync(
      process.execPath,
      [
        npmExecutable,
        'pack',
        '--json',
        '--pack-destination',
        temporaryDirectory,
        '--cache',
        path.join(temporaryDirectory, '.npm-cache'),
      ],
      {
        cwd: rootDirectory,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );
    const [packResult] = JSON.parse(packOutput);
    const packageLock = JSON.parse(
      await readFile(path.join(rootDirectory, 'package-lock.json'), 'utf8')
    );
    const productionDependencyPairs = resolveProductionDependencyPairs(
      packageLock.packages
    );

    const measurements = {
      version: packResult.version,
      productionDependencyCount: productionDependencyPairs.size,
      tarballBytes: packResult.size,
      unpackedBytes: packResult.unpackedSize,
      fileCount: packResult.entryCount,
      artifacts: measuredArtifacts,
    };
    for (const metric of [
      'productionDependencyCount',
      'tarballBytes',
      'unpackedBytes',
      'fileCount',
    ]) {
      if (measurements[metric] > budget.budget[metric])
        throw new Error(
          `${metric} is ${measurements[metric]}; budget is ${budget.budget[metric]}`
        );
    }
    console.log(JSON.stringify(measurements, null, 2));
    console.log(
      `Release size budget verified against T032 ${budget.baseline.version}`
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
};

await verifyReleaseSizeBudget();

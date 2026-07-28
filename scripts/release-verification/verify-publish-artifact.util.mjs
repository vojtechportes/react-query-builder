import { execFileSync } from 'node:child_process';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
} from 'node:fs/promises';
import path from 'node:path';

const verifyPublishArtifact = async () => {
  const rootDirectory = path.resolve(import.meta.dirname, '..', '..');
  const temporaryParent = path.join(rootDirectory, '.tmp');
  await mkdir(temporaryParent, { recursive: true });
  const temporaryDirectory = await mkdtemp(
    path.join(temporaryParent, 'publish-artifact-')
  );
  const packageDirectory = path.join(temporaryDirectory, 'package');
  const npmExecutable =
    process.env.npm_execpath ||
    path.join(
      path.dirname(process.execPath),
      'node_modules',
      'npm',
      'bin',
      'npm-cli.js'
    );

  try {
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
    await mkdir(packageDirectory, { recursive: true });
    execFileSync(
      'tar',
      [
        '-xzf',
        path.join(temporaryDirectory, packResult.filename),
        '-C',
        packageDirectory,
        '--strip-components=1',
      ],
      { stdio: 'pipe' }
    );

    const manifest = JSON.parse(
      await readFile(path.join(packageDirectory, 'package.json'), 'utf8')
    );
    await access(path.join(packageDirectory, 'MIGRATION-2.0.md'));

    const expectedVersion = process.env.RELEASE_VERSION;
    if (expectedVersion && manifest.version !== expectedVersion) {
      throw new Error(
        `Packed version ${manifest.version} does not match release ${expectedVersion}`
      );
    }
    if (
      manifest.exports?.['./styles.css'] !== './dist/styles.css' ||
      manifest.style !== './dist/styles.css'
    ) {
      throw new Error('Packed stylesheet exports are missing or invalid');
    }
    if (
      manifest.dependencies?.['styled-components'] ||
      manifest.peerDependencies?.['styled-components'] ||
      manifest.optionalDependencies?.['styled-components']
    ) {
      throw new Error('Packed manifest must not depend on styled-components');
    }

    for (const exportDefinition of Object.values(manifest.exports)) {
      const exportPaths =
        typeof exportDefinition === 'string'
          ? [exportDefinition]
          : Object.values(exportDefinition);
      for (const exportPath of exportPaths) {
        await access(path.join(packageDirectory, exportPath));
      }
    }

    const filesToInspect = [];
    const directoryQueue = [path.join(packageDirectory, 'dist')];
    while (directoryQueue.length > 0) {
      const directory = directoryQueue.pop();
      if (!directory) continue;
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) directoryQueue.push(entryPath);
        else if (/\.(?:mjs|cjs|d\.mts|d\.cts|d\.ts)$/.test(entry.name))
          filesToInspect.push(entryPath);
      }
    }

    for (const fileName of filesToInspect) {
      const content = await readFile(fileName, 'utf8');
      if (/styled-components|StyledComponent/.test(content)) {
        throw new Error(
          `Packed output leaks styled-components: ${path.relative(packageDirectory, fileName)}`
        );
      }
    }
    console.log(
      `Publish artifact verified: ${Object.keys(manifest.exports).length} exports, ${filesToInspect.length} runtime/declaration files`
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
};

await verifyPublishArtifact();

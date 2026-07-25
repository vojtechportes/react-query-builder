import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const verifyPublicStylesheet = async () => {
  const rootDirectory = path.resolve(import.meta.dirname, '..', '..');
  const packageJsonPath = path.join(rootDirectory, 'package.json');
  const stylesheetPath = path.join(rootDirectory, 'dist', 'styles.css');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const stylesheet = await readFile(stylesheetPath, 'utf8');

  if (
    packageJson.style !== './dist/styles.css' ||
    packageJson.exports?.['./styles.css'] !== './dist/styles.css'
  ) {
    throw new Error(
      'The public stylesheet metadata does not resolve dist/styles.css'
    );
  }

  if (
    JSON.stringify(packageJson.sideEffects) !== JSON.stringify(['**/*.css'])
  ) {
    throw new Error('CSS side effects must be declared narrowly');
  }

  const requiredTokens = [
    '--query-builder-color-primary-default',
    '--query-builder-color-grey-300',
    '--query-builder-color-white',
    '--query-builder-spacing-sm',
    '--query-builder-root-padding',
    '--query-builder-group-padding',
    '--query-builder-rule-padding',
    '--query-builder-control-gap',
    '--query-builder-radius-sm',
    '--query-builder-root-radius',
    '--query-builder-shadow-group',
    '--query-builder-shadow-root',
    '--query-builder-control-width',
    '--query-builder-control-min-width',
    '--query-builder-control-height',
    '--query-builder-font-family',
    '--query-builder-font-size',
    '--query-builder-editor-font-family',
    '--query-builder-editor-min-height',
    '--query-builder-drop-zone-height',
    '--query-builder-motion-duration',
    '--query-builder-motion-easing',
    '--query-builder-popover-z-index',
  ];
  const missingTokens = requiredTokens.filter(
    (token) => !stylesheet.includes(`${token}:`)
  );

  if (missingTokens.length > 0) {
    throw new Error(`Missing public tokens: ${missingTokens.join(', ')}`);
  }

  if (!stylesheet.includes(':where(:root)')) {
    throw new Error(
      'Public token defaults must remain inherited and low-specificity'
    );
  }

  const npmExecutable =
    process.env.npm_execpath ||
    path.join(
      path.dirname(process.execPath),
      'node_modules',
      'npm',
      'bin',
      'npm-cli.js'
    );

  const packOutput = execFileSync(
    process.execPath,
    [npmExecutable, 'pack', '--dry-run', '--json', '--cache', '.npm-cache'],
    {
      cwd: rootDirectory,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );
  const packResult = JSON.parse(packOutput)[0];
  const packedStylesheets = packResult.files.filter(({ path: filePath }) =>
    filePath.endsWith('.css')
  );

  if (
    packedStylesheets.length !== 1 ||
    packedStylesheets[0].path !== 'dist/styles.css'
  ) {
    throw new Error(
      `Expected one packed stylesheet, received: ${packedStylesheets
        .map(({ path: filePath }) => filePath)
        .join(', ')}`
    );
  }

  console.log(
    JSON.stringify(
      {
        publicStylesheetExport: packageJson.exports['./styles.css'],
        packedStylesheets: packedStylesheets.map(
          ({ path: filePath }) => filePath
        ),
        publicTokenCount: requiredTokens.length,
        cssSideEffects: packageJson.sideEffects,
      },
      null,
      2
    )
  );
};

await verifyPublicStylesheet();

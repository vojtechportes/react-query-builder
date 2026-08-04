import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const verifyPublicStylesheet = async () => {
  const rootDirectory = path.resolve(import.meta.dirname, '..', '..');
  const packageJsonPath = path.join(rootDirectory, 'package.json');
  const stylesheetPath = path.join(rootDirectory, 'dist', 'styles.css');
  const darkModeStylesheetPath = path.join(
    rootDirectory,
    'dist',
    'dark-mode.variables.css'
  );
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const stylesheet = await readFile(stylesheetPath, 'utf8');
  const darkModeStylesheet = await readFile(darkModeStylesheetPath, 'utf8');

  if (
    packageJson.style !== './dist/styles.css' ||
    packageJson.exports?.['./styles.css'] !== './dist/styles.css' ||
    packageJson.exports?.['./dark-mode.variables.css'] !==
      './dist/dark-mode.variables.css'
  ) {
    throw new Error('The public stylesheet metadata is invalid');
  }

  if (
    JSON.stringify(packageJson.sideEffects) !== JSON.stringify(['**/*.css'])
  ) {
    throw new Error('CSS side effects must be declared narrowly');
  }

  const requiredTokens = [
    '--query-builder-color-primary-default',
    '--query-builder-color-grey-300',
    '--query-builder-color-background',
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

  if (
    !stylesheet.includes(':where(:root)') ||
    !/:where\(\[data-query-builder-color-scheme=["']light["']\]\)/.test(
      stylesheet
    )
  ) {
    throw new Error('Light defaults and explicit light tokens are invalid');
  }

  if (
    darkModeStylesheet.includes(':where(:root)') ||
    !/:where\(\[data-query-builder-color-scheme=["']dark["']\]\)/.test(
      darkModeStylesheet
    ) ||
    !requiredTokens
      .filter((token) => token.startsWith('--query-builder-color-'))
      .every((token) => darkModeStylesheet.includes(`${token}:`))
  ) {
    throw new Error('Dark mode tokens are invalid or not scoped');
  }

  if (
    stylesheet.includes('--query-builder-color-white') ||
    darkModeStylesheet.includes('--query-builder-color-white')
  ) {
    throw new Error('The removed white token is still published');
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
  const packedStylesheets = packResult.files
    .filter(({ path: filePath }) => filePath.endsWith('.css'))
    .map(({ path: filePath }) => filePath)
    .sort();
  const expectedPackedStylesheets = [
    'dist/dark-mode.variables.css',
    'dist/styles.css',
  ];

  if (
    JSON.stringify(packedStylesheets) !==
    JSON.stringify(expectedPackedStylesheets)
  ) {
    throw new Error(
      `Expected public stylesheets, received: ${packedStylesheets.join(', ')}`
    );
  }

  console.log(
    JSON.stringify(
      {
        publicStylesheetExports: {
          darkMode: packageJson.exports['./dark-mode.variables.css'],
          styles: packageJson.exports['./styles.css'],
        },
        packedStylesheets,
        publicTokenCount: requiredTokens.length,
        cssSideEffects: packageJson.sideEffects,
      },
      null,
      2
    )
  );
};

await verifyPublicStylesheet();

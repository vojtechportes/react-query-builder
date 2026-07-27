import { execFileSync } from 'node:child_process';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const canonicalPackageName = '@vojtechportes/react-query-builder';

const verifyPackedReleaseConsumers = async () => {
  const rootDirectory = path.resolve(import.meta.dirname, '..', '..');
  const rootRequire = createRequire(path.join(rootDirectory, 'package.json'));
  const exampleRequire = createRequire(
    path.join(rootDirectory, 'example', 'package.json')
  );
  const viteEntry = exampleRequire.resolve('vite');
  const typescriptEntry = rootRequire.resolve('typescript/bin/tsc');
  const { build } = await import(pathToFileURL(viteEntry).href);
  const temporaryParent = path.join(rootDirectory, '.tmp');

  await mkdir(temporaryParent, { recursive: true });

  const temporaryDirectory = await mkdtemp(
    path.join(temporaryParent, 't059-packed-release-consumers-')
  );
  const consumerDirectory = path.join(temporaryDirectory, 'consumer');
  const packageDirectory = path.join(
    consumerDirectory,
    'node_modules',
    '@vojtechportes',
    'react-query-builder'
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
        '.npm-cache',
      ],
      {
        cwd: rootDirectory,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );
    const [{ filename: packageArchiveName }] = JSON.parse(packOutput);
    const packageArchivePath = path.join(
      temporaryDirectory,
      packageArchiveName
    );

    await mkdir(packageDirectory, { recursive: true });
    execFileSync(
      'tar',
      [
        '-xzf',
        packageArchivePath,
        '-C',
        packageDirectory,
        '--strip-components=1',
      ],
      { stdio: 'pipe' }
    );

    const sourceManifest = JSON.parse(
      await readFile(path.join(rootDirectory, 'package.json'), 'utf8')
    );
    const packedManifest = JSON.parse(
      await readFile(path.join(packageDirectory, 'package.json'), 'utf8')
    );
    const exportSubpaths = Object.keys(sourceManifest.exports);

    if (
      JSON.stringify(Object.keys(packedManifest.exports)) !==
      JSON.stringify(exportSubpaths)
    ) {
      throw new Error(
        'Packed manifest exports do not match the source manifest'
      );
    }

    for (const subpath of exportSubpaths) {
      const exportDefinition = packedManifest.exports[subpath];
      const exportPaths =
        typeof exportDefinition === 'string'
          ? [exportDefinition]
          : Object.values(exportDefinition);

      for (const exportPath of exportPaths) {
        await access(path.join(packageDirectory, exportPath));
      }
    }

    const runtimeSpecifiers = exportSubpaths
      .filter((subpath) => subpath !== './styles.css')
      .map((subpath) =>
        subpath === '.'
          ? canonicalPackageName
          : `${canonicalPackageName}${subpath.slice(1)}`
      );
    const runtimeSpecifiersJson = JSON.stringify(runtimeSpecifiers);

    await writeFile(
      path.join(consumerDirectory, 'all-exports.html'),
      '<div id="app"></div><script type="module" src="/all-exports.js"></script>\n'
    );
    await writeFile(
      path.join(consumerDirectory, 'all-exports.js'),
      `${runtimeSpecifiers
        .map(
          (specifier, index) =>
            `import * as export${index} from '${specifier}';`
        )
        .join('\n')}\nconst loadedExports = [${runtimeSpecifiers
        .map((_, index) => `export${index}`)
        .join(
          ', '
        )}];\nif (loadedExports.some(exports => Object.keys(exports).length === 0)) throw new Error('An ESM entry exposed no exports');\ndocument.querySelector('#app').textContent = String(loadedExports.length);\n`
    );
    await writeFile(
      path.join(consumerDirectory, 'verify-exports.cjs'),
      `const specifiers = ${runtimeSpecifiersJson};\nfor (const specifier of specifiers) {\n  const exports = require(specifier);\n  if (Object.keys(exports).length === 0) throw new Error(\`No CJS exports from \${specifier}\`);\n}\nconsole.log(JSON.stringify({ format: 'cjs', exports: specifiers.length }));\n`
    );
    await writeFile(
      path.join(consumerDirectory, 'exports.ts'),
      `${runtimeSpecifiers
        .map(
          (specifier, index) =>
            `import * as export${index} from '${specifier}';`
        )
        .join('\n')}\nexport const loadedExports = [${runtimeSpecifiers
        .map((_, index) => `export${index}`)
        .join(', ')}];\n`
    );
    await writeFile(
      path.join(consumerDirectory, 'tsconfig.json'),
      `${JSON.stringify(
        {
          compilerOptions: {
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            target: 'ES2022',
            jsx: 'react-jsx',
            strict: true,
            skipLibCheck: true,
            noEmit: true,
          },
          include: ['exports.ts'],
        },
        null,
        2
      )}\n`
    );

    const allExportsOutputDirectory = path.join(
      consumerDirectory,
      'dist-all-exports'
    );

    await build({
      root: consumerDirectory,
      logLevel: 'silent',
      build: {
        outDir: allExportsOutputDirectory,
        emptyOutDir: true,
        rollupOptions: {
          input: path.join(consumerDirectory, 'all-exports.html'),
        },
      },
    });

    const allExportsAssets = await readdir(
      path.join(allExportsOutputDirectory, 'assets')
    );
    const esmResult = {
      format: 'esm-vite',
      exports: runtimeSpecifiers.length,
      javascriptAssets: allExportsAssets.filter((fileName) =>
        fileName.endsWith('.js')
      ).length,
    };
    const cjsResult = execFileSync(
      process.execPath,
      [path.join(consumerDirectory, 'verify-exports.cjs')],
      { cwd: consumerDirectory, encoding: 'utf8' }
    ).trim();

    execFileSync(
      process.execPath,
      [typescriptEntry, '-p', path.join(consumerDirectory, 'tsconfig.json')],
      { cwd: consumerDirectory, stdio: 'pipe' }
    );

    const consumerResults = {};

    for (const includeStyles of [true, false]) {
      const consumerName = includeStyles ? 'with-css' : 'without-css';
      const clientOutputDirectory = path.join(
        consumerDirectory,
        `dist-client-${consumerName}`
      );
      const stylesheetImport = includeStyles
        ? `import '${canonicalPackageName}/styles.css';\n`
        : '';

      await writeFile(
        path.join(consumerDirectory, `index-${consumerName}.html`),
        `<div id="app"></div><script type="module" src="/main-${consumerName}.js"></script>\n`
      );
      await writeFile(
        path.join(consumerDirectory, `main-${consumerName}.js`),
        `${stylesheetImport}import { Builder } from '${canonicalPackageName}';\ndocument.querySelector('#app').textContent = typeof Builder;\n`
      );

      await build({
        root: consumerDirectory,
        logLevel: 'silent',
        build: {
          outDir: clientOutputDirectory,
          emptyOutDir: true,
          rollupOptions: {
            input: path.join(consumerDirectory, `index-${consumerName}.html`),
          },
        },
      });

      const clientAssetDirectory = path.join(clientOutputDirectory, 'assets');
      const clientAssetNames = await readdir(clientAssetDirectory);
      const cssAssets = clientAssetNames.filter((fileName) =>
        fileName.endsWith('.css')
      );
      const html = await readFile(
        path.join(clientOutputDirectory, `index-${consumerName}.html`),
        'utf8'
      );

      if (includeStyles && cssAssets.length !== 1) {
        throw new Error(
          `Expected one CSS asset for the styled consumer, received ${cssAssets.length}`
        );
      }

      if (!includeStyles && cssAssets.length !== 0) {
        throw new Error(
          `Expected no CSS asset for the unstyled consumer, received ${cssAssets.length}`
        );
      }

      if (includeStyles !== html.includes('.css')) {
        throw new Error(
          `${consumerName} HTML has an invalid stylesheet reference`
        );
      }

      consumerResults[consumerName] = {
        cssAssets,
        clientBuild: 'passed',
      };
    }

    await writeFile(
      path.join(consumerDirectory, 'verify-hydration.mjs'),
      `import { JSDOM } from 'jsdom';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { Builder, ThemeProvider } from '${canonicalPackageName}';
const variableName = '--query-builder-color-primary-default';
const explicitColor = '#123456';
const providerColor = '#abcdef';
const inheritedColor = '#654321';
const builderProps = { fields: [], data: [] };
const HydrationSentinel = () => React.createElement('span', { 'data-hydration-sentinel': 'pending', ref: node => node?.setAttribute('data-hydration-sentinel', 'committed') });
const element = React.createElement('div', null,
  React.createElement('div', { 'data-precedence-case': 'explicit', style: { [variableName]: inheritedColor } }, React.createElement(ThemeProvider, { colors: { primary: { default: providerColor } } }, React.createElement(Builder, { ...builderProps, style: { [variableName]: explicitColor } }))),
  React.createElement('div', { 'data-precedence-case': 'provider', style: { [variableName]: inheritedColor } }, React.createElement(ThemeProvider, { colors: { primary: { default: providerColor } } }, React.createElement(Builder, builderProps))),
  React.createElement('div', { 'data-precedence-case': 'inherited', style: { [variableName]: inheritedColor } }, React.createElement(Builder, builderProps)),
  React.createElement(HydrationSentinel)
);
const serverHtml = renderToString(element);
const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root">' + serverHtml + '</div></body></html>', { url: 'https://consumer.test/' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
const warnings = [];
const runtimeWarningPattern = /hydration|hydrated|did not match|server html|classname|runtime style|styled-components|early update/i;
const originalError = console.error;
const originalWarn = console.warn;
const captureWarning = (...messages) => { const warning = messages.map(String).join(' '); if (runtimeWarningPattern.test(warning)) warnings.push(warning); };
console.error = captureWarning;
console.warn = captureWarning;
const recoverableErrors = [];
const root = hydrateRoot(document.getElementById('root'), element, { onRecoverableError: error => recoverableErrors.push(String(error)) });
for (let attempt = 0; attempt < 100 && document.querySelector('[data-hydration-sentinel="committed"]') === null; attempt += 1) {
  await new Promise(resolve => setTimeout(resolve, 0));
}
if (document.querySelector('[data-hydration-sentinel="committed"]') === null) throw new Error('Packed hydration did not commit');
const explicitBuilder = document.querySelector('[data-precedence-case="explicit"] [data-query-builder="root"]');
const providerBuilder = document.querySelector('[data-precedence-case="provider"] [data-query-builder="root"]');
const inheritedBuilder = document.querySelector('[data-precedence-case="inherited"] [data-query-builder="root"]');
if (explicitBuilder?.style.getPropertyValue(variableName) !== explicitColor) throw new Error('Explicit Builder variable did not win precedence');
if (providerBuilder?.style.getPropertyValue(variableName) !== providerColor) throw new Error('ThemeProvider variable did not win over inherited variables');
if (inheritedBuilder?.style.getPropertyValue(variableName) !== '') throw new Error('Builder unexpectedly replaced an inherited variable');
if (inheritedBuilder?.parentElement?.style.getPropertyValue(variableName) !== inheritedColor) throw new Error('Inherited variable fallback was not preserved');
if (document.head.querySelectorAll('style, link[rel="stylesheet"]').length !== 0) throw new Error('The no-CSS packed consumer injected runtime styles');
root.unmount();
await new Promise(resolve => setTimeout(resolve, 0));
console.error = originalError;
console.warn = originalWarn;
if (recoverableErrors.length || warnings.length) throw new Error(JSON.stringify({ recoverableErrors, warnings }));
console.log(JSON.stringify({ hydration: 'passed', hydrationCommit: 'confirmed', runtimeStyleInjection: 'none', variablePrecedence: ['explicit', 'provider', 'inherited'] }));
`
    );
    const hydrationResult = execFileSync(
      process.execPath,
      [path.join(consumerDirectory, 'verify-hydration.mjs')],
      { cwd: consumerDirectory, encoding: 'utf8' }
    ).trim();

    console.log(
      JSON.stringify(
        {
          packedExports: exportSubpaths.length,
          esm: esmResult,
          cjs: JSON.parse(cjsResult),
          typescript: 'passed',
          consumers: consumerResults,
          hydration: JSON.parse(hydrationResult),
        },
        null,
        2
      )
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
};

await verifyPackedReleaseConsumers();

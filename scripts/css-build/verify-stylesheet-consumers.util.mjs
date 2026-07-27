import { execFileSync } from 'node:child_process';
import {
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

const verifyStylesheetConsumers = async () => {
  const rootDirectory = path.resolve(import.meta.dirname, '..', '..');
  const websiteRequire = createRequire(
    path.join(rootDirectory, 'website', 'package.json')
  );
  const viteEntry = websiteRequire.resolve('vite');
  const { build } = await import(pathToFileURL(viteEntry).href);
  const temporaryParent = path.join(rootDirectory, '.tmp');

  await mkdir(temporaryParent, { recursive: true });

  const temporaryDirectory = await mkdtemp(
    path.join(temporaryParent, 't035-stylesheet-consumers-')
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
  const results = {};

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

    for (const includeStyles of [true, false]) {
      const consumerName = includeStyles ? 'with-css' : 'without-css';
      const clientOutputDirectory = path.join(
        consumerDirectory,
        `dist-client-${consumerName}`
      );
      const ssrOutputDirectory = path.join(
        consumerDirectory,
        `dist-ssr-${consumerName}`
      );
      const stylesheetImport = includeStyles
        ? "import '@vojtechportes/react-query-builder/styles.css';\n"
        : '';

      await mkdir(consumerDirectory, { recursive: true });
      await writeFile(
        path.join(consumerDirectory, `index-${consumerName}.html`),
        `<div id="app"></div><script type="module" src="/main-${consumerName}.js"></script>\n`
      );
      await writeFile(
        path.join(consumerDirectory, `main-${consumerName}.js`),
        `${stylesheetImport}import { Builder } from '@vojtechportes/react-query-builder';\ndocument.querySelector('#app').textContent = typeof Builder;\n`
      );
      await writeFile(
        path.join(consumerDirectory, `ssr-${consumerName}.js`),
        `${stylesheetImport}import React from 'react';\nimport { renderToString } from 'react-dom/server';\nimport { Builder } from '@vojtechportes/react-query-builder';\nconsole.log(renderToString(React.createElement(Builder, { fields: [], data: [] })));\n`
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
      await build({
        root: consumerDirectory,
        logLevel: 'silent',
        build: {
          ssr: path.join(consumerDirectory, `ssr-${consumerName}.js`),
          outDir: ssrOutputDirectory,
          emptyOutDir: true,
          rollupOptions: {
            output: {
              entryFileNames: 'ssr.mjs',
            },
          },
        },
        ssr: {
          noExternal: true,
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
      const ssrOutput = execFileSync(
        process.execPath,
        [path.join(ssrOutputDirectory, 'ssr.mjs')],
        { encoding: 'utf8' }
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

      if (!ssrOutput.includes('data-query-builder="root"')) {
        throw new Error(`${consumerName} packed SSR output was invalid`);
      }

      results[consumerName] = {
        clientCssAssets: cssAssets,
        packedClientBuild: 'passed',
        packedSsrRender: 'passed',
      };
    }

    console.log(JSON.stringify(results, null, 2));
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
};

await verifyStylesheetConsumers();

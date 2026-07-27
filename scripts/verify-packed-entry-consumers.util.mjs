import { execFileSync } from 'node:child_process';
import {
  cp,
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

const verifyPackedEntryConsumers = async () => {
  const rootDirectory = path.resolve(import.meta.dirname, '..');
  const temporaryParent = path.join(rootDirectory, '.tmp');

  await mkdir(temporaryParent, { recursive: true });

  const temporaryDirectory = await mkdtemp(
    path.join(temporaryParent, 't055-packed-entry-consumers-')
  );
  const packageName = '@vojtechportes/react-query-builder';
  const optionalPeers = [
    '@ant-design/icons',
    '@emotion/react',
    '@emotion/styled',
    '@fluentui/react',
    '@mantine/core',
    '@mantine/hooks',
    '@mui/icons-material',
    '@mui/material',
    '@radix-ui/react-icons',
    '@radix-ui/themes',
    'antd',
    'bootstrap-icons',
    'monaco-editor',
  ];
  const entries = [
    ['root', '', 'index', 'Builder', 'ui', 'current', []],
    [
      'antd-v5',
      '/antd/v5',
      'antd/v5/index',
      'components',
      'ui',
      'antd-v5',
      ['@ant-design/icons', 'antd'],
    ],
    [
      'antd-v6',
      '/antd/v6',
      'antd/v6/index',
      'components',
      'ui',
      'current',
      ['@ant-design/icons', 'antd'],
    ],
    [
      'bootstrap-v5',
      '/bootstrap/v5',
      'bootstrap/v5/index',
      'components',
      'ui',
      'current',
      [],
    ],
    [
      'fluentui-v8',
      '/fluentui/v8',
      'fluentui/v8/index',
      'components',
      'ui',
      'current',
      ['@fluentui/react'],
    ],
    [
      'mantine-v8',
      '/mantine/v8',
      'mantine/v8/index',
      'components',
      'ui',
      'current',
      ['@mantine/core', '@mantine/hooks'],
    ],
    [
      'mantine-v9',
      '/mantine/v9',
      'mantine/v9/index',
      'components',
      'ui',
      'mantine-v9',
      ['@mantine/core', '@mantine/hooks'],
    ],
    [
      'mui-v7',
      '/mui/v7',
      'mui/v7/index',
      'components',
      'ui',
      'mui-v7',
      [
        '@emotion/react',
        '@emotion/styled',
        '@mui/icons-material',
        '@mui/material',
      ],
    ],
    [
      'mui-v9',
      '/mui/v9',
      'mui/v9/index',
      'components',
      'ui',
      'current',
      [
        '@emotion/react',
        '@emotion/styled',
        '@mui/icons-material',
        '@mui/material',
      ],
    ],
    [
      'radix-v1',
      '/radix/v1',
      'radix/v1/index',
      'components',
      'ui',
      'current',
      ['@radix-ui/react-icons', '@radix-ui/themes'],
    ],
    [
      'monaco',
      '/monaco',
      'monaco/index',
      'MonacoTextModeEditor',
      'ui',
      'current',
      ['monaco-editor'],
    ],
    [
      'parse-query',
      '/parseQuery',
      'parseQuery',
      'parseQuery',
      'non-ui',
      'current',
      [],
    ],
    [
      'format-query',
      '/formatQuery',
      'formatQuery',
      'formatQuery',
      'non-ui',
      'current',
      [],
    ],
    ...[
      'en-US',
      'fr-FR',
      'it-IT',
      'de-DE',
      'es-ES',
      'pt-PT',
      'cs-CZ',
      'sk-SK',
      'zh-CN',
      'zh-TW',
    ].map((locale) => [
      `locale-${locale.toLowerCase()}`,
      `/locale/${locale}`,
      `locale/${locale}/index`,
      'strings',
      'non-ui',
      'current',
      [],
    ]),
  ].map(
    ([
      name,
      subpath,
      distributionPath,
      expectedExport,
      kind,
      configuration,
      allowedPeers,
    ]) => ({
      name,
      subpath,
      distributionPath,
      expectedExport,
      kind,
      configuration,
      allowedPeers,
    })
  );
  const configurations = [
    ['current', []],
    [
      'antd-v5',
      [
        '@ant-design/icons@5.6.1',
        'antd@5.29.3',
        'react@18.3.1',
        'react-dom@18.3.1',
      ],
    ],
    [
      'mantine-v9',
      [
        '@mantine/core@9.2.2',
        '@mantine/hooks@9.2.2',
        'react@19.2.6',
        'react-dom@19.2.6',
      ],
    ],
    [
      'mui-v7',
      [
        '@emotion/react@11.14.0',
        '@emotion/styled@11.14.1',
        '@mui/icons-material@7.3.11',
        '@mui/material@7.3.11',
        'react@18.3.1',
        'react-dom@18.3.1',
      ],
    ],
  ].map(([name, install]) => ({ name, install }));
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
    const packDirectory = path.join(temporaryDirectory, 'pack');

    await mkdir(packDirectory, { recursive: true });

    const packOutput = execFileSync(
      process.execPath,
      [
        npmExecutable,
        'pack',
        '--json',
        '--pack-destination',
        packDirectory,
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
    const extractedPackageDirectory = path.join(packDirectory, 'package');

    await mkdir(extractedPackageDirectory, { recursive: true });
    execFileSync(
      'tar',
      [
        '-xzf',
        path.join(packDirectory, packResult.filename),
        '-C',
        extractedPackageDirectory,
        '--strip-components=1',
      ],
      { stdio: 'pipe' }
    );

    const packedManifest = JSON.parse(
      await readFile(
        path.join(extractedPackageDirectory, 'package.json'),
        'utf8'
      )
    );

    for (const exportSubpath of [
      '.',
      './styles.css',
      ...entries
        .map(({ subpath }) => `.${subpath}`)
        .filter((value) => value !== '.'),
    ]) {
      if (!(exportSubpath in packedManifest.exports)) {
        throw new Error(`Packed manifest is missing export ${exportSubpath}`);
      }
    }

    const distributionDirectory = path.join(extractedPackageDirectory, 'dist');

    for (const entry of entries) {
      for (const extension of ['mjs', 'cjs']) {
        const queue = [
          path.join(
            distributionDirectory,
            `${entry.distributionPath}.${extension}`
          ),
        ];
        const visited = new Set();
        const reachedOptionalPeers = new Set();

        while (queue.length > 0) {
          const fileName = queue.pop();

          if (!fileName || visited.has(fileName)) {
            continue;
          }

          visited.add(fileName);

          const source = await readFile(fileName, 'utf8');

          if (entry.kind === 'non-ui' && /\bclsx\b|\.css\b/.test(source)) {
            throw new Error(
              `${entry.name} ${extension.toUpperCase()} is not CSS/clsx-free`
            );
          }

          for (const match of source.matchAll(
            /(?:from\s+|import\s*\(|require\s*\()\s*['"]([^'"]+)['"]/g
          )) {
            const specifier = match[1];

            if (specifier.startsWith('.')) {
              const dependencyPath = path.resolve(
                path.dirname(fileName),
                specifier
              );

              queue.push(
                path.extname(dependencyPath)
                  ? dependencyPath
                  : `${dependencyPath}.${extension}`
              );
            } else {
              const peer = optionalPeers.find(
                (value) =>
                  specifier === value || specifier.startsWith(`${value}/`)
              );

              if (peer) {
                reachedOptionalPeers.add(peer);
              }
            }
          }
        }

        const unexpectedPeers = [...reachedOptionalPeers].filter(
          (peer) => !entry.allowedPeers.includes(peer)
        );

        if (unexpectedPeers.length > 0) {
          throw new Error(
            `${entry.name} reaches unrelated optional peers: ${unexpectedPeers.join(
              ', '
            )}`
          );
        }
      }
    }

    const exampleRequire = createRequire(
      path.join(rootDirectory, 'example', 'package.json')
    );
    const { build } = await import(
      pathToFileURL(exampleRequire.resolve('vite')).href
    );

    for (const configuration of configurations) {
      const consumerDirectory = path.join(
        temporaryDirectory,
        'consumers',
        configuration.name
      );
      const configurationEntries = entries.filter(
        (entry) => entry.configuration === configuration.name
      );

      await mkdir(consumerDirectory, { recursive: true });
      await writeFile(
        path.join(consumerDirectory, 'package.json'),
        JSON.stringify({
          name: `t055-${configuration.name}-consumer`,
          private: true,
          type: 'module',
        })
      );

      if (configuration.install.length > 0) {
        execFileSync(
          process.execPath,
          [
            npmExecutable,
            'install',
            '--no-save',
            '--package-lock=false',
            '--ignore-scripts',
            '--legacy-peer-deps',
            '--cache',
            path.join(temporaryDirectory, '.npm-cache'),
            ...configuration.install,
          ],
          {
            cwd: consumerDirectory,
            stdio: 'pipe',
            timeout: 180000,
          }
        );
      }

      const packedPackageDirectory = path.join(
        consumerDirectory,
        'node_modules',
        '@vojtechportes',
        'react-query-builder'
      );

      await mkdir(path.dirname(packedPackageDirectory), { recursive: true });
      await cp(extractedPackageDirectory, packedPackageDirectory, {
        recursive: true,
      });

      const imports = configurationEntries
        .map(
          (entry) =>
            `import * as ${entry.name.replaceAll('-', '_')} from '${packageName}${entry.subpath}';`
        )
        .join('\n');
      const values = configurationEntries
        .map(
          (entry) =>
            `${entry.name.replaceAll('-', '_')}.${entry.expectedExport}`
        )
        .join(',\n  ');

      await writeFile(
        path.join(consumerDirectory, 'index.ts'),
        `${imports}\n\nexport const resolvedExports = [\n  ${values},\n];\n`
      );
      await writeFile(
        path.join(consumerDirectory, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: {
            jsx: 'react-jsx',
            lib: ['dom', 'es2022'],
            module: 'esnext',
            moduleResolution: 'bundler',
            noEmit: true,
            skipLibCheck: false,
            strict: true,
            target: 'es2022',
          },
          include: ['index.ts'],
        })
      );
      execFileSync(
        process.execPath,
        [
          path.join(rootDirectory, 'node_modules', 'typescript', 'bin', 'tsc'),
          '-p',
          path.join(consumerDirectory, 'tsconfig.json'),
        ],
        {
          cwd: consumerDirectory,
          stdio: 'pipe',
          timeout: 120000,
        }
      );

      const runtimeChecks = configurationEntries
        .map((entry) => {
          const esmCheck =
            entry.kind === 'non-ui' ||
            entry.name === 'root' ||
            entry.name === 'monaco'
              ? `const esmModule = await import(specifier);

  if (!esmModule.${entry.expectedExport}) {
    throw new Error('${entry.name} failed native ESM resolution');
  }

  `
              : '';

          return `{
  const specifier = '${packageName}${entry.subpath}';
  const cjsModule = consumerRequire(specifier);

  ${esmCheck}if (!cjsModule.${entry.expectedExport}) {
    throw new Error('${entry.name} failed CJS resolution');
  }
}`;
        })
        .join('\n\n');
      await writeFile(
        path.join(consumerDirectory, 'runtime-check.mjs'),
        `import { createRequire } from 'node:module';

const consumerRequire = createRequire(import.meta.url);

${runtimeChecks}
`
      );
      execFileSync(
        process.execPath,
        [path.join(consumerDirectory, 'runtime-check.mjs')],
        {
          cwd: consumerDirectory,
          stdio: 'pipe',
          timeout: 120000,
        }
      );

      for (const entry of configurationEntries) {
        const clientEntry = path.join(
          consumerDirectory,
          `client-${entry.name}.mjs`
        );
        const outputDirectory = path.join(
          consumerDirectory,
          `dist-${entry.name}`
        );

        await writeFile(
          clientEntry,
          `import { ${entry.expectedExport} } from '${packageName}${entry.subpath}';\nglobalThis.__t055 = typeof ${entry.expectedExport};\n`
        );
        await build({
          root: consumerDirectory,
          configFile: false,
          logLevel: 'silent',
          build: {
            emptyOutDir: true,
            lib: {
              entry: clientEntry,
              formats: ['es'],
              fileName: 'entry',
            },
            outDir: outputDirectory,
          },
          resolve: {
            dedupe: ['react', 'react-dom'],
          },
        });

        const clientCssFiles = (await readdir(outputDirectory)).filter(
          (fileName) => fileName.endsWith('.css')
        );
        const clientCssSources = await Promise.all(
          clientCssFiles.map((fileName) =>
            readFile(path.join(outputDirectory, fileName), 'utf8')
          )
        );

        if (
          (entry.kind === 'non-ui' && clientCssFiles.length > 0) ||
          clientCssSources.some((source) =>
            source.includes('@layer react-query-builder')
          )
        ) {
          throw new Error(`${entry.name} emitted package CSS implicitly`);
        }
        if (entry.kind === 'ui') {
          const ssrEntry = path.join(
            consumerDirectory,
            `ssr-${entry.name}.mjs`
          );
          const ssrOutputDirectory = path.join(
            consumerDirectory,
            `dist-ssr-${entry.name}`
          );
          const providerImport = entry.name.startsWith('mantine-')
            ? "import { MantineProvider } from '@mantine/core';\n"
            : entry.name === 'radix-v1'
              ? "import { Theme } from '@radix-ui/themes';\n"
              : '';
          const renderExpression =
            entry.name === 'root'
              ? 'React.createElement(entryModule.Builder, { fields: [], data: [] })'
              : entry.name === 'monaco'
                ? `React.createElement(entryModule.MonacoTextModeEditor, {
    value: 'FIELD = 1',
    diagnostics: [],
    errorMessage: null,
    onChange: () => {},
  })`
                : entry.name.startsWith('mantine-')
                  ? `React.createElement(
    MantineProvider,
    null,
    React.createElement(entryModule.components.Text, null, '${entry.name}')
  )`
                  : entry.name === 'radix-v1'
                    ? `React.createElement(
    Theme,
    null,
    React.createElement(entryModule.components.Text, null, '${entry.name}')
  )`
                    : `React.createElement(
    entryModule.components.Text,
    null,
    '${entry.name}'
  )`;
          const expectedMarkup =
            entry.name === 'root'
              ? 'data-query-builder="root"'
              : entry.name === 'monaco'
                ? 'rqb-monaco-text-mode-editor'
                : entry.name;

          await writeFile(
            ssrEntry,
            `import React from 'react';
import { renderToString } from 'react-dom/server';
import * as entryModule from '${packageName}${entry.subpath}';
${providerImport}
const markup = renderToString(
  ${renderExpression}
);

if (!markup.includes('${expectedMarkup}')) {
  throw new Error('${entry.name} bundled ESM SSR render failed');
}

console.log(markup);
`
          );
          await build({
            root: consumerDirectory,
            configFile: false,
            logLevel: 'silent',
            build: {
              emptyOutDir: true,
              outDir: ssrOutputDirectory,
              rollupOptions: {
                input: ssrEntry,
                output: {
                  entryFileNames: 'entry.mjs',
                },
              },
              ssr: ssrEntry,
            },
            resolve: {
              dedupe: ['react', 'react-dom'],
            },
            ssr: {
              noExternal: true,
            },
          });
          execFileSync(
            process.execPath,
            [path.join(ssrOutputDirectory, 'entry.mjs')],
            {
              cwd: consumerDirectory,
              stdio: 'pipe',
              timeout: 120000,
            }
          );
        }
      }

      results[configuration.name] = {
        entries: configurationEntries.length,
        client: 'passed',
        cjs: 'passed',
        esm: 'passed',
        ssr: 'passed',
        typescript: 'passed',
      };
    }

    const currentConsumerDirectory = path.join(
      temporaryDirectory,
      'consumers',
      'current'
    );
    const styledEntry = path.join(currentConsumerDirectory, 'styled.mjs');
    const styledOutput = path.join(currentConsumerDirectory, 'dist-styled');
    const uiImports = entries
      .filter((entry) => entry.kind === 'ui')
      .map(
        (entry) =>
          `import * as ${entry.name.replaceAll('-', '_')} from '${packageName}${entry.subpath}';`
      )
      .join('\n');

    await writeFile(
      styledEntry,
      `import '${packageName}/styles.css';\n${uiImports}\n`
    );
    await build({
      root: currentConsumerDirectory,
      configFile: false,
      logLevel: 'silent',
      build: {
        emptyOutDir: true,
        lib: {
          entry: styledEntry,
          formats: ['es'],
          fileName: 'entry',
        },
        outDir: styledOutput,
      },
      resolve: {
        dedupe: ['react', 'react-dom'],
      },
    });

    const cssAssets = (await readdir(styledOutput)).filter((fileName) =>
      fileName.endsWith('.css')
    );
    const packageCssAssets = [];

    for (const cssAsset of cssAssets) {
      const source = await readFile(path.join(styledOutput, cssAsset), 'utf8');

      if (source.includes('@layer react-query-builder')) {
        const tokenOccurrences =
          source.match(/--query-builder-color-primary-default:\s*#3f51b5/g)
            ?.length || 0;

        if (tokenOccurrences !== 1) {
          throw new Error(
            `Expected package stylesheet content once, received ${tokenOccurrences}`
          );
        }

        packageCssAssets.push(cssAsset);
      }
    }

    if (packageCssAssets.length !== 1) {
      throw new Error(
        `Expected one package CSS asset for all UI entries, received ${packageCssAssets.length}`
      );
    }

    results.publicEntries = entries.length;
    results.nonUiEntriesCssAndClsxFree = entries.filter(
      (entry) => entry.kind === 'non-ui'
    ).length;
    results.optionalPeerIsolation = 'passed';
    results.styledCssAssets = packageCssAssets.length;

    console.log(JSON.stringify(results, null, 2));
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
};

await verifyPackedEntryConsumers();

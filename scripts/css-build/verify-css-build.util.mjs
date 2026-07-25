import { createRequire } from 'node:module';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const verifyCssBuild = async () => {
  const rootDirectory = path.resolve(import.meta.dirname, '..', '..');
  const distributionDirectory = path.join(rootDirectory, 'dist');
  const pendingDirectories = [distributionDirectory];
  const distributionFiles = [];

  while (pendingDirectories.length > 0) {
    const directory = pendingDirectories.pop();

    if (!directory) {
      continue;
    }

    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        pendingDirectories.push(entryPath);
      } else {
        distributionFiles.push(entryPath);
      }
    }
  }

  distributionFiles.sort();

  const cssFiles = distributionFiles.filter((fileName) =>
    fileName.endsWith('.css')
  );
  const expectedStylesheet = path.join(distributionDirectory, 'styles.css');

  if (cssFiles.length !== 1 || cssFiles[0] !== expectedStylesheet) {
    throw new Error(
      `Expected exactly dist/styles.css, received: ${cssFiles
        .map((fileName) => path.relative(rootDirectory, fileName))
        .join(', ')}`
    );
  }

  const stylesheet = await readFile(expectedStylesheet, 'utf8');

  if (!stylesheet.includes('@layer react-query-builder')) {
    throw new Error('dist/styles.css is missing the stable layer declaration');
  }

  const javascriptFiles = distributionFiles.filter((fileName) =>
    /\.(?:cjs|mjs)$/.test(fileName)
  );
  const cssModuleContracts = [
    {
      name: 'DropZone',
      modulePattern:
        /#region src\/drop-zone\/drop-zone\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: [
        'anchor',
        'active',
        'dragging',
        'empty',
        'dropZone',
        'inner',
        'transitionDisabled',
      ],
      entryFiles: ['index.mjs', 'index.cjs'],
      uniqueRuleKeys: ['anchor'],
    },
    {
      name: 'Button',
      modulePattern:
        /#region src\/button\/button\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['button'],
      entryFiles: ['index.mjs', 'index.cjs'],
      uniqueRuleKeys: ['button'],
    },
    {
      name: 'SecondaryButton',
      modulePattern:
        /#region src\/secondary-button\/secondary-button\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['secondaryButton'],
      entryFiles: ['index.mjs', 'index.cjs'],
      uniqueRuleKeys: ['secondaryButton'],
    },
    {
      name: 'OutlinedButton',
      modulePattern:
        /#region src\/outlined-button\/outlined-button\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['outlinedButton'],
      entryFiles: ['index.mjs', 'index.cjs'],
      uniqueRuleKeys: ['outlinedButton'],
    },
    {
      name: 'CloneButton',
      modulePattern:
        /#region src\/clone-button\/clone-button\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['cloneButton', 'disabled'],
      entryFiles: ['index.mjs', 'index.cjs'],
      uniqueRuleKeys: ['cloneButton'],
      requiredSelectors: [
        { key: 'cloneButton', suffix: ':hover' },
        { key: 'cloneButton', suffix: ':focus-visible' },
        { key: 'disabled', suffix: ':hover' },
      ],
    },
    {
      name: 'LockToggle',
      modulePattern:
        /#region src\/lock-toggle\/lock-toggle\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['all', 'disabled', 'lockToggle', 'self', 'unlocked'],
      entryFiles: ['index.mjs', 'index.cjs'],
      uniqueRuleKeys: ['all', 'lockToggle', 'self', 'unlocked'],
      requiredSelectors: [
        { key: 'unlocked', suffix: ':hover' },
        { key: 'self', suffix: ':hover' },
        { key: 'all', suffix: ':hover' },
        { key: 'lockToggle', suffix: ':focus-visible' },
        { key: 'disabled', suffix: ':hover' },
      ],
    },
    {
      name: 'ANTD text-mode toggle',
      modulePattern:
        /#region src\/antd\/shared\/components\/antd-text-mode-toggle-content\/antd-text-mode-toggle-content\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['content', 'label'],
      entryFiles: [
        'antd/v5/index.mjs',
        'antd/v5/index.cjs',
        'antd/v6/index.mjs',
        'antd/v6/index.cjs',
      ],
      uniqueRuleKeys: ['content', 'label'],
    },
  ];
  const cssModuleMappings = new Map();

  for (const contract of cssModuleContracts) {
    const entryMappings = [];

    for (const relativeEntry of contract.entryFiles) {
      const queue = [path.join(distributionDirectory, relativeEntry)];
      const visited = new Set();
      let mappings;

      while (queue.length > 0) {
        const fileName = queue.pop();

        if (!fileName || visited.has(fileName)) {
          continue;
        }

        visited.add(fileName);

        const source = await readFile(fileName, 'utf8');
        const moduleMatch = source.match(contract.modulePattern);

        if (moduleMatch) {
          mappings = Object.fromEntries(
            Array.from(
              moduleMatch[1].matchAll(/["']([^"']+)["']:\s*["']([^"']+)["']/g),
              (match) => [match[1], match[2]]
            )
          );
        }

        for (const match of source.matchAll(
          /(?:from\s+|import\s*\(|require\s*\()\s*["'](\.[^"']+)["']/g
        )) {
          const dependencyPath = path.resolve(path.dirname(fileName), match[1]);

          if (dependencyPath.startsWith(distributionDirectory)) {
            queue.push(dependencyPath);
          }
        }
      }

      if (!mappings) {
        throw new Error(
          `${contract.name} CSS Module mappings are unreachable from ${relativeEntry}`
        );
      }

      entryMappings.push({ relativeEntry, mappings });
    }

    const referenceMappings = entryMappings[0].mappings;
    const referenceSignature = JSON.stringify(referenceMappings);

    for (const { relativeEntry, mappings } of entryMappings.slice(1)) {
      if (JSON.stringify(mappings) !== referenceSignature) {
        throw new Error(
          `${contract.name} CSS Module mappings differ in ${relativeEntry}`
        );
      }
    }

    const classNames = contract.classKeys.map((key) => {
      const className = referenceMappings[key];

      if (!className || !stylesheet.includes(`.${className}`)) {
        throw new Error(
          `${contract.name} CSS class ${key} is missing from dist output`
        );
      }

      return className;
    });

    if (new Set(classNames).size !== classNames.length) {
      throw new Error(
        `${contract.name} CSS Module class mappings are not unique`
      );
    }

    for (const key of contract.uniqueRuleKeys) {
      const selector = `.${referenceMappings[key]} {`;
      const occurrences = stylesheet.split(selector).length - 1;

      if (occurrences !== 1) {
        throw new Error(
          `Expected ${contract.name} selector ${selector} exactly once, received ${occurrences}`
        );
      }
    }

    for (const { key, suffix } of contract.requiredSelectors || []) {
      const selector = `.${referenceMappings[key]}${suffix}`;

      if (!stylesheet.includes(selector)) {
        throw new Error(
          `${contract.name} required selector ${selector} is missing`
        );
      }
    }

    cssModuleMappings.set(contract.name, referenceMappings);
  }

  const antdToggleMappings = cssModuleMappings.get('ANTD text-mode toggle');
  const antdIconSelector = `.${antdToggleMappings.content} .anticon {`;
  const antdIconRuleOccurrences = stylesheet.split(antdIconSelector).length - 1;

  if (antdIconRuleOccurrences !== 1) {
    throw new Error(
      `Expected scoped ANTD icon selector exactly once, received ${antdIconRuleOccurrences}`
    );
  }

  const expectedTokenFallbacks = [
    'var(--query-builder-color-primary-default, #3f51b5)',
    'var(--query-builder-color-primary-dark, #002984)',
    'var(--query-builder-color-primary-light, #757de8)',
    'var(--query-builder-color-secondary-light, #ff7961)',
    'var(--query-builder-color-secondary-default, #f44336)',
    'var(--query-builder-color-white, #fff)',
    'var(--query-builder-color-grey-100, #f5f5f5)',
    'var(--query-builder-color-grey-200, #eee)',
    'var(--query-builder-color-grey-300, #e0e0e0)',
    'var(--query-builder-color-grey-400, #bdbdbd)',
    'var(--query-builder-color-grey-600, #757575)',
    'var(--query-builder-color-grey-700, #616161)',
    'var(--query-builder-color-grey-800, #424242)',
  ];

  for (const tokenFallback of expectedTokenFallbacks) {
    if (!stylesheet.includes(tokenFallback)) {
      throw new Error(`Theme token fallback is missing: ${tokenFallback}`);
    }
  }

  for (const fileName of javascriptFiles) {
    const source = await readFile(fileName, 'utf8');

    if (
      /(?:document\.createElement\(['"]style|appendChild\([^)]*style|styles\.css)/.test(
        source
      )
    ) {
      throw new Error(
        `${path.relative(rootDirectory, fileName)} contains CSS injection or an asset import`
      );
    }
  }

  const localeEntries = (
    await readdir(path.join(distributionDirectory, 'locale'), {
      withFileTypes: true,
    })
  )
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => [
      `locale/${entry.name}/index.mjs`,
      `locale/${entry.name}/index.cjs`,
    ]);
  const nonUiEntryFiles = [
    'parseQuery.mjs',
    'parseQuery.cjs',
    'formatQuery.mjs',
    'formatQuery.cjs',
    ...localeEntries,
  ];

  for (const relativeEntry of nonUiEntryFiles) {
    const queue = [path.join(distributionDirectory, relativeEntry)];
    const visited = new Set();

    while (queue.length > 0) {
      const fileName = queue.pop();

      if (!fileName || visited.has(fileName)) {
        continue;
      }

      visited.add(fileName);

      const source = await readFile(fileName, 'utf8');

      if (/\bclsx\b|\.css\b/.test(source)) {
        throw new Error(
          `${relativeEntry} reaches CSS or clsx through ${path.relative(
            distributionDirectory,
            fileName
          )}`
        );
      }

      for (const match of source.matchAll(
        /(?:from\s+|import\s*\(|require\s*\()\s*['"](\.[^'"]+)['"]/g
      )) {
        const dependencyPath = path.resolve(path.dirname(fileName), match[1]);

        if (dependencyPath.startsWith(distributionDirectory)) {
          queue.push(dependencyPath);
        }
      }
    }
  }

  const sharedJavaScriptChunks = javascriptFiles.filter((fileName) => {
    const relativeFileName = path.relative(distributionDirectory, fileName);

    return (
      !relativeFileName.includes(path.sep) &&
      ![
        'index.cjs',
        'index.mjs',
        'parseQuery.cjs',
        'parseQuery.mjs',
        'formatQuery.cjs',
        'formatQuery.mjs',
      ].includes(relativeFileName)
    );
  });

  if (sharedJavaScriptChunks.length === 0) {
    throw new Error('Expected shared JavaScript chunks to remain enabled');
  }

  const esmModule = await import(
    pathToFileURL(path.join(distributionDirectory, 'parseQuery.mjs')).href
  );
  const require = createRequire(import.meta.url);
  const cjsModule = require(path.join(distributionDirectory, 'index.cjs'));
  const cjsAntdModules = ['v5', 'v6'].map((version) =>
    require(path.join(distributionDirectory, 'antd', version, 'index.cjs'))
  );

  if (
    typeof esmModule.parseQuery !== 'function' ||
    !cjsModule.Builder ||
    cjsAntdModules.some(
      (antdModule) =>
        typeof antdModule.components?.TextModeToggleContent !== 'function'
    )
  ) {
    throw new Error(
      'ESM non-UI, CJS root, or CJS ANTD entry did not load in Node'
    );
  }

  console.log(
    JSON.stringify(
      {
        cssFiles: ['dist/styles.css'],
        antdAdapterEntriesWithCssMappings: 4,
        antdAdapterRulesExactlyOnce: true,
        cssInjection: false,
        cjsRootAndAntdNodeLoads: 'passed',
        buttonCssModuleClassesUnique: true,
        buttonRulesExactlyOnce: true,
        cloneButtonCssModuleClassesUnique: true,
        cloneButtonRulesExactlyOnce: true,
        lockToggleCssModuleClassesUnique: true,
        lockToggleRulesExactlyOnce: true,
        dropZoneCssModuleClassesUnique: true,
        dropZoneRulesExactlyOnce: true,
        dropZoneThemeToken: '--query-builder-color-grey-300',
        esmNonUiLoad: 'passed',
        nonUiEntriesCssAndClsxFree: true,
        sharedJavaScriptChunks: sharedJavaScriptChunks.length,
      },
      null,
      2
    )
  );
};

await verifyCssBuild();

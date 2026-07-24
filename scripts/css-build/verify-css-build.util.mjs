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
  const dropZoneClassKeys = [
    'anchor',
    'active',
    'dragging',
    'empty',
    'dropZone',
    'inner',
    'transitionDisabled',
  ];
  let dropZoneClassMappings;

  for (const fileName of javascriptFiles) {
    const source = await readFile(fileName, 'utf8');
    const moduleMatch = source.match(
      /#region src\/drop-zone\/drop-zone\.module\.css[\s\S]*?\{([\s\S]*?)\};/
    );

    if (!moduleMatch) {
      continue;
    }

    dropZoneClassMappings = Object.fromEntries(
      Array.from(
        moduleMatch[1].matchAll(/["']([^"']+)["']:\s*["']([^"']+)["']/g),
        (match) => [match[1], match[2]]
      )
    );
    break;
  }

  if (!dropZoneClassMappings) {
    throw new Error('DropZone CSS Module mappings are missing from the build');
  }

  const dropZoneClassNames = dropZoneClassKeys.map((key) => {
    const className = dropZoneClassMappings[key];

    if (!className || !stylesheet.includes(`.${className}`)) {
      throw new Error(`DropZone CSS class ${key} is missing from dist output`);
    }

    return className;
  });

  if (new Set(dropZoneClassNames).size !== dropZoneClassNames.length) {
    throw new Error('DropZone CSS Module class mappings are not unique');
  }

  if (!stylesheet.includes('var(--query-builder-color-grey-300, #e0e0e0)')) {
    throw new Error('DropZone theme token or default fallback is missing');
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

  if (typeof esmModule.parseQuery !== 'function' || !cjsModule.Builder) {
    throw new Error('ESM non-UI or CJS root entry did not load in Node');
  }

  console.log(
    JSON.stringify(
      {
        cssFiles: ['dist/styles.css'],
        cssInjection: false,
        cjsSsrLoad: 'passed',
        dropZoneCssModuleClassesUnique: true,
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

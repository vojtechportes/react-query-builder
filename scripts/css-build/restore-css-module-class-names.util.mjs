import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';
import { transform } from 'lightningcss';

const rootDirectory = cwd();
const sourceDirectory = path.join(rootDirectory, 'src');
const distributionDirectory = path.join(rootDirectory, 'dist');
const scopedNamePattern = 'rqb_[local]_[hash]';

const sourcePathMappings = [
  ['builder/components/alert', 'alert'],
  ['builder/components/button', 'button'],
  ['builder/components/clone-button', 'clone-button'],
  ['builder/components/form-controls', 'form'],
  ['builder/components/group', 'group'],
  ['builder/components/lock-toggle', 'lock-toggle'],
  ['builder/components/outlined-button', 'outlined-button'],
  ['builder/components/popover-item', 'popover-item'],
  ['builder/components/popover', 'popover'],
  ['builder/components/rule-controls', 'widgets'],
  ['builder/components/rule', 'rule'],
  ['builder/components/secondary-button', 'secondary-button'],
  ['builder/components/text', 'text'],
  ['builder/drag-and-drop/components/drag-handle', 'drag-handle'],
  ['builder/drag-and-drop/components/drag-preview', 'drag-preview'],
  ['builder/drag-and-drop/components/drop-zone', 'drop-zone'],
  [
    'builder/drag-and-drop/components/empty-group-drop-zone',
    'empty-group-drop-zone',
  ],
  [
    'builder/history/components/history-controls',
    'builder/components/history-controls',
  ],
  [
    'builder/text-mode/components/text-mode-blocked-alert-container',
    'builder/components/text-mode-blocked-alert-container',
  ],
  ['builder/theme/styles', 'styles'],
];

const listFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });

const resolvePreviousSourcePath = (fileName) => {
  const relativePath = path
    .relative(sourceDirectory, fileName)
    .replaceAll(path.sep, '/');

  for (const [currentPrefix, previousPrefix] of sourcePathMappings) {
    if (
      relativePath === currentPrefix ||
      relativePath.startsWith(`${currentPrefix}/`)
    ) {
      return path.join(
        sourceDirectory,
        previousPrefix,
        relativePath.slice(currentPrefix.length)
      );
    }
  }

  return null;
};

const getScopedNames = (fileName, css) => {
  const result = transform({
    filename: fileName,
    code: Buffer.from(css),
    cssModules: {
      pattern: scopedNamePattern,
    },
  });

  return Object.fromEntries(
    Object.entries(result.exports || {}).map(([localName, { name }]) => [
      localName,
      name,
    ])
  );
};

const classNameMappings = new Map();

for (const fileName of listFiles(sourceDirectory)) {
  if (!fileName.endsWith('.module.css')) {
    continue;
  }

  const previousFileName = resolvePreviousSourcePath(fileName);

  if (!previousFileName) {
    continue;
  }

  const css = readFileSync(fileName, 'utf8');
  const currentNames = getScopedNames(fileName, css);
  const previousNames = getScopedNames(previousFileName, css);

  const currentLocalNames = Object.keys(currentNames);
  const previousLocalNames = Object.keys(previousNames);

  if (
    currentLocalNames.length !== previousLocalNames.length ||
    currentLocalNames.some((localName) => !previousNames[localName])
  ) {
    throw new Error(`CSS Module export mismatch for ${fileName}`);
  }

  currentLocalNames.forEach((localName) => {
    const currentName = currentNames[localName];
    const previousName = previousNames[localName];
    const existingName = classNameMappings.get(currentName);

    if (existingName && existingName !== previousName) {
      throw new Error(`Conflicting CSS Module mapping for ${currentName}`);
    }

    if (currentName !== previousName) {
      classNameMappings.set(currentName, previousName);
    }
  });
}

const outputFiles = listFiles(distributionDirectory).filter((fileName) =>
  /\.(?:cjs|css|mjs)$/.test(fileName)
);
const emittedMappings = new Map();

for (const fileName of outputFiles) {
  let content = readFileSync(fileName, 'utf8');

  for (const [currentName, previousName] of classNameMappings) {
    if (!content.includes(currentName)) {
      continue;
    }

    emittedMappings.set(currentName, previousName);
    content = content.replaceAll(currentName, previousName);
  }

  writeFileSync(fileName, content);
}

const emittedOutput = outputFiles
  .map((fileName) => readFileSync(fileName, 'utf8'))
  .join('\n');

for (const [currentName, previousName] of emittedMappings) {
  if (
    emittedOutput.includes(currentName) ||
    !emittedOutput.includes(previousName)
  ) {
    throw new Error(
      `Failed to preserve CSS Module class ${previousName} from ${currentName}`
    );
  }
}

console.log(
  `Preserved ${emittedMappings.size} path-sensitive CSS Module class names.`
);

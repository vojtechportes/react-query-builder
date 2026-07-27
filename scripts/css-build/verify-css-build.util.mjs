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
      expectedRuleOccurrences: { cloneButton: 2 },
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
      expectedRuleOccurrences: { lockToggle: 2 },
      requiredSelectors: [
        { key: 'unlocked', suffix: ':hover' },
        { key: 'self', suffix: ':hover' },
        { key: 'all', suffix: ':hover' },
        { key: 'lockToggle', suffix: ':focus-visible' },
        { key: 'disabled', suffix: ':hover' },
      ],
    },
    {
      name: 'GroupOption',
      modulePattern:
        /#region src\/group\/components\/option\/option\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['disabled', 'option', 'selected'],
      entryFiles: ['index.mjs', 'index.cjs'],
      uniqueRuleKeys: ['disabled', 'option'],
      requiredRuleFragments: [
        {
          key: 'option',
          fragments: [
            'color: var(--query-builder-color-primary-contrast-text);',
            'background: var(--query-builder-color-grey-500);',
            'border: 1px solid var(--query-builder-color-grey-800);',
          ],
        },
        {
          key: 'selected',
          fragments: [
            'background: var(--query-builder-color-primary-default);',
          ],
        },
      ],
    },
    {
      name: 'GroupContainer',
      modulePattern:
        /#region src\/group\/components\/group-container\/group-container\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: [
        'body',
        'group',
        'header',
        'left',
        'right',
        'withDragHandle',
        'withLeftControls',
        'withRightControls',
      ],
      entryFiles: ['index.mjs', 'index.cjs'],
      uniqueRuleKeys: ['body', 'group', 'withDragHandle'],
      requiredRuleFragments: [
        {
          key: 'group',
          fragments: [
            'background: #f4f4f4;',
            'border: 1px solid var(--query-builder-color-grey-200);',
            'border-radius: var(--query-builder-radius-sm, 4px);',
          ],
        },
        {
          key: 'body',
          fragments: ['padding: var(--query-builder-group-padding, .7rem);'],
        },
      ],
    },
    {
      name: 'Alert',
      modulePattern:
        /#region src\/alert\/alert\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: [
        'alert',
        'content',
        'error',
        'filled',
        'icon',
        'info',
        'outlined',
        'success',
        'warning',
      ],
      entryFiles: ['index.mjs', 'index.cjs'],
      uniqueRuleKeys: [
        'alert',
        'content',
        'error',
        'filled',
        'icon',
        'info',
        'outlined',
        'success',
        'warning',
      ],
      requiredRuleFragments: [
        {
          key: 'info',
          fragments: [
            '--alert-primary: var(--query-builder-color-info-primary);',
            '--alert-light: var(--query-builder-color-info-light);',
          ],
        },
        {
          key: 'success',
          fragments: [
            '--alert-primary: var(--query-builder-color-success-primary);',
            '--alert-light: var(--query-builder-color-success-light);',
          ],
        },
        {
          key: 'warning',
          fragments: [
            '--alert-primary: var(--query-builder-color-warning-primary);',
            '--alert-light: var(--query-builder-color-warning-light);',
          ],
        },
        {
          key: 'error',
          fragments: [
            '--alert-primary: var(--query-builder-color-error-primary);',
            '--alert-light: var(--query-builder-color-error-light);',
          ],
        },
        {
          key: 'outlined',
          fragments: [
            'color: var(--alert-primary);',
            'background: color-mix(in srgb, var(--alert-primary) 5%, var(--query-builder-color-white) 95%);',
            'border-color: var(--alert-light);',
          ],
        },
        {
          key: 'filled',
          fragments: [
            'color: var(--query-builder-color-white);',
            'background: var(--alert-primary);',
            'border-color: var(--alert-primary);',
          ],
        },
      ],
    },
    {
      name: 'Text',
      modulePattern:
        /#region src\/text\/text\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['text'],
      entryFiles: ['index.mjs', 'index.cjs'],
      uniqueRuleKeys: ['text'],
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
    {
      name: 'MUI text-mode toggle',
      modulePattern:
        /#region src\/mui\/shared\/components\/mui-text-mode-toggle-content\/mui-text-mode-toggle-content\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['content', 'label'],
      entryFiles: [
        'mui/v7/index.mjs',
        'mui/v7/index.cjs',
        'mui/v9/index.mjs',
        'mui/v9/index.cjs',
      ],
      uniqueRuleKeys: ['content', 'label'],

      requiredRuleFragments: [
        {
          key: 'content',
          fragments: [
            'display: inline-flex;',
            'align-items: center;',
            'gap: .4rem;',
            'line-height: 1;',
          ],
        },
      ],
    },
    {
      name: 'Mantine text-mode toggle',
      modulePattern:
        /#region src\/mantine\/shared\/components\/mantine-text-mode-toggle-content\/mantine-text-mode-toggle-content\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['content', 'label'],
      entryFiles: [
        'mantine/v8/index.mjs',
        'mantine/v8/index.cjs',
        'mantine/v9/index.mjs',
        'mantine/v9/index.cjs',
      ],
      uniqueRuleKeys: ['content', 'label'],
      requiredSelectors: [{ key: 'content', suffix: ' svg {' }],
      forbiddenFragments: ['styled-components'],
      requiredSelectorRuleFragments: [
        {
          key: 'content',
          suffix: ' svg',
          fragments: ['display: block;', 'flex-shrink: 0;'],
        },
      ],
      requiredRuleFragments: [
        {
          key: 'content',
          fragments: [
            'display: inline-flex;',
            'align-items: center;',
            'gap: .4rem;',
            'line-height: 1;',
          ],
        },
      ],
    },
    {
      name: 'Fluent UI text-mode toggle',
      modulePattern:
        /#region src\/fluentui\/shared\/components\/fluent-ui-text-mode-toggle-content\/fluent-ui-text-mode-toggle-content\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['content', 'label'],
      entryFiles: ['fluentui/v8/index.mjs', 'fluentui/v8/index.cjs'],
      uniqueRuleKeys: ['content', 'label'],
      requiredSelectors: [{ key: 'content', suffix: ' svg {' }],
      forbiddenFragments: ['styled-components'],
    },
    {
      name: 'Fluent UI SelectMulti',
      modulePattern:
        /#region src\/fluentui\/shared\/components\/fluent-ui-select-multi\/fluent-ui-select-multi\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['badge'],
      entryFiles: ['fluentui/v8/index.mjs', 'fluentui/v8/index.cjs'],
      uniqueRuleKeys: ['badge'],
      requiredRuleFragments: [
        {
          key: 'badge',
          fragments: [
            'background: var(--fluent-ui-badge-background);',
            'color: var(--fluent-ui-badge-color);',
          ],
        },
      ],
    },
    {
      name: 'Fluent UI Rule',
      modulePattern:
        /#region src\/fluentui\/shared\/components\/fluent-ui-rule\/fluent-ui-rule\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: [
        'body',
        'bodyWithoutControls',
        'controls',
        'rule',
        'withControls',
        'withDragHandle',
      ],
      entryFiles: ['fluentui/v8/index.mjs', 'fluentui/v8/index.cjs'],
      uniqueRuleKeys: ['body', 'bodyWithoutControls', 'rule'],
    },
    {
      name: 'Fluent UI Group',
      modulePattern:
        /#region src\/fluentui\/shared\/components\/fluent-ui-group\/fluent-ui-group\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: [
        'body',
        'group',
        'header',
        'left',
        'right',
        'withDragHandle',
        'withLeftControls',
        'withRightControls',
      ],
      entryFiles: ['fluentui/v8/index.mjs', 'fluentui/v8/index.cjs'],
      uniqueRuleKeys: ['body', 'group'],
    },
    {
      name: 'Fluent UI GroupHeaderOption',
      modulePattern:
        /#region src\/fluentui\/shared\/components\/fluent-ui-group-header-option\/fluent-ui-group-header-option\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['disabled', 'option', 'selected'],
      entryFiles: ['fluentui/v8/index.mjs', 'fluentui/v8/index.cjs'],
      uniqueRuleKeys: ['disabled', 'option', 'selected'],
      expectedRuleOccurrences: { option: 2 },
      requiredSelectors: [
        { key: 'option', suffix: ':hover' },
        { key: 'option', suffix: ':focus-visible' },
        { key: 'option', suffix: ':first-child' },
        { key: 'option', suffix: ':last-child' },
        { key: 'selected', suffix: ':hover' },
      ],
    },
    {
      name: 'Radix Alert',
      modulePattern:
        /#region src\/radix\/shared\/components\/radix-alert\/radix-alert\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['alert', 'error', 'info', 'success', 'warning'],
      entryFiles: ['radix/v1/index.mjs', 'radix/v1/index.cjs'],
      uniqueRuleKeys: ['alert', 'error', 'info', 'success', 'warning'],
      forbiddenFragments: ['styled-components'],
      requiredRuleFragments: [
        {
          key: 'alert',
          fragments: [
            'border: 1px solid var(--radix-alert-border);',
            'background: var(--radix-alert-background);',
            'color: var(--radix-alert-color);',
          ],
        },
        {
          key: 'error',
          fragments: [
            '--radix-alert-border: var(--red-7, #e5484d);',
            '--radix-alert-background: var(--red-2, #fff7f7);',
          ],
        },
        {
          key: 'success',
          fragments: ['--radix-alert-border: var(--green-7, #30a46c);'],
        },
        {
          key: 'info',
          fragments: ['--radix-alert-border: var(--blue-7, #3e63dd);'],
        },
        {
          key: 'warning',
          fragments: ['--radix-alert-border: var(--amber-7, #f5a524);'],
        },
      ],
    },
    {
      name: 'Radix Select',
      modulePattern:
        /#region src\/radix\/shared\/components\/radix-select\/radix-select\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['hiddenInput'],
      entryFiles: ['radix/v1/index.mjs', 'radix/v1/index.cjs'],
      uniqueRuleKeys: ['hiddenInput'],
      forbiddenFragments: ['styled-components'],
    },
    {
      name: 'Radix SelectMulti',
      modulePattern:
        /#region src\/radix\/shared\/components\/radix-select-multi\/radix-select-multi\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['badge', 'hiddenInput', 'triggerText'],
      entryFiles: ['radix/v1/index.mjs', 'radix/v1/index.cjs'],
      uniqueRuleKeys: ['badge', 'hiddenInput', 'triggerText'],
      forbiddenFragments: ['styled-components'],
      requiredRuleFragments: [
        {
          key: 'badge',
          fragments: ['background: var(--accent-9, #3e63dd);', 'color: #fff;'],
        },
      ],
    },
    {
      name: 'Radix text-mode toggle',
      modulePattern:
        /#region src\/radix\/shared\/components\/radix-text-mode-toggle-content\/radix-text-mode-toggle-content\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['content', 'label'],
      entryFiles: ['radix/v1/index.mjs', 'radix/v1/index.cjs'],
      uniqueRuleKeys: ['content', 'label'],
      requiredSelectors: [{ key: 'content', suffix: ' svg {' }],
      forbiddenFragments: ['styled-components'],
    },
    {
      name: 'Radix HistoryControls',
      modulePattern:
        /#region src\/radix\/shared\/components\/radix-history-controls\/radix-history-controls\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['controls'],
      entryFiles: ['radix/v1/index.mjs', 'radix/v1/index.cjs'],
      uniqueRuleKeys: ['controls'],
      forbiddenFragments: ['styled-components'],
    },
    {
      name: 'Radix Rule',
      modulePattern:
        /#region src\/radix\/shared\/components\/radix-rule\/radix-rule\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: [
        'body',
        'bodyWithoutControls',
        'controls',
        'rule',
        'withControls',
        'withDragHandle',
      ],
      entryFiles: ['radix/v1/index.mjs', 'radix/v1/index.cjs'],
      uniqueRuleKeys: ['body', 'bodyWithoutControls', 'controls', 'rule'],
      forbiddenFragments: ['styled-components'],
      requiredRuleFragments: [
        {
          key: 'rule',
          fragments: [
            'border: 1px solid var(--gray-6, #d9d9e0);',
            'background: var(--color-panel-solid, #fff);',
            'box-shadow: 0 10px 24px #0f172a0f;',
          ],
        },
      ],
    },
    {
      name: 'Radix Group',
      modulePattern:
        /#region src\/radix\/shared\/components\/radix-group\/radix-group\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['body', 'group', 'header', 'left', 'right', 'withDragHandle'],
      entryFiles: ['radix/v1/index.mjs', 'radix/v1/index.cjs'],
      uniqueRuleKeys: ['body', 'group'],
      forbiddenFragments: ['styled-components'],
      requiredRuleFragments: [
        {
          key: 'group',
          fragments: [
            'border: 1px solid var(--gray-6, #d9d9e0);',
            'box-shadow: inset 0 1px #fff9;',
          ],
        },
      ],
    },
    {
      name: 'Radix GroupHeaderOption',
      modulePattern:
        /#region src\/radix\/shared\/components\/radix-group-header-option\/radix-group-header-option\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['disabled', 'option', 'selected'],
      entryFiles: ['radix/v1/index.mjs', 'radix/v1/index.cjs'],
      uniqueRuleKeys: ['option'],
      requiredSelectors: [
        { key: 'option', suffix: ':first-child' },
        { key: 'option', suffix: ':last-child' },
      ],
      forbiddenFragments: ['styled-components'],
      requiredRuleFragments: [
        {
          key: 'option',
          fragments: [
            'border: 1px solid var(--gray-7, #c8c7d0);',
            'background: var(--color-panel-solid, #fff);',
          ],
        },
        {
          key: 'selected',
          fragments: ['background: var(--accent-9, #3e63dd);'],
        },
      ],
    },
    {
      name: 'Monaco TextModeEditor',
      modulePattern:
        /#region src\/monaco\/components\/monaco-text-mode-editor\/monaco-text-mode-editor\.module\.css[\s\S]*?\{([\s\S]*?)\};/,
      classKeys: ['errorMessage', 'frame', 'root', 'surface'],
      entryFiles: ['monaco/index.mjs', 'monaco/index.cjs'],
      uniqueRuleKeys: ['errorMessage', 'frame', 'root'],
      forbiddenFragments: ['styled-components'],
      requiredRuleFragments: [
        {
          key: 'frame',
          fragments: [
            'min-height: var(--query-builder-editor-min-height);',
            'border: 1px solid var(--query-builder-color-grey-300);',
            'background: var(--query-builder-color-white);',
          ],
        },
        {
          key: 'errorMessage',
          fragments: [
            'color: var(--query-builder-color-error-primary);',
            'font-size: .8rem;',
          ],
        },
      ],
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

        for (const fragment of contract.forbiddenFragments || []) {
          if (source.includes(fragment)) {
            throw new Error(
              `${contract.name} reaches forbidden dependency ${fragment} through ${path.relative(
                distributionDirectory,
                fileName
              )}`
            );
          }
        }

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
      const expectedOccurrences = contract.expectedRuleOccurrences?.[key] ?? 1;

      if (occurrences !== expectedOccurrences) {
        throw new Error(
          `Expected ${contract.name} selector ${selector} ${expectedOccurrences} time(s), received ${occurrences}`
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

    for (const {
      key,
      suffix,
      fragments,
    } of contract.requiredSelectorRuleFragments || []) {
      const selector = `.${referenceMappings[key]}${suffix}`;
      const ruleMatch = stylesheet.match(
        new RegExp(`${selector}\\s*\\{([^}]*)\\}`)
      );
      const normalizedRule = ruleMatch?.[1].replace(/\s+/g, ' ').trim();

      for (const fragment of fragments) {
        if (!normalizedRule?.includes(fragment)) {
          throw new Error(
            `${contract.name} rule ${selector} is missing declaration: ${fragment}`
          );
        }
      }
    }

    for (const { key, fragments } of contract.requiredRuleFragments || []) {
      const selector = `.${referenceMappings[key]}`;
      const ruleMatch = stylesheet.match(
        new RegExp(`${selector}\\s*\\{([^}]*)\\}`)
      );
      const normalizedRule = ruleMatch?.[1].replace(/\s+/g, ' ').trim();

      for (const fragment of fragments) {
        if (!normalizedRule?.includes(fragment)) {
          throw new Error(
            `${contract.name} rule ${selector} is missing declaration: ${fragment}`
          );
        }
      }
    }

    cssModuleMappings.set(contract.name, referenceMappings);
  }

  const groupOptionMappings = cssModuleMappings.get('GroupOption');
  const groupContainerMappings = cssModuleMappings.get('GroupContainer');
  const requiredGroupSelectors = [
    `.${groupOptionMappings.disabled}.${groupOptionMappings.selected}`,
    `.${groupContainerMappings.left} > div:first-child`,
    `.${groupContainerMappings.left} > div + div`,
    `.${groupContainerMappings.left} > div:last-child`,
    `.${groupContainerMappings.header}.${groupContainerMappings.withLeftControls}:not(.${groupContainerMappings.withRightControls})`,
  ];

  for (const selector of requiredGroupSelectors) {
    if (!stylesheet.includes(selector)) {
      throw new Error(`Group extracted selector ${selector} is missing`);
    }
  }

  const normalizedStylesheet = stylesheet.replace(/\s+/g, ' ');
  const compactGroupBlock =
    `@media (width <= 900px) { ` +
    `.${groupContainerMappings.header} { ` +
    'grid-template-columns: minmax(0, 1fr); gap: .75rem; } ' +
    `.${groupContainerMappings.right} { ` +
    'grid-template-columns: repeat(3, minmax(0, max-content)); ' +
    'grid-auto-flow: row; justify-self: start; } }';

  if (!normalizedStylesheet.includes(compactGroupBlock)) {
    throw new Error(
      'Group extracted stylesheet is missing the 900px header/right layout'
    );
  }

  const fluentRuleMappings = cssModuleMappings.get('Fluent UI Rule');
  const fluentGroupMappings = cssModuleMappings.get('Fluent UI Group');
  const fluentOptionMappings = cssModuleMappings.get(
    'Fluent UI GroupHeaderOption'
  );
  const compactFluentRuleBlock =
    `@media (width <= 900px) { ` +
    `.${fluentRuleMappings.controls} { padding-left: .5rem; } }`;
  const compactFluentGroupBlock =
    `@media (width <= 900px) { ` +
    `.${fluentGroupMappings.header} { ` +
    'grid-template-columns: minmax(0, 1fr); gap: .75rem; } ' +
    `.${fluentGroupMappings.right} { ` +
    'grid-template-columns: repeat(3, minmax(0, max-content)); ' +
    'grid-auto-flow: row; justify-self: start; } }';
  const requiredFluentSelectors = [
    `.${fluentRuleMappings.withDragHandle}.${fluentRuleMappings.withControls} {`,
    `.${fluentGroupMappings.header}.${fluentGroupMappings.withLeftControls}:not(.${fluentGroupMappings.withRightControls})`,
    `.${fluentOptionMappings.option}:not(:first-child)`,
  ];

  if (!normalizedStylesheet.includes(compactFluentRuleBlock)) {
    throw new Error(
      'Fluent UI Rule stylesheet is missing the 900px controls layout'
    );
  }

  if (!normalizedStylesheet.includes(compactFluentGroupBlock)) {
    throw new Error(
      'Fluent UI Group stylesheet is missing the 900px header/right layout'
    );
  }

  for (const selector of requiredFluentSelectors) {
    const occurrences = stylesheet.split(selector).length - 1;

    if (occurrences !== 1) {
      throw new Error(
        `Expected Fluent UI selector ${selector} exactly once, received ${occurrences}`
      );
    }
  }

  const radixRuleMappings = cssModuleMappings.get('Radix Rule');
  const radixGroupMappings = cssModuleMappings.get('Radix Group');
  const radixOptionMappings = cssModuleMappings.get('Radix GroupHeaderOption');
  const compactRadixGroupBlock =
    `@media (width <= 900px) { ` +
    `.${radixGroupMappings.header} { ` +
    'grid-template-columns: minmax(0, 1fr); gap: .75rem; } ' +
    `.${radixGroupMappings.right} { justify-self: start; } }`;
  const requiredRadixSelectors = [
    `.${radixRuleMappings.withDragHandle}.${radixRuleMappings.withControls} {`,
    `.${radixOptionMappings.selected}.${radixOptionMappings.disabled} {`,
    `.${radixOptionMappings.option}:not(:first-child)`,
  ];

  if (!normalizedStylesheet.includes(compactRadixGroupBlock)) {
    throw new Error(
      'Radix Group stylesheet is missing the 900px header/right layout'
    );
  }

  for (const selector of requiredRadixSelectors) {
    const occurrences = stylesheet.split(selector).length - 1;

    if (occurrences !== 1) {
      throw new Error(
        `Expected Radix selector ${selector} exactly once, received ${occurrences}`
      );
    }
  }
  const monacoMappings = cssModuleMappings.get('Monaco TextModeEditor');
  const requiredMonacoSelectors = [
    `.${monacoMappings.frame} .rqb-monaco-text-mode-diagnostic {`,
    `.${monacoMappings.frame} .monaco-editor .view-lines .rqb-monaco-text-mode-protected,`,
    `.${monacoMappings.frame} .monaco-editor .view-lines .rqb-monaco-text-mode-marker-anchor,`,
    `.${monacoMappings.frame} .monaco-editor .view-lines .rqb-monaco-text-mode-protected.rqb-monaco-text-mode-marker-anchor,`,
  ];

  for (const selector of requiredMonacoSelectors) {
    const occurrences = stylesheet.split(selector).length - 1;

    if (occurrences !== 1) {
      throw new Error(
        `Expected scoped Monaco selector ${selector} exactly once, received ${occurrences}`
      );
    }
  }
  const antdToggleMappings = cssModuleMappings.get('ANTD text-mode toggle');
  const antdIconSelector = `.${antdToggleMappings.content} .anticon {`;
  const antdIconRuleOccurrences = stylesheet.split(antdIconSelector).length - 1;

  if (antdIconRuleOccurrences !== 1) {
    throw new Error(
      `Expected scoped ANTD icon selector exactly once, received ${antdIconRuleOccurrences}`
    );
  }

  const expectedTokenDefaults = [
    '--query-builder-color-primary-default: #3f51b5;',
    '--query-builder-color-primary-dark: #002984;',
    '--query-builder-color-primary-light: #757de8;',
    '--query-builder-color-secondary-light: #ff7961;',
    '--query-builder-color-secondary-default: #f44336;',
    '--query-builder-color-white: #fff;',
    '--query-builder-color-grey-100: #f5f5f5;',
    '--query-builder-color-grey-200: #eee;',
    '--query-builder-color-grey-300: #e0e0e0;',
    '--query-builder-color-grey-400: #bdbdbd;',
    '--query-builder-color-grey-600: #757575;',
    '--query-builder-color-grey-700: #616161;',
    '--query-builder-color-grey-800: #424242;',
  ];

  for (const tokenDefault of expectedTokenDefaults) {
    if (!stylesheet.includes(tokenDefault)) {
      throw new Error(`Theme token default is missing: ${tokenDefault}`);
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
  const esmMonacoModule = await import(
    pathToFileURL(path.join(distributionDirectory, 'monaco', 'index.mjs')).href
  );
  const require = createRequire(import.meta.url);
  const cjsModule = require(path.join(distributionDirectory, 'index.cjs'));
  const cjsMonacoModule = require(
    path.join(distributionDirectory, 'monaco', 'index.cjs')
  );
  const cjsAntdModules = ['v5', 'v6'].map((version) =>
    require(path.join(distributionDirectory, 'antd', version, 'index.cjs'))
  );

  if (
    typeof esmModule.parseQuery !== 'function' ||
    typeof esmMonacoModule.MonacoTextModeEditor !== 'function' ||
    typeof cjsMonacoModule.MonacoTextModeEditor !== 'function' ||
    !cjsModule.Builder ||
    cjsAntdModules.some(
      (antdModule) =>
        typeof antdModule.components?.TextModeToggleContent !== 'function'
    )
  ) {
    throw new Error(
      'ESM non-UI, CJS root, CJS ANTD, or Monaco entry did not load in Node'
    );
  }

  console.log(
    JSON.stringify(
      {
        cssFiles: ['dist/styles.css'],
        alertColorMatrixContract: true,
        alertCssModuleClassesUnique: true,
        alertRulesExactlyOnce: true,
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
        monacoEntryNodeLoads: 'passed',
        monacoRulesExactlyOnce: true,
        groupCssModuleClassesUnique: true,
        groupRulesExactlyOnce: true,
        groupResponsiveLayout: '900px',
        dropZoneCssModuleClassesUnique: true,
        dropZoneRulesExactlyOnce: true,
        dropZoneThemeToken: '--query-builder-color-grey-300',
        fluentUiAdapterEntriesWithCssMappings: 2,
        fluentUiAdapterRulesExactlyOnce: true,
        fluentUiResponsiveLayout: '900px',
        radixAdapterEntriesWithCssMappings: 2,
        radixAdapterRulesExactlyOnce: true,
        radixResponsiveLayout: '900px',
        esmNonUiLoad: 'passed',
        nonUiEntriesCssAndClsxFree: true,
        sharedJavaScriptChunks: sharedJavaScriptChunks.length,
        textCssModuleClassesUnique: true,
        textRulesExactlyOnce: true,
      },
      null,
      2
    )
  );
};

await verifyCssBuild();

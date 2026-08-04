import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import ts from 'typescript';

const rootDir = cwd();
const stylesDirectory = join(rootDir, 'src', 'builder', 'theme', 'styles');
const colorsPath = join(stylesDirectory, 'colors.ts');
const darkColorsPath = join(stylesDirectory, 'dark-colors.ts');
const tokensPath = join(stylesDirectory, 'tokens.css');
const darkTokensPath = join(stylesDirectory, 'dark-mode.variables.css');
const distributionPath = join(rootDir, 'dist', 'dark-mode.variables.css');
const distributionOnly = process.argv.includes('--distribution-only');

const readObjectLiteral = (objectLiteral, sourceFile) => {
  const result = {};

  for (const property of objectLiteral.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    const key = property.name.getText(sourceFile).replace(/^['"]|['"]$/g, '');
    const initializer = property.initializer;

    if (ts.isObjectLiteralExpression(initializer)) {
      result[key] = readObjectLiteral(initializer, sourceFile);
      continue;
    }

    if (ts.isStringLiteral(initializer)) {
      result[key] = initializer.text;
    }
  }

  return result;
};

const readExportedColors = (filePath, exportName) => {
  const sourceText = readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === exportName &&
        declaration.initializer &&
        ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        return readObjectLiteral(declaration.initializer, sourceFile);
      }
    }
  }

  throw new Error(`Unable to find exported ${exportName} object.`);
};

const createColorVariables = (colors) => [
  ['--query-builder-color-primary-default', colors.primary.default],
  ['--query-builder-color-primary-light', colors.primary.light],
  ['--query-builder-color-primary-dark', colors.primary.dark],
  ['--query-builder-color-primary-contrast-text', colors.primary.contrastText],
  ['--query-builder-color-secondary-default', colors.secondary.default],
  ['--query-builder-color-secondary-light', colors.secondary.light],
  ['--query-builder-color-secondary-dark', colors.secondary.dark],
  [
    '--query-builder-color-secondary-contrast-text',
    colors.secondary.contrastText,
  ],
  ['--query-builder-color-grey-100', colors.grey['100']],
  ['--query-builder-color-grey-200', colors.grey['200']],
  ['--query-builder-color-grey-300', colors.grey['300']],
  ['--query-builder-color-grey-400', colors.grey['400']],
  ['--query-builder-color-grey-500', colors.grey['500']],
  ['--query-builder-color-grey-600', colors.grey['600']],
  ['--query-builder-color-grey-700', colors.grey['700']],
  ['--query-builder-color-grey-800', colors.grey['800']],
  ['--query-builder-color-grey-900', colors.grey['900']],
  ['--query-builder-color-info-primary', colors.info.primary],
  ['--query-builder-color-info-light', colors.info.light],
  ['--query-builder-color-success-primary', colors.success.primary],
  ['--query-builder-color-success-light', colors.success.light],
  ['--query-builder-color-warning-primary', colors.warning.primary],
  ['--query-builder-color-warning-light', colors.warning.light],
  ['--query-builder-color-error-primary', colors.error.primary],
  ['--query-builder-color-error-light', colors.error.light],
  ['--query-builder-color-background', colors.white],
];

const staticVariables = [
  ['--query-builder-spacing-xs', '0.25rem'],
  ['--query-builder-spacing-sm', '0.5rem'],
  ['--query-builder-spacing-md', '0.75rem'],
  ['--query-builder-spacing-lg', '1rem'],
  ['--query-builder-root-padding', '1rem'],
  ['--query-builder-group-padding', '0.7rem'],
  ['--query-builder-rule-padding', '0.7rem'],
  ['--query-builder-control-gap', '0.5rem'],
  ['--query-builder-group-gap', '1rem'],
  ['--query-builder-radius-sm', '4px'],
  ['--query-builder-radius-md', '6px'],
  ['--query-builder-radius-pill', '999px'],
  ['--query-builder-root-radius', '0'],
  ['--query-builder-shadow-group', '0 0 5px -1px rgba(0, 0, 0, 0.15)'],
  ['--query-builder-shadow-popover', '0 4px 12px rgba(0, 0, 0, 0.15)'],
  [
    '--query-builder-shadow-focus',
    '0 0 0 3px\n      var(--query-builder-color-primary-light)',
  ],
  ['--query-builder-shadow-root', 'none'],
  ['--query-builder-control-width', '160px'],
  ['--query-builder-control-min-width', '160px'],
  ['--query-builder-control-height', '2rem'],
  ['--query-builder-font-family', 'Arial, sans-serif'],
  ['--query-builder-font-size', '16px'],
  ['--query-builder-line-height', 'normal'],
  ['--query-builder-editor-font-family', "'Courier New', monospace"],
  ['--query-builder-editor-font-size', '0.85rem'],
  ['--query-builder-editor-line-height', '1.5'],
  ['--query-builder-editor-min-height', '10rem'],
  ['--query-builder-drop-zone-height', '50px'],
  ['--query-builder-motion-duration', '180ms'],
  ['--query-builder-motion-easing', 'ease'],
  ['--query-builder-popover-z-index', '5'],
];

const formatVariables = (variables) =>
  variables.map(([name, value]) => `    ${name}: ${value};`).join('\n');

const lightColorVariables = createColorVariables(
  readExportedColors(colorsPath, 'colors')
);
const darkColorVariables = createColorVariables(
  readExportedColors(darkColorsPath, 'darkColors')
);
const lightContent = `@layer react-query-builder {
  :where(:root) {
${formatVariables([...lightColorVariables, ...staticVariables])}
  }

  :where([data-query-builder-color-scheme='light']) {
    color-scheme: light;
${formatVariables(lightColorVariables)}
  }
}
`;
const darkContent = `@layer react-query-builder {
  :where([data-query-builder-color-scheme='dark']) {
    color-scheme: dark;
${formatVariables(darkColorVariables)}
  }
}
`;

if (!distributionOnly) {
  writeFileSync(tokensPath, lightContent);
  writeFileSync(darkTokensPath, darkContent);
} else {
  mkdirSync(join(rootDir, 'dist'), { recursive: true });
  writeFileSync(distributionPath, darkContent);
}

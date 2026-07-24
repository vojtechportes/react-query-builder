import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import ts from 'typescript';

const exampleRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const target = process.argv[2];
const recipeRoot = path.join(
  exampleRoot,
  'src',
  ...(['v1', 'v2'].includes(target)
    ? [target, 'pages', 'recipes-page']
    : ['pages', 'recipes-page'])
);
const snippetsDirectory = path.join(recipeRoot, 'snippets');
const pagesDirectory = path.join(recipeRoot, 'pages');
const requiredRenderedCodeProperties = new Set([
  'fieldsCode',
  'builderCode',
  'transformCode',
]);
const optionalRenderedCodeProperties = new Set(['expectedOutput']);
const renderedCodeProperties = new Set([
  ...requiredRenderedCodeProperties,
  ...optionalRenderedCodeProperties,
]);
const prettierConfig =
  (await prettier.resolveConfig(path.join(exampleRoot, 'package.json'))) ?? {};
const prettierChecks = [];

const getLine = (sourceFile, position) =>
  sourceFile.getLineAndCharacterOfPosition(position).line;

const unwrapExpression = (expression) => {
  let current = expression;

  while (
    ts.isParenthesizedExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isTypeAssertionExpression(current)
  ) {
    current = current.expression;
  }

  return current;
};

const isNamedHookCall = (expression, hookNames) => {
  const unwrappedExpression = unwrapExpression(expression);

  if (!ts.isCallExpression(unwrappedExpression)) return false;
  const callee = unwrapExpression(unwrappedExpression.expression);
  const name = ts.isIdentifier(callee)
    ? callee.text
    : ts.isPropertyAccessExpression(callee)
      ? callee.name.text
      : '';
  return hookNames.has(name);
};

const isPaddedDeclaration = (statement, sourceFile) => {
  if (ts.isVariableStatement(statement)) {
    const isArrow = statement.declarationList.declarations.some(
      (declaration) =>
        declaration.initializer &&
        ts.isArrowFunction(unwrapExpression(declaration.initializer))
    );
    const isMemo = statement.declarationList.declarations.some(
      (declaration) =>
        declaration.initializer &&
        isNamedHookCall(declaration.initializer, new Set(['useMemo']))
    );
    const isMultiline =
      getLine(sourceFile, statement.getStart(sourceFile)) !==
      getLine(sourceFile, statement.end - 1);
    return isArrow || isMemo || isMultiline;
  }

  return (
    ts.isExpressionStatement(statement) &&
    isNamedHookCall(statement.expression, new Set(['useEffect', 'useMemo']))
  );
};

const validateStatementList = (statements, sourceFile, label, errors) => {
  statements.forEach((statement, index) => {
    if (!isPaddedDeclaration(statement, sourceFile)) return;

    const startLine = getLine(sourceFile, statement.getStart(sourceFile));
    const endLine = getLine(sourceFile, statement.end - 1);
    const previous = statements[index - 1];
    const next = statements[index + 1];

    if (previous && startLine - getLine(sourceFile, previous.end - 1) < 2) {
      errors.push(
        `${label}:${startLine + 1} needs a blank line before the declaration.`
      );
    }

    if (next && getLine(sourceFile, next.getStart(sourceFile)) - endLine < 2) {
      errors.push(
        `${label}:${endLine + 1} needs a blank line after the declaration.`
      );
    }
  });
};

const validateSource = (source, label, errors) => {
  const sourceFile = ts.createSourceFile(
    label,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const visit = (node) => {
    if (ts.isSourceFile(node) || ts.isBlock(node)) {
      validateStatementList(node.statements, sourceFile, label, errors);
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
};

const errors = [];
const validatedSnippetFiles = new Set();

for (const fileName of fs
  .readdirSync(snippetsDirectory)
  .filter((name) => name.endsWith('.snippet.tsx'))
  .sort()) {
  const snippetSource = fs.readFileSync(
    path.join(snippetsDirectory, fileName),
    'utf8'
  );
  const label = `snippets/${fileName}`;

  validateSource(snippetSource, label, errors);
  prettierChecks.push({ label, parser: 'typescript', source: snippetSource });
  validatedSnippetFiles.add(fileName);
}

for (const fileName of fs
  .readdirSync(pagesDirectory)
  .filter((name) => name.endsWith('.recipe.ts'))
  .sort()) {
  const source = fs.readFileSync(path.join(pagesDirectory, fileName), 'utf8');
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const seenRenderedCodeProperties = new Set();
  const rawSnippetImports = new Map();

  for (const statement of sourceFile.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !statement.importClause?.name ||
      !ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      continue;
    }

    rawSnippetImports.set(
      statement.importClause.name.text,
      statement.moduleSpecifier.text
    );
  }

  const visit = (node) => {
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      renderedCodeProperties.has(node.name.text)
    ) {
      const propertyName = node.name.text;
      seenRenderedCodeProperties.add(propertyName);

      if (ts.isNoSubstitutionTemplateLiteral(node.initializer)) {
        const label = `pages/${fileName}#${propertyName}`;
        const rawSource = source.slice(
          node.initializer.getStart(sourceFile) + 1,
          node.initializer.end - 1
        );
        const parser =
          propertyName === 'expectedOutput' ? 'json' : 'typescript';

        if (parser === 'typescript') {
          validateSource(node.initializer.text, label, errors);
        }
        prettierChecks.push({ label, parser, source: rawSource });
      } else if (
        propertyName === 'builderCode' &&
        ts.isIdentifier(node.initializer)
      ) {
        const importPath = rawSnippetImports.get(node.initializer.text);
        const snippetFileName = importPath
          ? path.basename(importPath.replace(/\?raw$/, ''))
          : undefined;

        if (
          !importPath?.endsWith('.snippet.tsx?raw') ||
          !snippetFileName ||
          !validatedSnippetFiles.has(snippetFileName)
        ) {
          errors.push(
            `pages/${fileName}#${propertyName} must reference a validated raw recipe snippet.`
          );
        }
      } else {
        errors.push(
          `pages/${fileName}#${propertyName} must use a static template literal or a validated raw recipe snippet.`
        );
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  for (const propertyName of requiredRenderedCodeProperties) {
    if (!seenRenderedCodeProperties.has(propertyName)) {
      errors.push(`pages/${fileName} is missing ${propertyName}.`);
    }
  }
}

for (const { label, parser, source } of prettierChecks) {
  const normalizedSource = source
    .trim()
    .replaceAll(String.fromCharCode(13, 10), String.fromCharCode(10));
  const formattedSource = (
    await prettier.format(normalizedSource, {
      ...prettierConfig,
      parser,
      endOfLine: 'lf',
    })
  ).trim();

  if (normalizedSource !== formattedSource) {
    errors.push(`${label} is not Prettier formatted.`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Recipe code example formatting validation passed.');
}

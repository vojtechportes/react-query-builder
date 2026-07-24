import fs from 'node:fs';
import path from 'node:path';

export const getV1SeoOwnershipErrors = (roots) => {
  const errors = [];

  for (const root of roots) {
    const entries = fs.readdirSync(root, {
      recursive: true,
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (!entry.isFile() || !/\.(?:ts|tsx|mjs)$/.test(entry.name)) {
        continue;
      }

      const filePath = path.join(entry.parentPath, entry.name);
      const source = fs.readFileSync(filePath, 'utf8');
      const importLines = source
        .split(/\r?\n/)
        .filter((line) => /\b(?:from|import)\b/.test(line));

      for (const importLine of importLines) {
        if (
          /(?:src\/v2|[\\/]v2[\\/]|v2-(?:seo|route|search)|constants\/seo-pages|hooks\/use-page-metadata)/i.test(
            importLine
          )
        ) {
          errors.push(
            `${path.relative(process.cwd(), filePath)} has a forbidden SEO ownership import: ${importLine.trim()}`
          );
        }
      }
    }
  }

  return errors;
};

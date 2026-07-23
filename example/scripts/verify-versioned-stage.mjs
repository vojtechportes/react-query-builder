/* global process */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const target = process.argv[2];

if (target !== 'v1' && target !== 'v2') {
  throw new Error(
    `Expected a version target of "v1" or "v2", received "${target}".`
  );
}

const scriptsRoot = path.dirname(fileURLToPath(import.meta.url));
const stageRoot = path.resolve(scriptsRoot, '..', '.versioned-dist', target);
const requiredPaths = [
  'index.html',
  'package-module-graph.json',
  'robots.txt',
  'sitemap.xml',
];

for (const requiredPath of requiredPaths) {
  if (!fs.existsSync(path.join(stageRoot, requiredPath))) {
    throw new Error(`${target} staging output is missing ${requiredPath}.`);
  }
}

const moduleGraph = JSON.parse(
  fs.readFileSync(path.join(stageRoot, 'package-module-graph.json'), 'utf8')
);

if (moduleGraph.target !== target) {
  throw new Error(
    `${target} staging contains the ${moduleGraph.target} package module graph.`
  );
}

if (
  moduleGraph.packageModules.length === 0 ||
  moduleGraph.oppositeModules.length > 0
) {
  throw new Error(`${target} staging failed package module isolation.`);
}

const indexHtml = fs.readFileSync(path.join(stageRoot, 'index.html'), 'utf8');

if (!indexHtml.includes('<div id="root">') || !indexHtml.includes('<h1')) {
  throw new Error(
    `${target} staging is missing the server-rendered hydration surface.`
  );
}

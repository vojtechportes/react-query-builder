import { readdir, readFile, realpath } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const target = process.argv[2];

if (target !== 'v1' && target !== 'v2') {
  throw new Error('Expected package binding target "v1" or "v2".');
}

const exampleRoot = fileURLToPath(new URL('..', import.meta.url));
const repositoryRoot = resolve(exampleRoot, '..');

const clientOutputRoot = resolve(
  exampleRoot,
  `config/package-bindings/.smoke-dist/${target}/client`
);

const packageRoot =
  target === 'v1'
    ? resolve(repositoryRoot, 'node_modules/rqb-v1')
    : resolve(exampleRoot, 'node_modules/rqb-v2');

const manifest = JSON.parse(
  await readFile(resolve(packageRoot, 'package.json'), 'utf8')
);

if (target === 'v1' && manifest.version !== '1.33.1') {
  throw new Error(`v1 resolved ${manifest.version}; expected 1.33.1.`);
}

if (
  target === 'v2' &&
  (await realpath(packageRoot)) !== (await realpath(repositoryRoot))
) {
  throw new Error('v2 did not resolve to the local repository package.');
}

const moduleGraph = JSON.parse(
  await readFile(resolve(clientOutputRoot, 'package-module-graph.json'), 'utf8')
);

if (
  moduleGraph.target !== target ||
  moduleGraph.packageModules.length === 0 ||
  moduleGraph.oppositeModules.length > 0
) {
  throw new Error(
    `${target} module graph failed isolation: ${JSON.stringify(moduleGraph)}`
  );
}

const clientFiles = await readdir(clientOutputRoot);

const clientJavaScript = (
  await Promise.all(
    clientFiles
      .filter((file) => file.endsWith('.mjs'))
      .map((file) => readFile(resolve(clientOutputRoot, file), 'utf8'))
  )
).join('\n');

const forbiddenIdentity = target === 'v1' ? 'rqb-v2' : 'rqb-v1';

if (clientJavaScript.includes(forbiddenIdentity)) {
  throw new Error(`${target} client output contains ${forbiddenIdentity}.`);
}

if (target === 'v1' && clientFiles.some((file) => file.endsWith('.css'))) {
  throw new Error('v1 unexpectedly emitted a v2 stylesheet.');
}

const ssrModule = await import(
  new URL(
    `../config/package-bindings/.smoke-dist/${target}/ssr/ssr-surface.mjs`,
    import.meta.url
  )
);

const ssrOutput = ssrModule.renderPackageBindingSsrSmoke();

if (!/(?:function|object):function:package-binding/.test(ssrOutput)) {
  throw new Error(`${target} SSR smoke output was invalid: ${ssrOutput}`);
}

console.log(`${target} package binding verified.`);

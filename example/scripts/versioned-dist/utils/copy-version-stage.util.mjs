import fs from 'node:fs';
import path from 'node:path';

export const copyVersionStage = (stageRoot, distRoot, target) => {
  const graphPath = path.join(stageRoot, 'package-module-graph.json');
  const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));

  if (
    graph.target !== target ||
    graph.packageModules.length === 0 ||
    graph.oppositeModules.length > 0
  ) {
    throw new Error(`${target} staging failed package isolation.`);
  }

  fs.cpSync(stageRoot, path.join(distRoot, target), {
    recursive: true,
    filter: (source) =>
      !source.endsWith('package-module-graph.json') &&
      !source.endsWith('route-redirect-manifest.json') &&
      !source.includes(`${path.sep}.ssg${path.sep}`) &&
      !source.endsWith(`${path.sep}.ssg`),
  });
};

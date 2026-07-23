import type { Plugin } from 'vite';
import type { VersionTarget } from '../types/version-target';

export const createVersionEntryPlugin = (target: VersionTarget): Plugin => ({
  name: `select-${target}-client-entry`,
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      const legacyEntry = 'src="/src/main.tsx"';

      if (!html.includes(legacyEntry)) {
        throw new Error('The legacy client entry was not found in index.html.');
      }

      return html.replace(legacyEntry, `src="/src/${target}/entry-client.tsx"`);
    },
  },
});

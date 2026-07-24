import { escapeHtml } from './escape-html.util.mjs';
import { setHtmlTag } from './set-html-tag.util.mjs';

export const setMetaName = (html, name, content) => {
  const tag = `<meta name="${name}" content="${escapeHtml(content)}" />`;

  return setHtmlTag(
    html,
    new RegExp(
      `<meta\\s+name=["']${name}["']\\s+content=["'][^"']*["']\\s*/?>`,
      'i'
    ),
    tag
  );
};

import { escapeHtml } from './escape-html.util.mjs';
import { setHtmlTag } from './set-html-tag.util.mjs';

export const setMetaProperty = (html, property, content) => {
  const tag = `<meta property="${property}" content="${escapeHtml(content)}" />`;

  return setHtmlTag(
    html,
    new RegExp(
      `<meta\\s+property=["']${property}["']\\s+content=["'][^"']*["']\\s*/?>`,
      'i'
    ),
    tag
  );
};

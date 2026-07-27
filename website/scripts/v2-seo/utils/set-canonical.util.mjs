import { escapeHtml } from './escape-html.util.mjs';
import { setHtmlTag } from './set-html-tag.util.mjs';

export const setCanonical = (html, canonicalUrl) => {
  const tag = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;

  return setHtmlTag(
    html,
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    tag
  );
};

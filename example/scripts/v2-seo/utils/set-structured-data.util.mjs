import { setHtmlTag } from './set-html-tag.util.mjs';

export const setStructuredData = (html, structuredData) => {
  const json = JSON.stringify(structuredData).replace(/</g, '\\u003c');
  const tag = `<script id="structured-data-page" type="application/ld+json">${json}</script>`;

  return setHtmlTag(
    html,
    /<script\s+id=["']structured-data-page["']\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
    tag
  );
};
